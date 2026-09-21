import assert from "node:assert/strict";
import test from "node:test";
import { getQueryFilters, stringFilter } from "../src/utils/queryFilters.js";
// Test fixtures belong here; the template has no business modules.
const filterSchema = {
  search: stringFilter({ maxLength: 100, allowEmpty: true }),
  email: stringFilter({ maxLength: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
};

const parse = (query: Record<string, unknown>) =>
  getQueryFilters(query, filterSchema, ["page", "limit", "sortBy", "sortOrder"]);

test("search trims, empty search is allowed, and exact email is preserved", () => {
  assert.equal(parse({ search: "  Tanvir  " }).search, "Tanvir");
  assert.equal(parse({ search: "   " }).search, "");
  assert.equal(parse({ email: " User@example.com " }).email, "User@example.com");
  assert.equal(parse({ page: "2" }).search, undefined);
});

test("invalid, repeated, nested and unsupported filters return 400", () => {
  for (const query of [
    { search: ["a", "b"] }, { search: { contains: "a" } },
    { search: "a".repeat(101) }, { email: "" }, { email: "invalid" },
    { email: ["a@example.com"] }, { unknown: "value" },
    JSON.parse('{"__proto__":"value"}'),
  ]) {
    assert.throws(() => parse(query), (error: any) => error.statusCode === 400);
  }
});
