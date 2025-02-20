// app/dashboard/committee/view-houses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ViewHouses() {
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<string>("");

  // Fetch houses
  useEffect(() => {
    const fetchHouses = async () => {
      const { data, error } = await supabase
        .from("houses")
        .select("*")
        .eq("available", true);

      if (error) {
        console.error("Error fetching houses:", error);
      } else {
        setHouses(data || []);
      }
      setLoading(false);
    };

    fetchHouses();
  }, []);

  // Fetch applicants for the selected house type
  const fetchApplicants = async (houseType: string) => {
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .eq("house_type_applied", houseType)
      .eq("status", "pending"); // Only fetch applicants with "pending" status

    if (error) {
      console.error("Error fetching applicants:", error);
    } else {
      setApplicants(data || []);
    }
  };

  // Handle house row click
  const handleHouseClick = (house: any) => {
    setSelectedHouse(house);
    fetchApplicants(house.type);
  };

  // Handle applicant selection
  const handleApplicantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApplicant(event.target.value);
  };

  // Allocate house to applicant
  const allocateHouse = async () => {
    if (!selectedHouse || !selectedApplicant) return;

    try {
      // Update the house to mark it as allocated and unavailable
      const { error: houseError } = await supabase
        .from("houses")
        .update({ available: false, allocated_to: parseInt(selectedApplicant) })
        .eq("id", selectedHouse.id);

      if (houseError) throw houseError;

      // Update the applicant's status to "allocated"
      const { error: applicantError } = await supabase
        .from("applicants")
        .update({ status: "allocated" })
        .eq("id", selectedApplicant);

      if (applicantError) throw applicantError;

      // Add the allocation record
      const { error: allocationError } = await supabase
        .from("allocations")
        .insert([
          {
            applicant_id: parseInt(selectedApplicant),
            house_id: selectedHouse.id,
            allocated_at: new Date().toISOString(),
          },
        ]);

      if (allocationError) throw allocationError;

      alert("House allocated successfully!");
      setSelectedHouse(null);
      setSelectedApplicant("");
      setApplicants([]);

      // Refresh the houses list
      const { data: updatedHouses, error: fetchError } = await supabase
        .from("houses")
        .select("*")
        .eq("available", true);

      if (fetchError) throw fetchError;
      setHouses(updatedHouses || []);
    } catch (error) {
      console.error("Error allocating house:", error);
      alert("Failed to allocate house. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Available Houses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Availability</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house) => (
              <tr
                key={house.id}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleHouseClick(house)}
              >
                <td className="p-2">{house.id}</td>
                <td className="p-2">{house.type}</td>
                <td className="p-2">{house.available ? "Available" : "Unavailable"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for allocating a house */}
      {selectedHouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Allocate House</h2>
            <p className="mb-4">
              Allocate <strong>{selectedHouse.type}</strong> to an applicant.
            </p>

            <label htmlFor="applicant" className="block mb-2">
              Select Applicant:
            </label>
            <select
              id="applicant"
              className="w-full p-2 border rounded mb-4"
              value={selectedApplicant}
              onChange={handleApplicantChange}
            >
              <option value="">Select an applicant</option>
              {applicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id}>
                  {applicant.name} ({applicant.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedHouse(null)}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={allocateHouse}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={!selectedApplicant}
              >
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}