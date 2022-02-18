import { Request, Response, NextFunction } from "express";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
	if (req.session["user"]) {
		next();
	} else {
		res.status(400).redirect("/index.html");
	}
}
