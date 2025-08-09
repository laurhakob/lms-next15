import Image from "next/image";
import { UserButton } from "@/features/auth/components/user-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-2 px-4 bg-gray-50 shadow-sm">
      <div className="flex items-center pl-4">
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="mr-2 cursor-pointer group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] group-hover:brightness-125 transition-all duration-300">
            LMS
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-neutral-700 hover:text-[#195a5a] hover:bg-[#195a5a]/10 transition-all duration-300"
          asChild
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-neutral-700 hover:text-[#195a5a] hover:bg-[#195a5a]/10 transition-all duration-300"
          asChild
        >
          <Link href="/courses">Courses</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-neutral-700 hover:text-[#195a5a] hover:bg-[#195a5a]/10 transition-all duration-300"
          asChild
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <UserButton />
      </div>
    </nav>
  );
};