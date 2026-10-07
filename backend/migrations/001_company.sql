CREATE TABLE company(id text PRIMARY KEY CHECK(id='primary'),name text NOT NULL CHECK(length(name) BETWEEN 2 AND 80));
CREATE TABLE users(id uuid PRIMARY KEY,company_id text NOT NULL REFERENCES company(id),email text NOT NULL UNIQUE CHECK(email=lower(email)),name text NOT NULL CHECK(length(name) BETWEEN 2 AND 80),password text NOT NULL,role text NOT NULL CHECK(role IN ('admin','student')),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE sessions(token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,csrf text NOT NULL,expires bigint NOT NULL);
CREATE INDEX sessions_expiry ON sessions(expires);
CREATE TABLE invitations(token_hash text PRIMARY KEY,email text NOT NULL UNIQUE,expires bigint NOT NULL,created_by uuid NOT NULL REFERENCES users(id));
CREATE TABLE learner_state(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,declared text NOT NULL DEFAULT 'A1' CHECK(declared IN ('A1','A2','B1','B2','C1','C2')),entry text DEFAULT 'A1' CHECK(entry IN ('A1','A2','B1','B2','C1','C2')),pending text CHECK(pending IN ('A2','B1','B2','C1','C2')),CHECK((entry IS NULL)=(pending IS NOT NULL)));
CREATE TABLE lesson_progress(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,lesson_id text NOT NULL CHECK(lesson_id ~ '^(A1|A2|B1|B2|C1|C2)-(00[1-9]|0[1-9][0-9]|1[0-4][0-9]|150)$'),stage smallint NOT NULL CHECK(stage BETWEEN 0 AND 2),completed_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,lesson_id,stage));
CREATE TABLE exam_attempts(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,exam_id text NOT NULL CHECK(exam_id ~ '^(placement-(A2|B1|B2|C1|C2)|block-(A1|A2|B1|B2|C1|C2)-(0[1-9]|1[0-5]))$'),status text NOT NULL CHECK(status IN ('active','completed','abandoned')),score smallint CHECK(score BETWEEN 0 AND 100),created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,CHECK((status='completed')=(score IS NOT NULL)),CHECK((status='completed')=(finished_at IS NOT NULL)));
CREATE UNIQUE INDEX one_active_exam ON exam_attempts(user_id) WHERE status='active';
CREATE INDEX attempts_by_user ON exam_attempts(user_id,created_at);
CREATE TABLE exam_answers(attempt_id uuid NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,question_index smallint NOT NULL CHECK(question_index BETWEEN 0 AND 9),mark smallint NOT NULL CHECK(mark IN (0,100)),source text NOT NULL CHECK(source IN ('choice','listening','writing','azure-speech')),created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(attempt_id,question_index));
ALTER TABLE exam_answers ADD CONSTRAINT question_source CHECK((question_index BETWEEN 0 AND 2 AND source='choice') OR (question_index BETWEEN 3 AND 5 AND source='listening') OR (question_index BETWEEN 6 AND 7 AND source='writing') OR (question_index BETWEEN 8 AND 9 AND source='azure-speech'));
CREATE FUNCTION verify_completed_exam() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status='completed' AND (SELECT count(*)=10 AND avg(mark)=NEW.score FROM exam_answers WHERE attempt_id=NEW.id) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'A completed exam requires ten graded answers and a matching score';
 END IF;
 RETURN NEW;
END; $$;
CREATE CONSTRAINT TRIGGER completed_exam_integrity AFTER INSERT OR UPDATE ON exam_attempts DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION verify_completed_exam();
CREATE FUNCTION verify_completed_answers() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target uuid; expected smallint;
BEGIN
 target=COALESCE(NEW.attempt_id,OLD.attempt_id);
 SELECT score INTO expected FROM exam_attempts WHERE id=target AND status='completed';
 IF expected IS NOT NULL AND (SELECT count(*)=10 AND avg(mark)=expected FROM exam_answers WHERE attempt_id=target) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Completed answers must remain consistent with the recorded score';
 END IF;
 RETURN NULL;
END; $$;
CREATE CONSTRAINT TRIGGER answer_integrity AFTER INSERT OR UPDATE OR DELETE ON exam_answers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION verify_completed_answers();
