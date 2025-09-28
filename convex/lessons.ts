

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createLesson = mutation({
  args: {
    chapterId: v.id("chapters"),
    title: v.string(),
    description: v.optional(v.string()),
    video: v.optional(v.id("_storage")),
  },
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
      throw new Error("Not authorized to add lessons to this chapter");
    }

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .collect();

    const order = lessons.length + 1;

    const lessonId = await ctx.db.insert("lessons", {
      chapterId: args.chapterId,
      title: args.title,
      description: args.description,
      video: args.video,
      order,
    });

    return lessonId;
  },
});

export const getChapterStructure = query({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .order("asc")
      .collect();

    return lessons;
  },
});

export const updateLessonOrder = mutation({
  args: {
    chapterId: v.id("chapters"),
    lessons: v.array(
      v.object({
        _id: v.id("lessons"),
        order: v.number(),
      })
    ),
  },
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
      throw new Error("Not authorized to update this chapter");
    }

    for (const lesson of args.lessons) {
      await ctx.db.patch(lesson._id, { order: lesson.order });
    }

    return true;
  },
});

export const deleteLesson = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const chapter = await ctx.db.get(lesson.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const course = await ctx.db.get(chapter.courseId);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to delete this lesson");
    }

    // Delete the lesson
    await ctx.db.delete(args.lessonId);

    // Reorder remaining lessons
    const remainingLessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", lesson.chapterId))
      .order("asc")
      .collect();

    for (let i = 0; i < remainingLessons.length; i++) {
      await ctx.db.patch(remainingLessons[i]._id, { order: i + 1 });
    }

    return true;
  },
});

export const updateLesson = mutation({
  args: {
    id: v.id("lessons"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    video: v.optional(v.union(v.id("_storage"), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const lesson = await ctx.db.get(args.id);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const chapter = await ctx.db.get(lesson.chapterId);
    if (!chapter) {
      throw new Error("Chapter not found");
    }
    const course = await ctx.db.get(chapter.courseId);
    if (!course || course.creatorId !== userId) {
      throw new Error("Not authorized to update this lesson");
    }
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? {title: args.title} : {}),
      ...(args.description !== undefined ? {description: args.description} : {}),
      ...(args.video !== undefined ? {video: args.video ?? undefined} : {}),
    });
    return args.id;
  },
});

export const getCourseLessonsCount = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    let total = 0;
    for (const chapter of chapters) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
        .collect();
      total += lessons.length;
    }

    return total;
  },
});

export const getAllLessonsCount = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("lessons").collect()).length;
  },
});

export const getLessonById = query({
  args: { id: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getVideoUrl = query({
  args: { storageId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    if (!args.storageId) return null;
    return await ctx.storage.getUrl(args.storageId);
  },
});