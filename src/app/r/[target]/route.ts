import { NextRequest, NextResponse } from "next/server";

/**
 * Redirect /r/[target] to /login/[target] on this app.
 * Links in seed use https://www-website.vercel.app/r/amazon (etc.);
 * this redirects to https://www-website.vercel.app/login/amazon.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) {
  const { target: slug } = await params;
  const origin = request.nextUrl.origin;
  if (!slug || typeof slug !== "string") {
    return NextResponse.redirect(new URL("/", origin), 302);
  }
  const url = `${origin}/login/${encodeURIComponent(slug)}`;
  return NextResponse.redirect(url, 302);
}
