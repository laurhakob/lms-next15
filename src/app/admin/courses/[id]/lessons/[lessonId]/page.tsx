"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LessonPage() {
  const params = useParams<{ id: string; lessonId: string }>();
  const courseId = params.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          variant="outline"
          className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm"
          asChild
        >
          <Link href={`/admin/courses/${courseId}?view=structure`}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Course
          </Link>
        </Button>
        {/* Add future lesson content here (e.g., video, text) */}
      </div>
    </div>
  );
}