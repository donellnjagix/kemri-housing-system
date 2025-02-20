// components/ProtectedLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserRole } from "@/lib/auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login"); // Redirect to login if not authenticated
        return;
      }

      const userRole = await getUserRole(data.user.id);
      setRole(userRole);

      // Redirect to the appropriate dashboard based on role
      switch (userRole) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "committee":
          router.push("/dashboard/committee");
          break;
        case "applicant":
          router.push("/dashboard/applicant");
          break;
        case "tenant":
          router.push("/dashboard/tenant");
          break;
        default:
          router.push("/auth/login");
      }
    };

    fetchUserRole();
  }, [router]);

  if (!role) {
    return <div>Loading...</div>; // Show a loading state while fetching the role
  }

  return <>{children}</>;
}