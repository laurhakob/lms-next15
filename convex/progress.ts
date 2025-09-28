
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const toggleLessonCompletion = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if already exists
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { completed: !existing.completed });
    } else {
      await ctx.db.insert("progress", {
        userId,
        lessonId: args.lessonId,
        completed: true,
      });
    }

    return true;
  },
});

export const getLessonProgress = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    return progress?.completed || false;
  },
});

export const getCourseProgress = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    const lessonIds: Id<"lessons">[] = [];
    for (const chapter of chapters) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
        .collect();
      lessonIds.push(...lessons.map(l => l._id));
    }

    const progresses = await Promise.all(
      lessonIds.map(async (lessonId) => {
        const progress = await ctx.db
          .query("progress")
          .withIndex("by_user_lesson", (q) =>
            q.eq("userId", userId).eq("lessonId", lessonId)
          )
          .first();
        return { lessonId, completed: progress?.completed || false };
      })
    );

    return progresses;
  },
});