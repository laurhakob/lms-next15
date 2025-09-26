// "use client";

// import { useState } from "react";

// import { SignInCard } from "./sign-in-card";
// import { SignUpCard } from "./sign-up-card";
// import { SignInFlow } from "../types";

// export const AuthScreen = () => {
//   const [state, setState] = useState<SignInFlow>("signIn");

//   return (
//     <div className="h-full flex items-center justify-center bg-[#406749]">
//       <div className="md:h-auto md:w-[420px]">
//         {state === "signIn" ? (
//           <SignInCard setState={setState} />
//         ) : (
//           <SignUpCard setState={setState} />
//         )}
//       </div>
//     </div>
//   );
// };



// src/features/auth/components/auth-screen.tsx
"use client";

import { useState, useEffect } from "react";

import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { SignInFlow } from "../types";
import { useCurrentUser } from "../api/use-current-user";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export const AuthScreen = () => {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [state, setState] = useState<SignInFlow>("signIn");

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loader className="size-8 animate-spin text-muted-foreground" />;
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="h-full flex items-center justify-center bg-[#2a7b7b]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};