// src/app/courses/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const extractPlainText = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function PublicCoursesPage() {
  const courses = useQuery(api.courses.getPublishedCourses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-[#195a5a] tracking-tight animate-fade-in">
          Explore Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course._id} className="border-none bg-white/80 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <Image src={course.thumbnail || "/placeholder-image.jpg"} alt={course.title} width={300} height={200} className="w-full h-48 object-cover" />
                <Badge className="absolute top-2 right-2 bg-[#195a5a]/80 text-white rounded-full px-3 py-1">
                  {course.level}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-[#195a5a] mb-2">{course.title}</h3>
                <p className="text-sm text-[#2a7b7b]/80 mb-3 line-clamp-2">{extractPlainText(course.description)}</p>
                <div className="flex items-center gap-4 text-sm text-[#195a5a]">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration} hrs</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{course.creatorName}</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-4 bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a]">
                  <Link href={`/courses/${course._id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}