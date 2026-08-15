import { NextResponse } from "next/server";
import { castVote, getVoteCounts, type VoteSide } from "@/lib/db";
import { isValidFightId } from "@/lib/fight-ids";

export async function GET(request: Request) {
  const fightId = new URL(request.url).searchParams.get("fightId");
  if (!isValidFightId(fightId)) {
    return NextResponse.json({ error: "Unknown fight" }, { status: 400 });
  }

  const counts = await getVoteCounts(fightId);
  return NextResponse.json({ counts });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const fightId = body?.fightId;
  const side = body?.side;
  const voterId = body?.voterId;

  if (!isValidFightId(fightId)) {
    return NextResponse.json({ error: "Unknown fight" }, { status: 400 });
  }
  if (side !== "left" && side !== "right") {
    return NextResponse.json({ error: "Invalid side" }, { status: 400 });
  }
  if (typeof voterId !== "string" || voterId.length < 8 || voterId.length > 128) {
    return NextResponse.json({ error: "Invalid voter id" }, { status: 400 });
  }

  const result = await castVote(fightId, side as VoteSide, voterId);
  return NextResponse.json(result);
}
