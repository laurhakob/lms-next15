"use client";

import { useQuery } from "convex/react";
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
} from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: Id<"courses"> }>();
  const course = useQuery(api.courses.getCourseById, id ? { id } : "skip");
  const [view, setView] = useState<"basic" | "structure">("basic");

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8 text-[#195a5a]">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] p-6">
            <CardTitle className="text-3xl font-bold text-white">
              {course.title}
            </CardTitle>
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
            <div className="flex justify-between mb-4 bg-[#e6f4ea]/70 border border-[#195a5a]/20 rounded-md p-2 shadow-sm">
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
              </div>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-[#195a5a]">
                  Course Structure
                </h2>
                <p className="text-lg text-[#2a7b7b]">
                  Here you can update your Course Structure.
                </p>
              </div>
            )}
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
