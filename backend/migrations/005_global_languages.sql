CREATE TABLE de_learner_state(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,declared text NOT NULL DEFAULT 'A1' CHECK(declared IN ('A1','A2','B1','B2','C1','C2')),entry text DEFAULT 'A1' CHECK(entry IN ('A1','A2','B1','B2','C1','C2')),pending text CHECK(pending IN ('A2','B1','B2','C1','C2')),CHECK((entry IS NULL)=(pending IS NOT NULL)));
CREATE TABLE de_lesson_progress(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,lesson_id text NOT NULL CHECK(lesson_id ~ '^(A1|A2|B1|B2|C1|C2)-(00[1-9]|0[1-9][0-9]|1[0-4][0-9]|150)$'),stage smallint NOT NULL CHECK(stage BETWEEN 0 AND 2),completed_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,lesson_id,stage));
CREATE TABLE de_exam_attempts(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,exam_id text NOT NULL CHECK(exam_id ~ '^(placement-(A2|B1|B2|C1|C2)|block-(A1|A2|B1|B2|C1|C2)-(0[1-9]|1[0-5]))$'),status text NOT NULL CHECK(status IN ('active','completed','abandoned')),score smallint CHECK(score BETWEEN 0 AND 100),created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,CHECK((status='completed')=(score IS NOT NULL)),CHECK((status='completed')=(finished_at IS NOT NULL)));
CREATE UNIQUE INDEX de_one_active_exam ON de_exam_attempts(user_id) WHERE status='active';
CREATE INDEX de_attempts_by_user ON de_exam_attempts(user_id,created_at);
CREATE TABLE de_exam_answers(attempt_id uuid NOT NULL REFERENCES de_exam_attempts(id) ON DELETE CASCADE,question_index smallint NOT NULL CHECK(question_index BETWEEN 0 AND 9),mark smallint NOT NULL CHECK(mark IN (0,100)),source text NOT NULL CHECK(source IN ('choice','listening','writing','azure-speech')),created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(attempt_id,question_index));
ALTER TABLE de_exam_answers ADD CONSTRAINT question_source CHECK((question_index BETWEEN 0 AND 2 AND source='choice') OR (question_index BETWEEN 3 AND 5 AND source='listening') OR (question_index BETWEEN 6 AND 7 AND source='writing') OR (question_index BETWEEN 8 AND 9 AND source='azure-speech'));
CREATE FUNCTION de_verify_completed_exam() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status='completed' AND (SELECT count(*)=10 AND avg(mark)=NEW.score FROM de_exam_answers WHERE attempt_id=NEW.id) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'A completed exam requires ten graded answers and a matching score';
 END IF;
 RETURN NEW;
END; $$;
CREATE CONSTRAINT TRIGGER de_completed_exam_integrity AFTER INSERT OR UPDATE ON de_exam_attempts DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION de_verify_completed_exam();
CREATE FUNCTION de_verify_completed_answers() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target uuid; expected smallint;
BEGIN
 target=COALESCE(NEW.attempt_id,OLD.attempt_id);
 SELECT score INTO expected FROM de_exam_attempts WHERE id=target AND status='completed';
 IF expected IS NOT NULL AND (SELECT count(*)=10 AND avg(mark)=expected FROM de_exam_answers WHERE attempt_id=target) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Completed answers must remain consistent with the recorded score';
 END IF;
 RETURN NULL;
END; $$;
CREATE CONSTRAINT TRIGGER de_answer_integrity AFTER INSERT OR UPDATE OR DELETE ON de_exam_answers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION de_verify_completed_answers();


