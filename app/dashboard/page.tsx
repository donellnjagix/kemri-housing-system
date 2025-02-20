// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserRole } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const fetchUserRoleAndRedirect = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login"); // Redirect to login if not authenticated
        return;
      }

      const userRole = await getUserRole(data.user.id);

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

    fetchUserRoleAndRedirect();
  }, [router]);

  return <div>Loading...</div>; // Show a loading state while redirecting
}