// app/dashboard/committee/view-applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ViewApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("applicants")
        .select("*");

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/committee/view-applications/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Applications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">House Type Applied</th>
              <th className="p-2">Points</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr 
                key={application.id} 
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(application.id)}
              >
                <td className="p-2">{application.name}</td>
                <td className="p-2">{application.email}</td>
                <td className="p-2">{application.house_type_applied}</td>
                <td className="p-2">{application.points}</td>
                <td className="p-2">{application.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}