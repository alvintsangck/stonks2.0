import express, { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { checkPassword, hashPassword } from "../util/hash";
import { HttpError, User } from "../util/models";
import { multerSingle } from "../util/multer";
import { isLoggedIn } from "../middlewares/guard";
import crypto from "crypto";
import { logger } from "../util/logger";
import { wrapControllerMethod } from "../util/helper";
import jwt from "../util/jwt";
import jwtSimple from "jwt-simple";
import permit from "../util/permit";

export class UserController {
	constructor(private userService: UserService) {
		this.router.post("/user", wrapControllerMethod(this.register));
		this.router.put("/user", isLoggedIn, multerSingle, wrapControllerMethod(this.updateUser));
		this.router.post("/user/login", wrapControllerMethod(this.login));
		this.router.get("/user/login/google", this.loginGoogle);
		this.router.get("/user/portfolio", isLoggedIn, wrapControllerMethod(this.getPortfolio));
		this.router.get("/user/balance", isLoggedIn, wrapControllerMethod(this.getBalance));
	}

	router = express.Router();

	login = async (req: Request) => {
		if (!req.body.username || !req.body.password) {
			throw new HttpError(401, "Invalid username or password.");
		}
		const { username, password } = req.body;
		let foundUser: User;

		/@/.test(username)
			? (foundUser = await this.userService.getUserByEmail(username))
			: (foundUser = await this.userService.getUserByUsername(username));

		if (!foundUser || !(await checkPassword(password, foundUser.password))) {
			throw new HttpError(400, "Invalid username or password.");
		}

		const { password: foundPassword, ...user } = foundUser;
		logger.info("%o", user);
		const payload = { ...user };
		const token = jwtSimple.encode(payload, jwt.jwtSecret);
		return { token };
	};

	register = async (req: Request) => {
		const error = await this.validateInput(req);
		if (error) throw error;
		let { username, email, password } = req.body;
		password = await hashPassword(password.toString());

		let user: User = await this.userService.addUser(username, password, email);
		return { user };
	};

	updateUser = async (req: Request) => {
		let { username, password, confirmPassword } = req.body;
		const userId = req.session["user"].id;
		let filename = req.file ? req.file.filename : null;

		if (password != confirmPassword) throw new HttpError(400, "Invalid password.");
		let hashedPassword = password ? await hashPassword(password) : null;
		!username && (username = null);

		await this.userService.updateSetting(username, hashedPassword, filename, userId);
		return;
	};

	loginGoogle = async (req: Request, res: Response) => {
		const accessToken = req.session?.["grant"].response.access_token;
		const googleUserInfo = await this.userService.getGoogleInfo(accessToken);
		let foundUser: User = await this.userService.getUserByEmail(googleUserInfo.email);
		if (!foundUser) {
			foundUser = await this.userService.addUser(
				googleUserInfo.name.concat(Date.now()),
				await hashPassword(crypto.randomBytes(20).toString("hex")),
				googleUserInfo.email
			);
		}
		// req.session["user"] = foundUser;
		// res.redirect("/portfolio.html");
	};

	getPortfolio = async (req: Request) => {
		const token = permit.check(req);
		const user: User = jwtSimple.decode(token, jwt.jwtSecret);
		if (user.id <= 0) throw new HttpError(400, "User not exist");
		const portfolio = await this.userService.getUserPortfolio(user.id);
		return { portfolio };
	};

	getBalance = async (req: Request) => {
		const token = permit.check(req);
		const user: User = jwtSimple.decode(token, jwt.jwtSecret);
		if (user.id <= 0) throw new HttpError(400, "User not exist");

		const { deposit, cash } = await this.userService.getBalance(user.id);
		return { deposit, cash };
	};

	async validateInput(req: Request) {
		let { username, email, password, confirmPassword } = req.body;

		let whiteSpace = /^\s+/;
		if (username.match(whiteSpace) || email.match(whiteSpace) || password.match(whiteSpace)) {
			return new HttpError(400, "Cannot be empty.");
		}

		if (username.match(/@/)) return new HttpError(400, "Cannot use @ in username.");
		if (password !== confirmPassword) return new HttpError(400, "The passwords you entered do not match.");

		let user = await this.userService.getUserByUsername(username);
		if (user) return new HttpError(400, "Username has been used.");
		let userEmail = await this.userService.getUserByEmail(email);
		if (userEmail) return new HttpError(400, "This email address is not available. Choose a different address.");
		return;
	}
}
