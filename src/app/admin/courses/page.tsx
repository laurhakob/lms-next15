"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel"; // Import Id type
import { Edit, Trash2 } from "lucide-react";

export default function CoursesPage() {
  const courses = useQuery(api.courses.getUserCourses);
  const deleteCourse = useMutation(api.courses.deleteCourse);
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<Id<"courses"> | null>(null);

  // Function to extract plain text from HTML
  const extractPlainText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleDeleteConfirm = (courseId: Id<"courses">) => {
    setIsConfirmingDelete(courseId);
  };

  const handleDeleteCancel = () => {
    setIsConfirmingDelete(null);
  };

  const handleDelete = async (courseId: Id<"courses">) => {
    try {
      await deleteCourse({ courseId });
      setIsConfirmingDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
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
                      <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <Badge
                          className="bg-[#195a5a]/80 text-white rounded-full px-3 py-1"
                        >
                          {course.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-white/50 text-[#195a5a] hover:bg-[#195a5a]/20 rounded-full w-8 h-8 focus:outline-none focus:ring-2 focus:ring-[#195a5a]/50"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-40">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/courses/create?edit=${course._id}`)}
                              className="text-[#195a5a] hover:bg-[#195a5a]/10"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteConfirm(course._id)}
                              className="text-red-500 hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {isConfirmingDelete === course._id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Card className="bg-white p-4 rounded-lg shadow-lg">
                            <p className="text-lg text-[#195a5a] mb-2">
                              Are you sure you want to delete &quot;{course.title}&quot;?
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={handleDeleteCancel}
                                className="text-[#195a5a] hover:bg-[#195a5a]/10"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(course._id)}
                                className="hover:bg-red-600"
                              >
                                Delete
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}
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