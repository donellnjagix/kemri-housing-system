// app/dashboard/applicant/allocated-house/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar/page";

export default function AllocatedHousePage() {
  const [allocation, setAllocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch allocation details
  useEffect(() => {
    const fetchAllocation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch allocation details for the logged-in applicant
      const { data, error } = await supabase
        .from("allocations")
        .select(`
          id,
          allocated_at,
          houses ( type )
        `)
        .eq("applicant_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching allocation:", error);
      } else {
        setAllocation(data);
      }
      setLoading(false);
    };

    fetchAllocation();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!allocation) return <p>No allocation found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Allocated House Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>House Type:</strong> {allocation.houses?.type}</p>
          <p><strong>Allocated At:</strong> {new Date(allocation.allocated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}