import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type VoteSide = "left" | "right";

export interface VoteCounts {
  left: number;
  right: number;
}

export interface Comment {
  id: string;
  fightId: string;
  author: string;
  body: string;
  createdAt: string;
}

export async function getVoteCounts(fightId: string): Promise<VoteCounts> {
  const rows = await sql`
    SELECT side, COUNT(*)::int AS count
    FROM votes
    WHERE fight_id = ${fightId}
    GROUP BY side
  `;
  const counts: VoteCounts = { left: 0, right: 0 };
  for (const row of rows as { side: VoteSide; count: number }[]) {
    counts[row.side] = row.count;
  }
  return counts;
}

/**
 * Records a vote. If this voter already voted in this fight, the existing
 * vote wins (unique constraint on fight_id+voter_id) — returns their
 * original side instead of double-counting.
 */
export async function castVote(
  fightId: string,
  side: VoteSide,
  voterId: string,
): Promise<{ side: VoteSide; counts: VoteCounts }> {
  const existing = await sql`
    SELECT side FROM votes WHERE fight_id = ${fightId} AND voter_id = ${voterId}
  `;
  if (existing.length === 0) {
    await sql`
      INSERT INTO votes (fight_id, side, voter_id)
      VALUES (${fightId}, ${side}, ${voterId})
      ON CONFLICT (fight_id, voter_id) DO NOTHING
    `;
  }
  const finalSide = ((existing[0] as { side: VoteSide } | undefined)?.side ?? side) as VoteSide;
  const counts = await getVoteCounts(fightId);
  return { side: finalSide, counts };
}

export async function getComments(
  fightId: string,
  limit: number,
  offset: number,
): Promise<{ comments: Comment[]; hasMore: boolean }> {
  const rows = await sql`
    SELECT id, fight_id, author, body, created_at
    FROM comments
    WHERE fight_id = ${fightId}
    ORDER BY created_at DESC
    LIMIT ${limit + 1} OFFSET ${offset}
  `;
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const comments: Comment[] = page.map((row) => ({
    id: String(row.id),
    fightId: row.fight_id,
    author: row.author,
    body: row.body,
    createdAt: row.created_at,
  }));
  return { comments, hasMore };
}

export async function postComment(
  fightId: string,
  author: string,
  body: string,
): Promise<Comment> {
  const rows = await sql`
    INSERT INTO comments (fight_id, author, body)
    VALUES (${fightId}, ${author}, ${body})
    RETURNING id, fight_id, author, body, created_at
  `;
  const row = rows[0];
  return {
    id: String(row.id),
    fightId: row.fight_id,
    author: row.author,
    body: row.body,
    createdAt: row.created_at,
  };
}
