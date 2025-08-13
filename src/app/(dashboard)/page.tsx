"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Users, BarChart2, MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#195a5a] to-[#2a7b7b] text-white px-4 relative overflow-hidden">
      {/* Subtle background overlay for texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] animate-pulse opacity-20"></div>

      <div className="flex flex-col items-center justify-center py-16 relative z-10">
        <Badge
          variant="outline"
          className="mb-8 text-white border-white/30 bg-white/10 backdrop-blur-sm text-lg py-2 px-4 animate-fade-in"
        >
          The Future of Online Education
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-tight animate-fade-in-up">
          Elevate Your Learning Experience
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-10 text-white/90 leading-relaxed animate-fade-in-up animation-delay-200">
          Discover a new way to learn with our modern, interactive learning
          management system. Access high-quality courses anytime, anywhere.
        </p>
        <div className="flex gap-4 mb-16">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-[#195a5a] hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          <Card className="border border-white/20 bg-[#195a5a]/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-white/90 mb-2" />
              <CardTitle className="text-white text-2xl">
                Comprehensive Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Access a wide range of carefully curated courses designed by
                industry experts.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-white/20 bg-[#195a5a]/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Users className="w-10 h-10 text-white/90 mb-2" />
              <CardTitle className="text-white text-2xl">
                Interactive Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Engage with interactive content, quizzes, and assignments to
                enhance your learning experience.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-white/20 bg-[#195a5a]/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <BarChart2 className="w-10 h-10 text-white/90 mb-2" />
              <CardTitle className="text-white text-2xl">
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Monitor your progress and achievements with detailed analytics
                and personalized dashboards.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-white/20 bg-[#195a5a]/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-white/90 mb-2" />
              <CardTitle className="text-white text-2xl">
                Community Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Join a vibrant community of learners and instructors to
                collaborate and share knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


