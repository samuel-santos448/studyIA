-- Keep historical reading/audio answers and add server-graded English essays.
ALTER TABLE exam_answers DROP CONSTRAINT exam_answers_source_check;
ALTER TABLE exam_answers ADD CONSTRAINT exam_answers_source_check CHECK (source IN ('choice','listening','writing','azure-speech','essay'));
ALTER TABLE exam_answers DROP CONSTRAINT question_source;
ALTER TABLE exam_answers ADD CONSTRAINT question_source CHECK (
 (question_index BETWEEN 0 AND 2 AND source='choice') OR
 (question_index BETWEEN 3 AND 5 AND source='listening') OR
 (question_index BETWEEN 6 AND 7 AND source='writing') OR
 (question_index=8 AND source IN ('choice','azure-speech')) OR
 (question_index=9 AND source IN ('choice','azure-speech','essay'))
);
ALTER TABLE exam_answers ADD COLUMN answer_text text;
ALTER TABLE exam_answers ADD COLUMN feedback jsonb;
