import assert from "node:assert/strict";
import test from "node:test";
import { getQueryFilters } from "../src/utils/queryFilters.js";
import { customerFilterSchema } from "../src/modules/customer/customer.validation.js";

const parse = (query: Record<string, unknown>) =>
  getQueryFilters(query, customerFilterSchema, ["page", "limit", "sortBy", "sortOrder"]);

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

test("customer list uses matching filters for rows and pagination count", async () => {
  // No live database connections: replace all invoked Prisma operations.
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
  const { prisma } = await import("../src/config/prisma.js");
  const { customerService } = await import("../src/modules/customer/customer.service.js");
  const originalFind = prisma.customer.findMany;
  const originalCount = prisma.customer.count;
  const originalTransaction = prisma.$transaction;
  let findArgs: any, countArgs: any;
  try {
    prisma.customer.findMany = ((args: any) => { findArgs = args; return Promise.resolve([{ id: 1 }]); }) as any;
    prisma.customer.count = ((args: any) => { countArgs = args; return Promise.resolve(21); }) as any;
    prisma.$transaction = ((queries: any[]) => Promise.all(queries)) as any;
    const result = await customerService.getCustomers(
      { page: 2, limit: 10, skip: 10, take: 10 },
      { sortBy: "name", sortOrder: "desc" },
      parse({ search: "Tanvir", email: "test@example.com" }),
    );
    assert.deepEqual(findArgs.where, {
      OR: [
        { name: { contains: "Tanvir", mode: "insensitive" } },
        { email: { contains: "Tanvir", mode: "insensitive" } },
      ],
      email: { equals: "test@example.com" },
    });
    assert.deepEqual(findArgs.where, countArgs.where);
    assert.equal(findArgs.skip, 10);
    assert.deepEqual(findArgs.orderBy, [{ name: "desc" }, { id: "asc" }]);
    assert.equal(result.meta.total, 21);
    assert.equal(result.meta.totalPages, 3);
    await customerService.getCustomers({page:1,limit:10,skip:0,take:10}, undefined, parse({search:" "}));
    assert.deepEqual(findArgs.where, {});
  } finally {
    prisma.customer.findMany = originalFind;
    prisma.customer.count = originalCount;
    prisma.$transaction = originalTransaction;
    await prisma.$disconnect();
  }
});
