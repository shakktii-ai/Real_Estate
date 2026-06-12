import { NextResponse } from "next/server";

export async function POST() {
  const cookieParts = [
    `token=`,
    `Path=/`,
    `HttpOnly`,
    `Max-Age=0`,
    `SameSite=Lax`,
  ];

  if (process.env.NODE_ENV === "production") {
    cookieParts.push("Secure");
  }

  return NextResponse.json(
    { message: "Logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieParts.join("; "),
      },
    }
  );
}
