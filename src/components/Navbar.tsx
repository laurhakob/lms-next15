import Image from "next/image";
import { UserButton } from "@/features/auth/components/user-button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-1 px-2 bg-gray-50">
      <div className="flex items-center pl-4">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="mr-4 cursor-pointer"
          />
        </Link>
      </div>
      <UserButton />
    </nav>
  );
};