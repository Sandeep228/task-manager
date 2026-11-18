import { test } from "node:test";
import assert from "node:assert/strict";
import Task from "../src/models/Task.js";

// validateSync needs no database connection.
const errors = data => new Task(data).validateSync()?.errors ?? {};

test("accepts a valid task and applies defaults", () => {
  const t = new Task({ title: "  Write report " });
  assert.equal(t.validateSync(), undefined);
  assert.equal(t.title, "Write report");
  assert.equal(t.priority, "medium");
  assert.equal(t.done, false);
});

test("rejects missing or blank title", () => {
  assert.ok(errors({}).title);
  assert.ok(errors({ title: "   " }).title);
});

test("rejects titles over 120 characters", () => {
  assert.ok(errors({ title: "x".repeat(121) }).title);
});

test("rejects bad priority and bad due date", () => {
  assert.ok(errors({ title: "a", priority: "urgent" }).priority);
  assert.ok(errors({ title: "a", due: "tomorrow" }).due);
  assert.equal(errors({ title: "a", due: "2026-12-01" }).due, undefined);
});
