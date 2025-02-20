// app/dashboard/admin/applicants/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      const { data, error } = await supabase.from("applicants").select("*");
      if (error) console.error("Error fetching applicants:", error);
      else setApplicants(data || []);
      setLoading(false);
    };

    fetchApplicants();
  }, []);

  return (
   
    <div>
      <h1 className="text-2xl font-bold mb-4">Applicants Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Points</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="border-b">
                <td className="p-2">{applicant.name}</td>
                <td className="p-2">{applicant.email}</td>
                <td className="p-2">{applicant.points}</td>
                <td className="p-2">{applicant.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    
  );
}