"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Tag,
  DollarSign,
  User,
  Info,
  ArrowLeft,
  PlusIcon,
  Trash2,
 
  Folder,
  FileText,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Separator } from "@/components/ui/separator";

// New ChapterCard component for basic view
const ChapterCard = ({ chapter, index }: { chapter: { _id: Id<"chapters">; title: string; order: number }; index: number }) => {
  const lessons = useQuery(api.lessons.getChapterStructure, { chapterId: chapter._id });
  const lessonsCount = lessons?.length || 0;

  return (
    <Card className="border border-[#195a5a]/20 bg-white/80 shadow-md rounded-xl flex items-center p-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-[#195a5a] text-white flex items-center justify-center font-bold text-lg shadow-md">
          {index + 1}
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-lg font-semibold text-[#195a5a]">{chapter.title}</p>
        <p className="text-sm text-[#2a7b7b]/60">{lessonsCount} lessons</p>
      </div>
    </Card>
  );
};

// SortableLesson component
const SortableLesson = ({
  lesson,
  setConfirmingDeleteLesson,
  courseId,
}: {
  lesson: { _id: Id<"lessons">; title: string; order: number };
  setConfirmingDeleteLesson: (data: { id: Id<"lessons">; title: string } | null) => void;
  courseId: Id<"courses">;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteLesson({ id: lesson._id, title: lesson.title });
  };

  return (
    <Link href={`/admin/courses/${courseId}/lessons/${lesson._id}`}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-pointer">
        <Card className="mb-2 border border-[#195a5a]/10 bg-white/80 shadow-sm rounded-md overflow-hidden transition-all duration-300 hover:shadow-md flex items-center">
          <FileText className="w-6 h-6 text-[#195a5a] ml-3 mr-2" />
          <CardHeader className="bg-gradient-to-r from-[#d1e8d5] to-[#b3d9b9] p-3 flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[#195a5a]">Lesson {lesson.order}: {lesson.title}</CardTitle>
              <Button
                variant="destructive"
                size="icon"
                className="bg-red-500/80 hover:bg-red-600 text-white rounded-md w-8 h-8"
                onClick={handleDeleteConfirm}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </Link>
  );
};

// SortableChapter component for chapters
const SortableChapter = ({
  chapter,
  setCreatingLessonChapterId,
  setLessonTitle,
  setConfirmingDeleteChapterId,
  setConfirmingDeleteLesson,
  courseId,
}: {
  chapter: {
    _id: Id<"chapters">;
    title: string;
    order: number;
  };
  setCreatingLessonChapterId: (id: Id<"chapters">) => void;
  setLessonTitle: (title: string) => void;
  setConfirmingDeleteChapterId: (id: Id<"chapters"> | null) => void;
  setConfirmingDeleteLesson: (data: { id: Id<"lessons">; title: string } | null) => void;
  courseId: Id<"courses">;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter._id });

  const lessons = useQuery(api.lessons.getChapterStructure, { chapterId: chapter._id });
  const updateLessonOrder = useMutation(api.lessons.updateLessonOrder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over?.id && lessons) {
      const oldIndex = lessons.findIndex((lesson) => lesson._id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson._id === over.id);
      try {
        await updateLessonOrder({
          chapterId: chapter._id,
          lessons: lessons.map((lesson, index) => ({
            _id: lesson._id,
            order: index === oldIndex ? newIndex + 1 : index === newIndex ? oldIndex + 1 : lesson.order,
          })),
        });
        toast({
          title: "Lessons Reordered",
          description: "Lesson order has been updated.",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to reorder lessons. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateLesson = () => {
    setCreatingLessonChapterId(chapter._id);
    setLessonTitle("");
  };

  const handleDeleteConfirm = () => {
    setConfirmingDeleteChapterId(chapter._id);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-6 border border-[#195a5a]/20 bg-white/90 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#e6f4ea] to-[#c3e6cb] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-6 h-6 text-[#195a5a]" />
              <CardTitle className="text-xl font-bold text-[#195a5a]">
                Chapter {chapter.order}: {chapter.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm"
                onClick={handleCreateLesson}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New Lesson
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="bg-red-500/80 hover:bg-red-600 text-white rounded-md w-8 h-8"
                onClick={handleDeleteConfirm}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={lessons?.map((l) => l._id) || []}
              strategy={verticalListSortingStrategy}
            >
              {lessons && lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <SortableLesson
                    key={lesson._id}
                    lesson={lesson}
                    setConfirmingDeleteLesson={setConfirmingDeleteLesson}
                    courseId={courseId}
                  />
                ))
              ) : (
                <p className="text-center text-[#195a5a]/80">
                  No lessons created yet.
                </p>
              )}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
      <Separator className="my-4 bg-[#195a5a]/20" />
    </div>
  );
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: Id<"courses"> }>();
  const searchParams = useSearchParams();
  const course = useQuery(api.courses.getCourseById, id ? { id } : "skip");
  const chapters = useQuery(api.chapters.getCourseStructure, id ? { courseId: id } : "skip");
  const totalLessons = useQuery(api.lessons.getCourseLessonsCount, id ? { courseId: id } : "skip");
  const createChapter = useMutation(api.chapters.createChapter);
  const updateChapterOrder = useMutation(api.chapters.updateChapterOrder);
  const deleteChapter = useMutation(api.chapters.deleteChapter);
  const createLesson = useMutation(api.lessons.createLesson);
  const deleteLesson = useMutation(api.lessons.deleteLesson);
  const initialView = (searchParams.get("view") || "basic") as "basic" | "structure";
  const [view, setView] = useState<"basic" | "structure">(initialView);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [creatingLessonChapterId, setCreatingLessonChapterId] = useState<Id<"chapters"> | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [confirmingDeleteChapterId, setConfirmingDeleteChapterId] = useState<Id<"chapters"> | null>(null);
  const [confirmingDeleteLesson, setConfirmingDeleteLesson] = useState<{ id: Id<"lessons">; title: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const totalChapters = chapters?.length || 0;

  const handleCreateChapter = async () => {
    setIsCreatingChapter(true);
    setChapterTitle("");
  }; 

  const handleSaveChapter = async () => {
    if (!id || !chapterTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid chapter name.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createChapter({
        courseId: id,
        title: chapterTitle.trim(),
      });
      toast({
        title: "Chapter Created",
        description: `Chapter "${chapterTitle}" has been added.`,
      });
      setIsCreatingChapter(false);
      setChapterTitle("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLesson = async () => {
    if (!creatingLessonChapterId || !lessonTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid lesson name.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createLesson({
        chapterId: creatingLessonChapterId,
        title: lessonTitle.trim(),
      });
      toast({
        title: "Lesson Created",
        description: `Lesson "${lessonTitle}" has been added.`,
      });
      setCreatingLessonChapterId(null);
      setLessonTitle("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelChapter = () => {
    setIsCreatingChapter(false);
    setChapterTitle("");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over?.id && chapters) {
      const oldIndex = chapters.findIndex((chapter) => chapter._id === active.id);
      const newIndex = chapters.findIndex((chapter) => chapter._id === over.id);
      try {
        await updateChapterOrder({
          courseId: id,
          chapters: chapters.map((chapter, index) => ({
            _id: chapter._id,
            order: index === oldIndex ? newIndex + 1 : index === newIndex ? oldIndex + 1 : chapter.order,
          })),
        });
        toast({
          title: "Chapters Reordered",
          description: "Chapter order has been updated.",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to reorder chapters. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelLesson = () => {
    setCreatingLessonChapterId(null);
    setLessonTitle("");
  };

  const handleDeleteChapter = async (chapterId: Id<"chapters">) => {
    try {
      await deleteChapter({ chapterId });
      toast({
        title: "Chapter Deleted",
        description: "The chapter has been successfully deleted.",
      });
      setConfirmingDeleteChapterId(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async (lessonId: Id<"lessons">) => {
    try {
      await deleteLesson({ lessonId });
      toast({
        title: "Lesson Deleted",
        description: "The lesson has been successfully deleted.",
      });
      setConfirmingDeleteLesson(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete lesson. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmingDeleteChapterId(null);
    setConfirmingDeleteLesson(null);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8 text-[#195a5a]">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl min-h-[80vh]">
          <CardHeader className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-white">
              {course.title}
            </CardTitle>
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm"
              asChild
            >
              <Link href="/admin/courses">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Courses
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between bg-[#e6f4ea]/70 border border-[#195a5a]/20 rounded-md p-2 shadow-sm">
              <Button
                variant={view === "basic" ? "default" : "outline"}
                className={
                  view === "basic"
                    ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90 flex-1"
                    : "border-[#195a5a]/30 text-[#195a5a] hover:bg-[#195a5a]/10 flex-1"
                }
                onClick={() => setView("basic")}
              >
                Basic Info
              </Button>
              <Button
                variant={view === "structure" ? "default" : "outline"}
                className={
                  view === "structure"
                    ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90 flex-1"
                    : "border-[#195a5a]/30 text-[#195a5a] hover:bg-[#195a5a]/10 flex-1"
                }
                onClick={() => setView("structure")}
              >
                Course Structure
              </Button>
            </div>
            {view === "basic" ? (
              <div className="space-y-6">
                {course.thumbnail && (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3 relative h-64 rounded-lg shadow-md overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={`${course.title} thumbnail`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Card className="md:w-1/3 border border-[#195a5a]/20 bg-white/70 shadow-md rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="text-[#195a5a] w-6 h-6" />
                          <p className="text-lg text-[#2a7b7b]">
                            <strong>Price:</strong> ${course.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="text-[#195a5a] w-6 h-6" />
                          <p className="text-lg text-[#2a7b7b]">
                            <strong>Level:</strong> {course.level}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Info className="text-[#195a5a] w-6 h-6" />
                          <p className="text-lg text-[#2a7b7b]">
                            <strong>Status:</strong> {course.status}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-[#195a5a] w-6 h-6" />
                      <div className="text-lg text-[#2a7b7b]">
                        <strong>Description:</strong>
                        <div
                          className="mt-2"
                          dangerouslySetInnerHTML={{ __html: course.description }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-[#195a5a] w-6 h-6" />
                      <p className="text-lg text-[#2a7b7b]">
                        <strong>Duration:</strong> {course.duration} hrs
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag className="text-[#195a5a] w-6 h-6" />
                      <p className="text-lg text-[#2a7b7b]">
                        <strong>Category:</strong> {course.category}
                      </p>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#195a5a]">Course Content</h2>
                <div className="space-y-4">
                  {chapters && chapters.length > 0 ? (
                    chapters.map((chapter, index) => (
                      <ChapterCard key={chapter._id} chapter={chapter} index={index} />
                    ))
                  ) : (
                    <p className="text-center text-[#195a5a]/80">No chapters available yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {course.thumbnail && (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3 relative h-64 rounded-lg shadow-md overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={`${course.title} thumbnail`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Card className="md:w-1/3 border border-[#195a5a]/20 bg-white/70 shadow-md rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Folder className="text-[#195a5a] w-6 h-6" />
                          <p className="text-lg text-[#2a7b7b]">
                            <strong>Chapters:</strong> {totalChapters}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="text-[#195a5a] w-6 h-6" />
                          <p className="text-lg text-[#2a7b7b]">
                            <strong>Lessons:</strong> {totalLessons || 0}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-[#195a5a]">
                    Course Structure
                  </h2>
                  <p className="text-lg text-[#2a7b7b]">
                    Organize and manage your course chapters.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-[#195a5a]">
                      Chapters
                    </h3>
                    <Button
                      variant="outline"
                      className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm"
                      onClick={handleCreateChapter}
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Create Chapter
                    </Button>
                  </div>
                  {isCreatingChapter && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-[#195a5a]">
                            Create New Chapter
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-lg text-[#2a7b7b]">
                              What would you like to name your chapter?
                            </Label>
                            <br /><br />
                            <Label className="text-sm font-semibold text-[#195a5a]">
                              Name
                            </Label>
                            <Input
                              value={chapterTitle}
                              onChange={(e) => setChapterTitle(e.target.value)}
                              placeholder="Enter chapter name"
                              className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="border-[#195a5a]/30 text-[#195a5a] hover:bg-[#195a5a]/10"
                              onClick={handleCancelChapter}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg"
                              onClick={handleSaveChapter}
                            >
                              Save
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {creatingLessonChapterId && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-[#195a5a]">
                            Create New Lesson
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-lg text-[#2a7b7b]">
                              What would you like to name your lesson?
                            </Label>
                            <br /><br />
                            <Label className="text-sm font-semibold text-[#195a5a]">
                              Name
                            </Label>
                            <Input
                              value={lessonTitle}
                              onChange={(e) => setLessonTitle(e.target.value)}
                              placeholder="Enter lesson name"
                              className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="border-[#195a5a]/30 text-[#195a5a] hover:bg-[#195a5a]/10"
                              onClick={handleCancelLesson}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg"
                              onClick={handleSaveLesson}
                            >
                              Save
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {confirmingDeleteChapterId && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-[#195a5a]">
                            Delete Chapter
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-lg text-[#2a7b7b]">
                            Are you sure you want to delete &quot;
                            {chapters?.find((c) => c._id === confirmingDeleteChapterId)?.title}&quot;?
                            This will also delete all associated lessons.
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="border-[#195a5a]/30 text-[#195a5a] hover:bg-[#195a5a]/10"
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              className="bg-red-500/80 hover:bg-red-600"
                              onClick={() => handleDeleteChapter(confirmingDeleteChapterId)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {confirmingDeleteLesson && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-[#195a5a]">
                            Delete Lesson
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-lg text-[#2a7b7b]">
                            Are you sure you want to delete &quot;{confirmingDeleteLesson.title}&quot;?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="border-[#195a5a]/30 text-[#195a5a] hover:bg-[#195a5a]/10"
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              className="bg-red-500/80 hover:bg-red-600"
                              onClick={() => handleDeleteLesson(confirmingDeleteLesson.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  <Card className="border border-[#195a5a]/20 bg-white/80 shadow-md rounded-xl overflow-hidden">
                    <CardContent className="p-4">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext
                          items={chapters?.map((c) => c._id) || []}
                          strategy={verticalListSortingStrategy}
                        >
                          {chapters && chapters.length > 0 ? (
                            chapters.map((chapter) => (
                              <SortableChapter
                                key={chapter._id}
                                chapter={chapter}
                                setCreatingLessonChapterId={setCreatingLessonChapterId}
                                setLessonTitle={setLessonTitle}
                                setConfirmingDeleteChapterId={setConfirmingDeleteChapterId}
                                setConfirmingDeleteLesson={setConfirmingDeleteLesson}
                                courseId={id}
                              />
                            ))
                          ) : (
                            <p className="text-center text-[#195a5a]/80">
                              No chapters created yet. Click Create Chapter to
                              get started.
                            </p>
                          )}
                        </SortableContext>
                      </DndContext>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}