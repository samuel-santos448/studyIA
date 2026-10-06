CREATE TABLE onboarding(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,finished_at timestamptz NOT NULL DEFAULT now());
