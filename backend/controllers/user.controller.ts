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

export class UserController {
	constructor(private userService: UserService) {
		this.router.get("/user", this.get);
		this.router.post("/user", wrapControllerMethod(this.register));
		this.router.put("/user", isLoggedIn, multerSingle, wrapControllerMethod(this.updateUser));
		this.router.post("/user/login", wrapControllerMethod(this.login));
		this.router.get("/user/login/google", this.loginGoogle);
		this.router.get("/user/logout", isLoggedIn, this.logout);
		this.router.get("/user/portfolio", isLoggedIn, wrapControllerMethod(this.getPortfolio));
	}

	router = express.Router();

	get = (req: Request, res: Response) => {
		req.session && req.session["user"] ? res.json({ user: req.session["user"] }) : res.json({ user: null });
	};

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
		const payload = { ...user };
		const token = jwtSimple.encode(payload, jwt.jwtSecret);
		return token;
	};

	register = async (req: Request) => {
		let error = await this.validateInput(req);
		if (error) {
			throw error;
		}
		let { username, email, password } = req.body;
		password = await hashPassword(password.toString());

		let user: User = await this.userService.addUser(username, password, email);
		req.session && (req.session["user"] = user);
		return { message: `user ${user.username} registered` };
	};

	updateUser = async (req: Request) => {
		let { username, password, confirmPassword } = req.body;
		const userId = req.session["user"].id;
		let filename = req.file ? req.file.filename : null;

		if (password != confirmPassword) {
			logger.debug("check !password");
			throw new HttpError(400, "Invalid password.");
		}
		let hashedPassword = password ? await hashPassword(password) : null;
		!username && (username = null);

		await this.userService.updateSetting(username, hashedPassword, filename, userId);
		return;
	};

	loginGoogle = async (req: Request, res: Response) => {
		let accessToken = req.session?.["grant"].response.access_token;
		let googleUserInfo = await this.userService.getGoogleInfo(accessToken);
		let foundUser: User = await this.userService.getUserByEmail(googleUserInfo.email);
		if (!foundUser) {
			let googleAccount = {
				username: googleUserInfo.name.concat(Date.now()),
				password: await hashPassword(crypto.randomBytes(20).toString("hex")),
				email: googleUserInfo.email,
			};
			foundUser = await this.userService.addUser(
				googleAccount.username,
				googleAccount.password,
				googleAccount.email
			);
		}
		req.session["user"] = foundUser;
		res.redirect("/portfolio.html");
	};

	logout = (req: Request, res: Response) => {
		delete req.session["user"];
		res.redirect("/index.html");
	};

	getPortfolio = async (req: Request) => {
		return await this.userService.getUserPortfolio(Number(req.session["user"].id));
	};

	async validateInput(req: Request) {
		let { username, email, password, confirmPassword } = req.body;

		let whiteSpace = /^\s+/;
		if (username.match(whiteSpace) || email.match(whiteSpace) || password.match(whiteSpace)) {
			return new HttpError(400, "Cannot into space.");
		}

		if (username.match(/@/)) {
			return new HttpError(400, "Cannot use @ in username.");
		}
		if (password !== confirmPassword) {
			return new HttpError(400, "The passwords you entered do not match.");
		}

		let user = await this.userService.getUserByUsername(username);
		if (user) return new HttpError(400, "Username has been used.");
		let userEmail = await this.userService.getUserByEmail(email);
		if (userEmail) return new HttpError(400, "This email address is not available. Choose a different address.");
		return;
	}
}
