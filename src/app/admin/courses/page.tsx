"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
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
            <p className="text-center text-[#195a5a]/80">
              Courses will be displayed here once created.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}