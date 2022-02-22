import { Request, Response } from "express";
import { Knex } from "knex";
import { UserService } from "../../services/user.service";
import { checkPassword } from "../../util/hash";
import { User } from "../../util/models";
import { UserController } from "../../controllers/user.controller";

jest.mock("../../services/user.service");
jest.mock("../../util/hash");

describe("UserController", () => {
	let controller: UserController;
	let service: UserService;
	let req: Request;
	let res: Response;
	// let resStatusSpy: jest.SpyInstance;
	let resJsonSpy: jest.SpyInstance;
	let resRedirectSpy: jest.SpyInstance;

	beforeEach(function () {
		let user: User = {
			id: 1,
			username: "1",
			password: "123",
			email: "",
			avatar: "",
			balance: 0,
			role: "user",
		};
		service = new UserService({} as Knex);
		service.getUserByUsername = jest.fn((username) => Promise.resolve(user));
		service.getUserByEmail = jest.fn((email) => Promise.resolve({ username:email, password: user.password }));
		service.addUser = jest.fn((username, password, email) => Promise.resolve());
		jest.spyOn(service, "getGoogleInfo").mockImplementation(async (accessToken) => user);

		controller = new UserController(service);
		req = {
			body: {},
			session: {},
			grant: { response: { accessToken: 1 } },
		} as any as Request;
		res = {
			status: jest.fn(() => res),
			json: jest.fn(),
			redirect: jest.fn(),
		} as any as Response;
		// resStatusSpy = jest.spyOn(res, "status");
		resJsonSpy = jest.spyOn(res, "json");
		resRedirectSpy = jest.spyOn(res, "redirect");
	});

	describe("GET /user", () => {
		test("get with user logged in", async () => {
			req.session["user"] = { id: 1 };
			controller.get(req, res);
			expect(resJsonSpy).toBeCalledWith({ user: { id: 1 } });
		});

		test("get without user logged in", async () => {
			controller.get(req, res);
			expect(resJsonSpy).toBeCalledWith({ user: null });
		});
	});

	describe("POST /user", () => {
		test.todo("register");
	});

	describe("PUT /user", () => {
		test.todo("updateUser");
	});

	describe("POST /user/login", () => {
		test("login with username", async () => {
			(checkPassword as jest.Mock).mockReturnValue(true);
			req.body = { username: "1", password: "123" };
			const result = await controller.login(req);
			expect(checkPassword).toBeCalledWith("123", "123");
			expect(service.getUserByUsername).toBeCalled();
			expect(result).toMatchObject({ message: "User 1 logged in." });
		});

		test("login with email", async () => {
			(checkPassword as jest.Mock).mockReturnValue(true);
			req.body = { username: "1@1.com", password: "123" };
			const result = await controller.login(req);
			expect(service.getUserByEmail).toBeCalled();
			expect(checkPassword).toBeCalledWith("123", "123");
			expect(result).toMatchObject({ message: "User 1@1.com logged in." });
		});

		test("throw error with invalid username", async () => {
			service.getUserByUsername = jest.fn(() => Promise.resolve(null));
			await expect(controller.login(req)).rejects.toThrowError("Invalid username or password.");
		});

		test("throw error with invalid password", async () => {
			(checkPassword as jest.Mock).mockReturnValue(false);
			await expect(controller.login(req)).rejects.toThrowError("Invalid username or password.");
		});
	});

	describe("POST /user/login/google", () => {
		test.todo("loginGoogle");
	});

	describe("POST /user/logout", () => {
		test("logout", () => {
			controller.logout(req, res);
			expect(req.session["user"]).toBeUndefined();
			expect(resRedirectSpy).toBeCalled();
		});
	});

	describe("POST /user/validate", () => {
		test.todo("validateInput");
	});
});
