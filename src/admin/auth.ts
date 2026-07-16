import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config";

function safeEqual(a: string, b: string): boolean {
  const bufA = crypto.createHash("sha256").update(a).digest();
  const bufB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? "";
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice("Basic ".length), "base64").toString("utf-8");
    const password = decoded.slice(decoded.indexOf(":") + 1);
    if (safeEqual(password, config.adminPassword)) {
      next();
      return;
    }
  }
  res.set("WWW-Authenticate", 'Basic realm="Panel de administración"');
  res.sendStatus(401);
}
