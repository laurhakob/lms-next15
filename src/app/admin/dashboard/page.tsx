// src/app/admin/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, File, FileText, Clock, User } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const extractPlainText = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const publishedCourses = useQuery(api.courses.getPublishedCourses);
  const totalSignups = useQuery(api.users.getAllUsersCount);
  const totalCourses = useQuery(api.courses.getAllCoursesCount);
  const totalChapters = useQuery(api.chapters.getAllChaptersCount);
  const totalLessons = useQuery(api.lessons.getAllLessonsCount);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Four Cards Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl text-green-700 flex items-center">
              Total Signups
              <Users className="w-5 h-5 ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">
              {totalSignups ?? "Loading..."}
            </p>
            <p className="text-sm text-neutral-600">
              Registered users on the platform
            </p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl text-green-700 flex items-center">
              Total Courses
              <BookOpen className="w-5 h-5 ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">
              {totalCourses ?? "Loading..."}
            </p>
            <p className="text-sm text-neutral-600">
              Available courses on the platform
            </p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl text-green-700 flex items-center">
              Total Chapters
              <File className="w-5 h-5 ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">
              {totalChapters ?? "Loading..."}
            </p>
            <p className="text-sm text-neutral-600">
              Total learning chapters available
            </p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl text-green-700 flex items-center">
              Total Lessons
              <FileText className="w-5 h-5 ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">
              {totalLessons ?? "Loading..."}
            </p>
            <p className="text-sm text-neutral-600">
              Total learning content available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-xl text-green-700">
            Total Courses
          </CardTitle>
          <p className="text-sm text-neutral-600">
            Here you can see the courses you have access to
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {publishedCourses && publishedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedCourses.map((course) => (
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
                    <Badge className="absolute top-2 right-2 bg-[#195a5a]/80 text-white rounded-full px-3 py-1">
                      {course.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold text-[#195a5a] mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-[#2a7b7b]/80 mb-3 line-clamp-2">
                      {extractPlainText(course.description)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#195a5a] mb-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration} hrs</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{course.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src={course.creatorImage}
                        alt={course.creatorName}
                        width={32}
                        height={32}
                        className="rounded-full border border-[#195a5a]/20"
                      />
                      <span className="text-sm text-[#195a5a] font-medium">
                        {course.creatorName}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
                      onClick={() =>
                        router.push(`/admin/courses/${course._id}`)
                      }
                    >
                      View Course
                      <BookOpen className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#195a5a]/80">
              No published courses available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
