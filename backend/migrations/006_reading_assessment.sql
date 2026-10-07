-- Preserve historical audio answers while allowing temporary reading questions.
DO $$
DECLARE answer_table text;
BEGIN
  FOREACH answer_table IN ARRAY ARRAY['exam_answers','es_exam_answers','fr_exam_answers','it_exam_answers','de_exam_answers','ja_exam_answers','ko_exam_answers','zh_exam_answers'] LOOP
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT question_source', answer_table);
    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT question_source CHECK (
      (question_index BETWEEN 0 AND 2 AND source = ''choice'') OR
      (question_index BETWEEN 3 AND 5 AND source = ''listening'') OR
      (question_index BETWEEN 6 AND 7 AND source = ''writing'') OR
      (question_index BETWEEN 8 AND 9 AND source IN (''choice'', ''azure-speech''))
    )', answer_table);
  END LOOP;
END $$;
