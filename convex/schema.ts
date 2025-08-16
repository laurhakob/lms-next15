import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  courses: defineTable({
    title: v.string(),
    creatorId: v.id("users"),
  }).index("by_creator", ["creatorId"]),
});

export default schema;