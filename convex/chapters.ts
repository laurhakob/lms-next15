import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createChapter = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.get(args.courseId);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to add chapters to this course");
    }

    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    const order = chapters.length + 1;

    const chapterId = await ctx.db.insert("chapters", {
      courseId: args.courseId,
      title: args.title,
      order,
    });

    return chapterId;
  },
});

export const getCourseStructure = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();

    return chapters;
  },
});

export const updateChapterOrder = mutation({
  args: {
    courseId: v.id("courses"),
    chapters: v.array(
      v.object({
        _id: v.id("chapters"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.get(args.courseId);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to update this course");
    }

    for (const chapter of args.chapters) {
      await ctx.db.patch(chapter._id, { order: chapter.order });
    }

    return true;
  },
});

export const deleteChapter = mutation({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const chapter = await ctx.db.get(args.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const course = await ctx.db.get(chapter.courseId);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to delete this chapter");
    }

    // Delete all lessons associated with the chapter
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .collect();

    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }

    // Delete the chapter
    await ctx.db.delete(args.chapterId);

    // Reorder remaining chapters
    const remainingChapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", chapter.courseId))
      .order("asc")
      .collect();

    for (let i = 0; i < remainingChapters.length; i++) {
      await ctx.db.patch(remainingChapters[i]._id, { order: i + 1 });
    }

    return true;
  },
});

export const getAllChaptersCount = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("chapters").collect()).length;
  },
});