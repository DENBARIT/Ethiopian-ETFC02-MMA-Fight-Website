import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS votes (
    id BIGSERIAL PRIMARY KEY,
    fight_id TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('left', 'right')),
    voter_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (fight_id, voter_id)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    fight_id TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Fan',
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS idx_votes_fight_id ON votes (fight_id)`;
await sql`
  CREATE INDEX IF NOT EXISTS idx_comments_fight_id_created_at
  ON comments (fight_id, created_at DESC)
`;

console.log("Database schema ready: votes, comments");
