"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Define types
type Applicant = {
  id: number;
  name: string;
  email: string;
};

type House = {
  id: number;
  type: string;
};

export default function AllocateHouseModal({
  isOpen,
  onClose,
  refreshAllocations,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshAllocations: () => void;
}) {
  const [applicantId, setApplicantId] = useState<string>("");
  const [houseId, setHouseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [houses, setHouses] = useState<House[]>([]);

  // Fetch applicants and available houses
  const fetchData = async () => {
    const { data: applicantsData, error: applicantsError } = await supabase
      .from("applicants")
      .select("id, name, email")
      .eq("status", "pending");

    const { data: housesData, error: housesError } = await supabase
      .from("houses")
      .select("id, type")
      .eq("available", true);

    if (applicantsError || housesError) {
      console.error("Error fetching data:", applicantsError || housesError);
    } else {
      setApplicants(applicantsData as Applicant[] || []);
      setHouses(housesData as House[] || []);
    }
  };

  // Fetch data when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicantIdNum = parseInt(applicantId);
      const houseIdNum = parseInt(houseId);

      // Update house availability
      const { error: houseError } = await supabase
        .from("houses")
        .update({ available: false, allocated_to: applicantIdNum })
        .eq("id", houseId);

      if (houseError) throw houseError;

      // Update applicant status
      const { error: applicantError } = await supabase
        .from("applicants")
        .update({ status: "allocated" })
        .eq("id", applicantId);

      if (applicantError) throw applicantError;

      // Insert allocation record
      const { error: allocationError } = await supabase
        .from("allocations")
        .insert([
          {
            applicant_id: applicantIdNum,
            house_id: houseIdNum,
            allocated_at: new Date().toISOString(),
          },
        ]);

      if (allocationError) throw allocationError;

      // Send notification to the applicant
      const house = houses.find((h) => h.id === houseIdNum);
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert([
          {
            applicant_id: applicantIdNum,
            message: `You have been allocated a house: ${house?.type}.`,
          },
        ]);

      if (notificationError) throw notificationError;

      alert("House allocated successfully!");
      onClose();
      refreshAllocations();
    } catch (error) {
      console.error("Error allocating house:", error);
      alert("Failed to allocate house. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Allocate House</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="applicant" className="block mb-2">
              Select Applicant:
            </label>
            <select
              id="applicant"
              value={applicantId}
              onChange={(e) => setApplicantId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select an applicant</option>
              {applicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id.toString()}>
                  {applicant.name} ({applicant.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="house" className="block mb-2">
              Select House:
            </label>
            <select
              id="house"
              value={houseId}
              onChange={(e) => setHouseId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a house</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id.toString()}>
                  {house.type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Allocating..." : "Allocate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
