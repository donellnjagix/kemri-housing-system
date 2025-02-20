// app/dashboard/admin/waiting-list/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function WaitingListPage() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch waitlist from Supabase
  const fetchWaitlist = async () => {
    const { data, error } = await supabase
      .from("waitlist")
      .select(`
        id,
        added_at,
        applicants ( name, email )
      `);

    if (error) {
      console.error("Error fetching waitlist:", error);
    } else {
      setWaitlist(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Waiting List Management</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Applicant</th>
              <th className="p-2">Added At</th>
              <th className="p-2">Waiting Time</th>
            </tr>
          </thead>
          <tbody>
            {waitlist.map((entry) => (
              <tr key={entry.id} className="border-b">
                <td className="p-2">
                  {entry.applicants?.name} ({entry.applicants?.email})
                </td>
                <td className="p-2">
                  {new Date(entry.added_at).toLocaleString()}
                </td>
                <td className="p-2">
                  {Math.floor(
                    (new Date().getTime() - new Date(entry.added_at).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}