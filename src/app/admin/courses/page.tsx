"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function CoursesPage() {
  const courses = useQuery(api.courses.getUserCourses);

  // Function to extract plain text from HTML
  const extractPlainText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#195a5a] tracking-tight animate-fade-in">
              Your Courses
            </h1>
            <p className="text-lg text-[#2a7b7b]/80 mt-2">
              Here you will see all of the courses.
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <Link href="/admin/courses/create">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>
        <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] p-6">
            <CardTitle className="text-2xl font-bold text-white">
              Course List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card
                    key={course._id}
                    className="border-none bg-white/80 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <Image
                        src={course.thumbnail || "/placeholder-image.jpg"}
                        alt={course.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2 bg-[#195a5a]/80 text-white rounded-full px-3 py-1"
                      >
                        {course.status}
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
                          <span>{course.level}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#195a5a]/80">
                No courses created yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}