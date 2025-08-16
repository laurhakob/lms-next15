"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-neutral-700 hover:text-[#195a5a] hover:bg-[#195a5a]/10 transition-all duration-300"
          asChild
        >
          <Link href="/admin/dashboard">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900">Create Courses</h1>
      </div>
      <Card className="border border-green-200 bg-green-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-green-700">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-600">Provide basic information about the course.</p>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-neutral-900">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              className="border-green-200 focus:ring-[#195a5a] focus:border-[#195a5a]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}