import { Bearer } from "permit";
import { NextFunction, Request, Response } from "express";
// import jwtSimple from "jwt-simple";
// import jwt from "../util/jwt";

const permit = new Bearer({
	query: "access_token",
});

export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
		const token = permit.check(req);
		if (!token) {
			return res.status(401).json({ msg: "Permission Denied" });
		}
		// const payload = jwtSimple.decode(token, jwt.jwtSecret);
		// Querying Database is not compulsory
		// const user: User = await userService.getUser(payload.id);
		// if (user) {
		// 	req.user = user;
		return next();
		// } else {
		// 	return res.status(401).json({ msg: "Permission Denied" });
		// }
	} catch (e) {
		return res.status(401).json({ msg: "Permission Denied" });
	}
}
