import { mutation } from "./_generated/server";
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