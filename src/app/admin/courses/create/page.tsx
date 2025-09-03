"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Undo, 
  Redo, 
  Upload 
} from "lucide-react";
import { ArrowLeft, SparkleIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import slugify from "slugify";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
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
        thumbnail: thumbnail || "",
        category,
        level,
        duration: parseFloat(duration),
        price: parseFloat(price),
        status,
      });
      setTitle("");
      setSlug("");
      setDescription("");
      setThumbnail(null);
      setCategory("");
      setLevel("Beginner");
      setDuration("");
      setPrice("");
      setStatus("");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const isActive = (check: () => boolean | undefined): string => {
    return editor ? (check() ? "bg-[#195a5a]/60 text-white font-bold" : "text-gray-300 hover:bg-[#195a5a]/20") : "text-gray-300 hover:bg-[#195a5a]/20";
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm"
            asChild
          >
            <Link href="/admin/dashboard">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-extrabold text-[#195a5a] tracking-tight animate-fade-in">
            Create a New Course
          </h1>
        </div>
        <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] p-6">
            <CardTitle className="text-2xl font-bold text-white">
              Course Details
            </CardTitle>
            <p className="text-sm text-white/80 mt-1">
              Fill in the details to create an engaging course.
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold text-[#195a5a]">
                Course Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
                className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-sm font-semibold text-[#195a5a]">
                Slug
              </Label>
              <div className="flex gap-3">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter course slug"
                  className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm"
                  onClick={handleGenerateSlug}
                >
                  <SparkleIcon className="w-4 h-4 mr-2" />
                  Generate Slug
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-[#195a5a]">
                Description
              </Label>
              <div className="border border-[#195a5a]/20 bg-white/50 rounded-md shadow-sm focus-within:outline-none">
                <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("bold"))}`}
                  >
                    <Bold className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("italic"))}`}
                  >
                    <Italic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("strike"))}`}
                  >
                    <Strikethrough className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 1 }))}`}
                  >
                    <Heading1 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 2 }))}`}
                  >
                    <Heading2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 3 }))}`}
                  >
                    <Heading3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("bulletList"))}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("orderedList"))}`}
                  >
                    <ListOrdered className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "left" }))}`}
                  >
                    <AlignLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "center" }))}`}
                  >
                    <AlignCenter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "right" }))}`}
                  >
                    <AlignRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().undo().run()}
                    className={`px-2 py-1 rounded ${isActive(() => false)}`}
                    disabled={!editor?.can().undo()}
                  >
                    <Undo className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().redo().run()}
                    className={`px-2 py-1 rounded ${isActive(() => false)}`}
                    disabled={!editor?.can().redo()}
                  >
                    <Redo className="w-5 h-5" />
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className="p-2 min-h-[150px] focus-within:outline-none bg-white/50"
                />
              </div>
            </div>

            <div className="space-y-6">
              <Label htmlFor="thumbnail" className="text-sm font-semibold text-[#195a5a]">
                Thumbnail Image
              </Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-[#195a5a]/30 bg-white/70 rounded-lg p-6 text-center transition-all duration-300 ${
                  isDragActive ? "bg-[#e6f4ea] border-[#195a5a]/50" : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt="Thumbnail Preview"
                      width={200}
                      height={150}
                      className="rounded-lg shadow-md object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="mx-auto text-[#195a5a] w-16 h-16 mb-2 animate-pulse" />
                      <p className="text-lg text-[#2a7b7b] mb-2">
                        Drop your files here or click to upload
                      </p>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-md"
                  >
                    Select File
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-semibold text-[#195a5a]">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border-[#195a5a]/20">
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
                      <SelectItem key={cat} value={cat} className="hover:bg-[#195a5a]/10">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="level" className="text-sm font-semibold text-[#195a5a]">
                  Level
                </Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border-[#195a5a]/20">
                    {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                      <SelectItem key={lvl} value={lvl} className="hover:bg-[#195a5a]/10">
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="duration" className="text-sm font-semibold text-[#195a5a]">
                  Duration (hours)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                  className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="price" className="text-sm font-semibold text-[#195a5a]">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-semibold text-[#195a5a]">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md border-[#195a5a]/20">
                  {["Draft", "Published", "Archived"].map((stat) => (
                    <SelectItem key={stat} value={stat} className="hover:bg-[#195a5a]/10">
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              onClick={handleSubmit}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Course
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}