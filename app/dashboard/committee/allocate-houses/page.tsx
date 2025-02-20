// app/dashboard/committee/allocate-houses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AllocateHouses() {
  const [applications, setApplications] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications and houses
  useEffect(() => {
    const fetchData = async () => {
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applicants")
        .select("*")
        .eq("status", "pending");

      const { data: housesData, error: housesError } = await supabase
        .from("houses")
        .select("*")
        .eq("available", true);

      if (applicationsError || housesError) {
        console.error("Error fetching data:", applicationsError || housesError);
      } else {
        setApplications(applicationsData || []);
        setHouses(housesData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle house allocation
  const handleAllocate = async (applicantId: string, houseId: string) => {
    const { error: allocationError } = await supabase
      .from("allocations")
      .insert([{ applicant_id: applicantId, house_id: houseId }]);

    if (allocationError) {
      console.error("Error allocating house:", allocationError);
      alert("Failed to allocate house. Please try again.");
      return;
    }

    // Mark the house as unavailable
    const { error: houseError } = await supabase
      .from("houses")
      .update({ available: false })
      .eq("id", houseId);

    if (houseError) {
      console.error("Error updating house availability:", houseError);
      alert("Failed to update house availability. Please try again.");
      return;
    }

    // Update the applicant's status
    const { error: applicantError } = await supabase
      .from("applicants")
      .update({ status: "approved" })
      .eq("id", applicantId);

    if (applicantError) {
      console.error("Error updating applicant status:", applicantError);
      alert("Failed to update applicant status. Please try again.");
      return;
    }

    alert("House allocated successfully!");
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Allocate Houses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Applicant</th>
              <th className="p-2">House Type Applied</th>
              <th className="p-2">Points</th>
              <th className="p-2">Available Houses</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b">
                <td className="p-2">{application.name}</td>
                <td className="p-2">{application.house_type_applied}</td>
                <td className="p-2">{application.points}</td>
                <td className="p-2">
                  <select className="p-1 border rounded">
                    {houses
                      .filter((house) => house.type === application.house_type_applied)
                      .map((house) => (
                        <option key={house.id} value={house.id}>
                          {house.type} (ID: {house.id})
                        </option>
                      ))}
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      handleAllocate(
                        application.id,
                        houses.find((house) => house.type === application.house_type_applied)?.id
                      )
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Allocate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}