import { NextResponse } from "next/server";
import { getComments, postComment } from "@/lib/db";
import { isValidFightId } from "@/lib/fight-ids";
import { isSameOrigin } from "@/lib/same-origin";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 30;
const MAX_AUTHOR_LENGTH = 40;
const MAX_BODY_LENGTH = 500;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const fightId = params.get("fightId");
  if (!isValidFightId(fightId)) {
    return NextResponse.json({ error: "Unknown fight" }, { status: 400 });
  }

  const limit = Math.min(Math.max(Number(params.get("limit")) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(Number(params.get("offset")) || 0, 0);

  const result = await getComments(fightId, limit, offset);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const fightId = body?.fightId;
  const rawAuthor = typeof body?.author === "string" ? body.author.trim() : "";
  const rawBody = typeof body?.body === "string" ? body.body.trim() : "";

  if (!isValidFightId(fightId)) {
    return NextResponse.json({ error: "Unknown fight" }, { status: 400 });
  }
  if (rawBody.length === 0 || rawBody.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
  }

  const author = (rawAuthor || "Fan").slice(0, MAX_AUTHOR_LENGTH);
  const comment = await postComment(fightId, author, rawBody.slice(0, MAX_BODY_LENGTH));
  return NextResponse.json({ comment });
}
