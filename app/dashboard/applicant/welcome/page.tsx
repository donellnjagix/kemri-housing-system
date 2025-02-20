// app/dashboard/applicant/welcome/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WelcomePage() {
  const router = useRouter();

  // Redirect to application creation page
  const handleCreateApplication = () => {
    router.push("/dashboard/applicant/application-form");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
      <p className="mb-4">You do not have an existing application.</p>
      <button
        onClick={handleCreateApplication}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create New Application
      </button>
    </div>
  );
}