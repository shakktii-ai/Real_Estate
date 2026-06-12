import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export function getTokenFromRequest(req) {
  return req.cookies.get("token")?.value || null;
}

export async function getSessionUser(req) {
  if (!JWT_SECRET) return null;

  const token = getTokenFromRequest(req);
  if (!token) return null;

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed", error);
    return null;
  }

  if (!payload?.userId) return null;

  await connectToDatabase();
  const user = await User.findById(payload.userId);
  return user || null;
}

export async function findUserByIdentifier(identifier) {
  if (!identifier) return null;

  await connectToDatabase();

  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    const userById = await User.findById(identifier);
    if (userById) return userById;
  }

  return await User.findOne({ uid: identifier });
}

export function createJwtToken(user) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
}
