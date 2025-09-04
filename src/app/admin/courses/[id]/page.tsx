"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Tag, DollarSign, User, Info, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: Id<"courses"> }>();
  const course = useQuery(api.courses.getCourseById, id ? { id } : "skip");

  if (!course) {
    return <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8 text-[#195a5a]">Loading course details...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] p-6">
            <CardTitle className="text-3xl font-bold text-white">{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {course.thumbnail && (
              <div className="w-full h-64 relative">
                <Image
                  src={course.thumbnail}
                  alt={`${course.title} thumbnail`}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
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
                <div className="flex items-center gap-3">
                  <Clock className="text-[#195a5a] w-6 h-6" />
                  <p className="text-lg text-[#2a7b7b]"><strong>Duration:</strong> {course.duration} hrs</p>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="text-[#195a5a] w-6 h-6" />
                  <p className="text-lg text-[#2a7b7b]"><strong>Category:</strong> {course.category}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-[#195a5a] w-6 h-6" />
                  <p className="text-lg text-[#2a7b7b]"><strong>Price:</strong> ${course.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-[#195a5a] w-6 h-6" />
                  <p className="text-lg text-[#2a7b7b]"><strong>Level:</strong> {course.level}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Info className="text-[#195a5a] w-6 h-6" />
                  <p className="text-lg text-[#2a7b7b]"><strong>Status:</strong> {course.status}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button
                asChild
                className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Link href="/admin/courses">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Courses
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}