// app/dashboard/committee/waiting-list/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitingList() {
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch waiting list
  useEffect(() => {
    const fetchWaitingList = async () => {
      const { data, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching waiting list:", error);
      } else {
        setWaitingList(data || []);
      }
      setLoading(false);
    };

    fetchWaitingList();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Waiting List</h1>

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
            </tr>
          </thead>
          <tbody>
            {waitingList.map((applicant) => (
              <tr key={applicant.id} className="border-b">
                <td className="p-2">{applicant.name}</td>
                <td className="p-2">{applicant.email}</td>
                <td className="p-2">{applicant.house_type_applied}</td>
                <td className="p-2">{applicant.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}