# English and Spanish

The learner selects a course language in the header. Signed-in preferences are saved in PostgreSQL. English data remains in the existing tables; Spanish uses separate course, progress, attempt and answer tables with the same database integrity constraints. Accounts and first-login onboarding are shared. Local vocabulary, activity, profile and journey caches use language-specific keys.

Spanish has 150 generated lesson records per level A1–C2, with vocabulary, bilingual examples, practice prompts and 15 block assessments per level. The higher-level examples currently use reusable language frames over 25 themes; they require editorial and pedagogical review before claiming a complete advanced curriculum or certified CEFR alignment. Lesson and vocabulary properties named `en` represent the studied-language text for compatibility with existing components.

Audio reading uses browser synthesis (`es-ES` for Spanish), not recorded teaching audio. Availability depends on installed browser voices. AI conversation and dictionary require the existing server AI configuration; pronunciation assessment requires Azure Speech. The Spanish studio and review use Spanish course content, while English complementary exercises retain their existing implementation.
