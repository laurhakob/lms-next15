// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    thumbnail: v.string(),
    category: v.string(),
    level: v.string(),
    duration: v.number(),
    price: v.number(),
    status: v.string(),
    creatorId: v.id("users"),
  }).index("by_creator", ["creatorId"]),
  chapters: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    order: v.number(),
  }).index("by_course", ["courseId"]),
  lessons: defineTable({
    chapterId: v.id("chapters"),
    title: v.string(),
    order: v.number(),
  }).index("by_chapter", ["chapterId"]),
});

export default schema;