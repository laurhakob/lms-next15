
"use client";

import { useQuery, useMutation } from "convex/react";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, ChevronDown, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function CourseWatchPage() {
  const router = useRouter();
  const params = useParams<{ id: Id<"courses"> }>();
  const searchParams = useSearchParams();
  const course = useQuery(api.courses.getCourseById, { id: params.id });
  const chapters = useQuery(api.chapters.getCourseStructure, { courseId: params.id });
  const lessons = useQuery(api.lessons.getCourseLessons, { courseId: params.id });
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [selectedLessonId, setSelectedLessonId] = useState<Id<"lessons"> | null>(null);

  const initialLessonId = searchParams.get("lesson") as Id<"lessons"> | null;

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
    } else if (lessons && lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0]._id);
      setExpandedChapters(new Set([lessons[0].chapterId]));
    }
  }, [initialLessonId, lessons, selectedLessonId]);

  const selectedLesson = useQuery(
    api.lessons.getLessonById,
    selectedLessonId ? { id: selectedLessonId } : "skip"
  );
  const videoUrl = useQuery(
    api.lessons.getVideoUrl,
    selectedLesson?.video ? { storageId: selectedLesson.video } : "skip"
  );
  const courseProgress = useQuery(api.progress.getCourseProgress, { courseId: params.id });
  const progressMap = new Map(courseProgress?.map(p => [p.lessonId, p.completed]) || []);
  const isCompleted = selectedLessonId ? progressMap.get(selectedLessonId) || false : false;
  const toggleLessonCompletion = useMutation(api.progress.toggleLessonCompletion);

  const completed = courseProgress?.filter(p => p.completed).length || 0;
  const total = lessons?.length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleToggleComplete = async (lessonId: Id<"lessons">) => {
    try {
      await toggleLessonCompletion({ lessonId });
      const updatedCompleted = !progressMap.get(lessonId);
      progressMap.set(lessonId, updatedCompleted);
      toast({
        title: updatedCompleted ? "Lesson Completed" : "Lesson Uncompleted",
        description: updatedCompleted ? "You've marked this lesson as complete." : "You've marked this lesson as incomplete.",
      });
      if (lessonId === selectedLessonId) {
        // Update the button for the selected lesson if needed
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update lesson status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  if (!course || !chapters) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] flex items-center justify-center text-[#195a5a]">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] flex flex-col">
      <Card className="border-none bg-white/90 shadow-xl rounded-none overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl flex flex-col flex-grow">
        <CardHeader className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] p-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
            <CardTitle className="text-3xl font-bold text-white">
              {course.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6 flex-grow flex flex-row">
          {/* Left side: Sidebar with chapters */}
          <div className="w-1/4 pr-6 border-r border-[#195a5a]/20 bg-[#f0f9f9]">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-6 h-6 text-[#195a5a]" />
                <h2 className="text-2xl font-bold text-[#195a5a]">{course.title}</h2>
              </div>
              <p className="text-sm text-[#2a7b7b]/60">{course.category}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="font-semibold text-lg text-[#195a5a]">Progress:</span>
                <span className="text-lg text-[#195a5a]">{completed}/{total}</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2.5 w-full">
                <div 
                  className="bg-[#195a5a] h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-center mt-1 text-lg font-bold text-[#195a5a]">{percentage}%</p>
            </div>
            <Separator className="mb-4 bg-[#195a5a]/20" />
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <ChapterCard 
                  key={chapter._id}
                  selectedLessonId={selectedLessonId}
                  chapter={chapter} 
                  index={index}
                  isExpanded={expandedChapters.has(chapter._id)}
                  onToggle={() => toggleChapter(chapter._id)}
                  setSelectedLessonId={setSelectedLessonId}
                  progressMap={progressMap}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          </div>
          
          {/* Right side: Main content */}
          <div className="w-3/4 pl-6 flex flex-col space-y-6 bg-white">
            {selectedLessonId && selectedLesson ? (
              <div className="space-y-6">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg shadow-md"
                  />
                ) : (
                  <p className="text-center text-[#195a5a]">No video available for this lesson.</p>
                )}
                <Button
                  onClick={() => handleToggleComplete(selectedLessonId)}
                  className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white py-2 px-4 text-sm flex items-center justify-center gap-2"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4" /> {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
                <h2 className="text-3xl font-bold text-[#195a5a]">{selectedLesson.title}</h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedLesson.description || "" }} 
                />
              </div>
            ) : (
              <div className="text-center flex-grow flex items-center justify-center">
                <div>
                  <h2 className="text-4xl font-bold text-[#195a5a] mb-6">
                    Course Video Player
                  </h2>
                  <p className="text-2xl text-[#2a7b7b] max-w-3xl mx-auto">
                    This is where the video player would be implemented.
                    Select a lesson from the left sidebar to load content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ChapterCard component 
const ChapterCard = ({ 
  chapter, 
  index, 
  isExpanded,
  onToggle,
  setSelectedLessonId,
  selectedLessonId,
  progressMap,
  onToggleComplete
}: { 
  chapter: { _id: Id<"chapters">; title: string; order: number }; 
  selectedLessonId: Id<"lessons"> | null;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  setSelectedLessonId: (id: Id<"lessons"> | null) => void;
  progressMap: Map<Id<"lessons">, boolean>;
  onToggleComplete: (lessonId: Id<"lessons">) => void;
}) => {
  const lessons = useQuery(api.lessons.getChapterStructure, { chapterId: chapter._id });
  const lessonsCount = lessons?.length || 0;

  const handleLessonClick = (lessonId: Id<"lessons">) => {
    setSelectedLessonId(lessonId);
  };

  return (
    <Card className="border border-[#195a5a]/20 bg-white/80 shadow-md rounded-xl p-4 transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="flex items-center justify-between" onClick={onToggle}>
        <div className="flex items-center flex-grow">
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 rounded-full bg-[#195a5a] text-white flex items-center justify-center font-bold text-lg shadow-md">
              {index + 1}
            </div>
          </div>
          <div className="flex-grow">
            <p className="text-lg font-semibold text-[#195a5a]">{chapter.title}</p>
            <p className="text-sm text-[#2a7b7b]/60">{lessonsCount} lessons</p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-[#195a5a] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
      {isExpanded && lessons && (
        <div className="mt-4 space-y-2">
          {lessons.map((lesson, lessonIndex) => (
            <Card 
              key={lesson._id} 
              className={`border border-[#195a5a]/10 bg-white/80 shadow-sm rounded-md p-3 transition-all duration-300 hover:shadow-md cursor-pointer ${lesson._id === selectedLessonId ? 'bg-[#e6f4ea] border-[#195a5a]/50' : ''}`}
              onClick={() => handleLessonClick(lesson._id)}
            >
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-[#195a5a]" />
                <div className="w-6 h-6 rounded-full bg-[#2a7b7b]/80 text-white flex items-center justify-center font-medium text-sm">
                  {lessonIndex + 1}
                </div>
                <p className="text-base text-[#195a5a]">{lesson.title}</p>
                <CheckCircle 
                  className={`w-5 h-5 ml-auto cursor-pointer ${progressMap.get(lesson._id) ? 'text-green-500' : 'text-gray-300'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(lesson._id);
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
