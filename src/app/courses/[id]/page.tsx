"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function CourseWatchPage() {
  const router = useRouter();
  const params = useParams<{ id: Id<"courses"> }>();
  const course = useQuery(api.courses.getCourseById, { id: params.id });
  const chapters = useQuery(api.chapters.getCourseStructure, { courseId: params.id });
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

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
          <div className="w-1/4 pr-6 border-r border-[#195a5a]/20">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-6 h-6 text-[#195a5a]" />
                <h2 className="text-2xl font-bold text-[#195a5a]">{course.title}</h2>
              </div>
              <p className="text-sm text-[#2a7b7b]/60">{course.category}</p>
            </div>
            <Separator className="mb-4 bg-[#195a5a]/20" />
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <ChapterCard 
                  key={chapter._id} 
                  chapter={chapter} 
                  index={index}
                  isExpanded={expandedChapters.has(chapter._id)}
                  onToggle={() => toggleChapter(chapter._id)}
                />
              ))}
            </div>
          </div>
          
          {/* Right side: Main content (video player placeholder) */}
          <div className="w-3/4 pl-6 flex flex-col">
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
  onToggle 
}: { 
  chapter: { _id: Id<"chapters">; title: string; order: number }; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const lessons = useQuery(api.lessons.getChapterStructure, { chapterId: chapter._id });
  const lessonsCount = lessons?.length || 0;

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
            <Card key={lesson._id} className="border border-[#195a5a]/10 bg-white/80 shadow-sm rounded-md p-3 transition-all duration-300 hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-[#195a5a]" />
                <div className="w-6 h-6 rounded-full bg-[#2a7b7b]/80 text-white flex items-center justify-center font-medium text-sm">
                  {lessonIndex + 1}
                </div>
                <p className="text-base text-[#195a5a]">{lesson.title}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};