CREATE TABLE ja_learner_state(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,declared text NOT NULL DEFAULT 'A1' CHECK(declared IN ('A1','A2','B1','B2','C1','C2')),entry text DEFAULT 'A1' CHECK(entry IN ('A1','A2','B1','B2','C1','C2')),pending text CHECK(pending IN ('A2','B1','B2','C1','C2')),CHECK((entry IS NULL)=(pending IS NOT NULL)));
CREATE TABLE ja_lesson_progress(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,lesson_id text NOT NULL CHECK(lesson_id ~ '^(A1|A2|B1|B2|C1|C2)-(00[1-9]|0[1-9][0-9]|1[0-4][0-9]|150)$'),stage smallint NOT NULL CHECK(stage BETWEEN 0 AND 2),completed_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,lesson_id,stage));
CREATE TABLE ja_exam_attempts(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,exam_id text NOT NULL CHECK(exam_id ~ '^(placement-(A2|B1|B2|C1|C2)|block-(A1|A2|B1|B2|C1|C2)-(0[1-9]|1[0-5]))$'),status text NOT NULL CHECK(status IN ('active','completed','abandoned')),score smallint CHECK(score BETWEEN 0 AND 100),created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,CHECK((status='completed')=(score IS NOT NULL)),CHECK((status='completed')=(finished_at IS NOT NULL)));
CREATE UNIQUE INDEX ja_one_active_exam ON ja_exam_attempts(user_id) WHERE status='active';
CREATE INDEX ja_attempts_by_user ON ja_exam_attempts(user_id,created_at);
CREATE TABLE ja_exam_answers(attempt_id uuid NOT NULL REFERENCES ja_exam_attempts(id) ON DELETE CASCADE,question_index smallint NOT NULL CHECK(question_index BETWEEN 0 AND 9),mark smallint NOT NULL CHECK(mark IN (0,100)),source text NOT NULL CHECK(source IN ('choice','listening','writing','azure-speech')),created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(attempt_id,question_index));
ALTER TABLE ja_exam_answers ADD CONSTRAINT question_source CHECK((question_index BETWEEN 0 AND 2 AND source='choice') OR (question_index BETWEEN 3 AND 5 AND source='listening') OR (question_index BETWEEN 6 AND 7 AND source='writing') OR (question_index BETWEEN 8 AND 9 AND source='azure-speech'));
CREATE FUNCTION ja_verify_completed_exam() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status='completed' AND (SELECT count(*)=10 AND avg(mark)=NEW.score FROM ja_exam_answers WHERE attempt_id=NEW.id) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'A completed exam requires ten graded answers and a matching score';
 END IF;
 RETURN NEW;
END; $$;
CREATE CONSTRAINT TRIGGER ja_completed_exam_integrity AFTER INSERT OR UPDATE ON ja_exam_attempts DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ja_verify_completed_exam();
CREATE FUNCTION ja_verify_completed_answers() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target uuid; expected smallint;
BEGIN
 target=COALESCE(NEW.attempt_id,OLD.attempt_id);
 SELECT score INTO expected FROM ja_exam_attempts WHERE id=target AND status='completed';
 IF expected IS NOT NULL AND (SELECT count(*)=10 AND avg(mark)=expected FROM ja_exam_answers WHERE attempt_id=target) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Completed answers must remain consistent with the recorded score';
 END IF;
 RETURN NULL;
END; $$;
CREATE CONSTRAINT TRIGGER ja_answer_integrity AFTER INSERT OR UPDATE OR DELETE ON ja_exam_answers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ja_verify_completed_answers();


CREATE TABLE ko_learner_state(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,declared text NOT NULL DEFAULT 'A1' CHECK(declared IN ('A1','A2','B1','B2','C1','C2')),entry text DEFAULT 'A1' CHECK(entry IN ('A1','A2','B1','B2','C1','C2')),pending text CHECK(pending IN ('A2','B1','B2','C1','C2')),CHECK((entry IS NULL)=(pending IS NOT NULL)));
CREATE TABLE ko_lesson_progress(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,lesson_id text NOT NULL CHECK(lesson_id ~ '^(A1|A2|B1|B2|C1|C2)-(00[1-9]|0[1-9][0-9]|1[0-4][0-9]|150)$'),stage smallint NOT NULL CHECK(stage BETWEEN 0 AND 2),completed_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,lesson_id,stage));
CREATE TABLE ko_exam_attempts(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,exam_id text NOT NULL CHECK(exam_id ~ '^(placement-(A2|B1|B2|C1|C2)|block-(A1|A2|B1|B2|C1|C2)-(0[1-9]|1[0-5]))$'),status text NOT NULL CHECK(status IN ('active','completed','abandoned')),score smallint CHECK(score BETWEEN 0 AND 100),created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,CHECK((status='completed')=(score IS NOT NULL)),CHECK((status='completed')=(finished_at IS NOT NULL)));
CREATE UNIQUE INDEX ko_one_active_exam ON ko_exam_attempts(user_id) WHERE status='active';
CREATE INDEX ko_attempts_by_user ON ko_exam_attempts(user_id,created_at);
CREATE TABLE ko_exam_answers(attempt_id uuid NOT NULL REFERENCES ko_exam_attempts(id) ON DELETE CASCADE,question_index smallint NOT NULL CHECK(question_index BETWEEN 0 AND 9),mark smallint NOT NULL CHECK(mark IN (0,100)),source text NOT NULL CHECK(source IN ('choice','listening','writing','azure-speech')),created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(attempt_id,question_index));
ALTER TABLE ko_exam_answers ADD CONSTRAINT question_source CHECK((question_index BETWEEN 0 AND 2 AND source='choice') OR (question_index BETWEEN 3 AND 5 AND source='listening') OR (question_index BETWEEN 6 AND 7 AND source='writing') OR (question_index BETWEEN 8 AND 9 AND source='azure-speech'));
CREATE FUNCTION ko_verify_completed_exam() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status='completed' AND (SELECT count(*)=10 AND avg(mark)=NEW.score FROM ko_exam_answers WHERE attempt_id=NEW.id) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'A completed exam requires ten graded answers and a matching score';
 END IF;
 RETURN NEW;
