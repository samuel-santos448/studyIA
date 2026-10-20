import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spokenText} from '../backend/spoken-text.mjs';
test('spoken replies strip Markdown and emoji while preserving multilingual sentences',()=>{
 assert.equal(spokenText("Hello, Samuel! 😊 ---\n**Next question:** 🌍 *Where are you from?*"),'Hello, Samuel! Next question: Where are you from?');
 assert.equal(spokenText("# Olá\n---\nI'm a student. 日本語 [practice](https://example.com)"),"Olá I'm a student. 日本語 practice");
});
