
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, SparkleIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import slugify from "slugify";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const createCourse = useMutation(api.courses.create);

  const handleGenerateSlug = () => {
    if (title) {
      setSlug(slugify(title, { lower: true, strict: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse({
        title,
        slug,
        description,
        thumbnail,
        category,
        level,
        duration: parseFloat(duration),
        price: parseFloat(price),
        status,
      });
      // Reset form or redirect
      setTitle("");
      setSlug("");
      setDescription("");
      setThumbnail("");
      setCategory("");
      setLevel("Beginner");
      setDuration("");
      setPrice("");
      setStatus("");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-8 bg-green-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-neutral-700 hover:text-[#195a5a] hover:bg-[#195a5a]/10 transition-all duration-300"
          asChild
        >
          <Link href="/admin/dashboard">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900">Create Course</h1>
      </div>
      <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-green-700">Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-neutral-600">Fill in the details to create a new course.</p>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-neutral-900">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium text-neutral-900">
              Slug
            </Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Enter course slug"
                className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300"
              />
              <Button
                type="button"
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={handleGenerateSlug}
              >
                <SparkleIcon className="w-4 h-4 mr-2" />
                Generate Slug
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-neutral-900">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] min-h-[120px] transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-sm font-medium text-neutral-900">
              Thumbnail Image
            </Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Enter thumbnail URL"
              className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-neutral-900">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Development",
                    "Business",
                    "Finance",
                    "IT & Software",
                    "Office Productivity",
                    "Design",
                    "Marketing",
                    "Health & Fitness",
                    "Music",
                    "Teaching & Academics",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium text-neutral-900">
                Level
              </Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-neutral-900">
                Duration (hours)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration"
                className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300"
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-neutral-900">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-neutral-900">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a] transition-all duration-300">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {["Draft", "Published", "Archived"].map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#195a5a] text-white hover:bg-[#195a5a]/90 transition-all duration-300"
            onClick={handleSubmit}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}