END; $$;
CREATE CONSTRAINT TRIGGER ko_completed_exam_integrity AFTER INSERT OR UPDATE ON ko_exam_attempts DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ko_verify_completed_exam();
CREATE FUNCTION ko_verify_completed_answers() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target uuid; expected smallint;
BEGIN
 target=COALESCE(NEW.attempt_id,OLD.attempt_id);
 SELECT score INTO expected FROM ko_exam_attempts WHERE id=target AND status='completed';
 IF expected IS NOT NULL AND (SELECT count(*)=10 AND avg(mark)=expected FROM ko_exam_answers WHERE attempt_id=target) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Completed answers must remain consistent with the recorded score';
 END IF;
 RETURN NULL;
END; $$;
CREATE CONSTRAINT TRIGGER ko_answer_integrity AFTER INSERT OR UPDATE OR DELETE ON ko_exam_answers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ko_verify_completed_answers();


CREATE TABLE zh_learner_state(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,declared text NOT NULL DEFAULT 'A1' CHECK(declared IN ('A1','A2','B1','B2','C1','C2')),entry text DEFAULT 'A1' CHECK(entry IN ('A1','A2','B1','B2','C1','C2')),pending text CHECK(pending IN ('A2','B1','B2','C1','C2')),CHECK((entry IS NULL)=(pending IS NOT NULL)));
CREATE TABLE zh_lesson_progress(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,lesson_id text NOT NULL CHECK(lesson_id ~ '^(A1|A2|B1|B2|C1|C2)-(00[1-9]|0[1-9][0-9]|1[0-4][0-9]|150)$'),stage smallint NOT NULL CHECK(stage BETWEEN 0 AND 2),completed_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,lesson_id,stage));
CREATE TABLE zh_exam_attempts(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,exam_id text NOT NULL CHECK(exam_id ~ '^(placement-(A2|B1|B2|C1|C2)|block-(A1|A2|B1|B2|C1|C2)-(0[1-9]|1[0-5]))$'),status text NOT NULL CHECK(status IN ('active','completed','abandoned')),score smallint CHECK(score BETWEEN 0 AND 100),created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,CHECK((status='completed')=(score IS NOT NULL)),CHECK((status='completed')=(finished_at IS NOT NULL)));
CREATE UNIQUE INDEX zh_one_active_exam ON zh_exam_attempts(user_id) WHERE status='active';
CREATE INDEX zh_attempts_by_user ON zh_exam_attempts(user_id,created_at);
CREATE TABLE zh_exam_answers(attempt_id uuid NOT NULL REFERENCES zh_exam_attempts(id) ON DELETE CASCADE,question_index smallint NOT NULL CHECK(question_index BETWEEN 0 AND 9),mark smallint NOT NULL CHECK(mark IN (0,100)),source text NOT NULL CHECK(source IN ('choice','listening','writing','azure-speech')),created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(attempt_id,question_index));
ALTER TABLE zh_exam_answers ADD CONSTRAINT question_source CHECK((question_index BETWEEN 0 AND 2 AND source='choice') OR (question_index BETWEEN 3 AND 5 AND source='listening') OR (question_index BETWEEN 6 AND 7 AND source='writing') OR (question_index BETWEEN 8 AND 9 AND source='azure-speech'));
CREATE FUNCTION zh_verify_completed_exam() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.status='completed' AND (SELECT count(*)=10 AND avg(mark)=NEW.score FROM zh_exam_answers WHERE attempt_id=NEW.id) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'A completed exam requires ten graded answers and a matching score';
 END IF;
 RETURN NEW;
END; $$;
CREATE CONSTRAINT TRIGGER zh_completed_exam_integrity AFTER INSERT OR UPDATE ON zh_exam_attempts DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION zh_verify_completed_exam();
CREATE FUNCTION zh_verify_completed_answers() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target uuid; expected smallint;
BEGIN
 target=COALESCE(NEW.attempt_id,OLD.attempt_id);
 SELECT score INTO expected FROM zh_exam_attempts WHERE id=target AND status='completed';
 IF expected IS NOT NULL AND (SELECT count(*)=10 AND avg(mark)=expected FROM zh_exam_answers WHERE attempt_id=target) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Completed answers must remain consistent with the recorded score';
 END IF;
 RETURN NULL;
END; $$;
CREATE CONSTRAINT TRIGGER zh_answer_integrity AFTER INSERT OR UPDATE OR DELETE ON zh_exam_answers DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION zh_verify_completed_answers();


ALTER TABLE language_selection DROP CONSTRAINT language_selection_language_check;
ALTER TABLE language_selection ADD CONSTRAINT language_selection_language_check CHECK(language IN ('en','es','fr','it','de','ja','ko','zh'));
