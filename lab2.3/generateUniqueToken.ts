import * as crypto from "node:crypto";

export const generateUniqueToken = crypto.randomBytes(32).toString('base64url')