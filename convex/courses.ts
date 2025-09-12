import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    thumbnail: v.string(),
    category: v.string(),
    level: v.string(),
    duration: v.number(),
    price: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const courseId = await ctx.db.insert("courses", {
      title: args.title,
      slug: args.slug,
      description: args.description,
      thumbnail: args.thumbnail,
      category: args.category,
      level: args.level,
      duration: args.duration,
      price: args.price,
      status: args.status,
      creatorId: userId,
    });

    return courseId;
  },
});

export const getUserCourses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("courses")
      .withIndex("by_creator", (q) => q.eq("creatorId", userId))
      .collect();
  },
});

export const getCourseById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  },
});

export const deleteCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const course = await ctx.db.get(args.courseId);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to delete this course");
    }
    await ctx.db.delete(args.courseId);
  },
});

export const update = mutation({
  args: {
    id: v.id("courses"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    category: v.optional(v.string()),
    level: v.optional(v.string()),
    duration: v.optional(v.number()),
    price: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const course = await ctx.db.get(args.id);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to update this course");
    }
    await ctx.db.patch(args.id, {
      title: args.title ?? course.title,
      slug: args.slug ?? course.slug,
      description: args.description ?? course.description,
      thumbnail: args.thumbnail ?? course.thumbnail,
      category: args.category ?? course.category,
      level: args.level ?? course.level,
      duration: args.duration ?? course.duration,
      price: args.price ?? course.price,
      status: args.status ?? course.status,
    });
    return args.id;
  },
});

export const getPublishedCourses = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("status"), "Published"))
      .collect();

    // Fetch creator details for each course
    const coursesWithCreators = await Promise.all(
      courses.map(async (course) => {
        const creator = await ctx.db.get(course.creatorId);
        return {
          ...course,
          creatorName: creator?.name || "Unknown",
          creatorImage: creator?.image || "/placeholder-user.jpg",
        };
      })
    );

    return coursesWithCreators;
  },
});