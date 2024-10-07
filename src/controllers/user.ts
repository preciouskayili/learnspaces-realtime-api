import { Request, Response } from "express";

export class UserController {
  static authorize(req: Request, res: Response): void {
    const token = req.header("Authorization");

    if (token) {
      res.cookie("session", token);
      res.status(201).json({ message: "User authorized" });
    } else {
      res.status(401).json({ message: "Failed to authorize user" });
    }
  }
}
