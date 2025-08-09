"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#195a5a] flex flex-col items-center justify-center text-white px-4">
      <Badge variant="outline" className="mb-6 text-white border-white">
        The Future of Online Education
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
        Elevate Your Learning Experience
      </h1>
      <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
        Discover a new way to learn with our modern, interactive learning
        management system. Access high-quality courses anytime, anywhere.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" variant="secondary">
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </div>
    </div>
  );
}
