// app/dashboard/admin/allocations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AllocateHouseModal from "@/app/components/admin/AllocateHouseModal";
import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch allocations
  const fetchAllocations = async () => {
    const { data, error } = await supabase
      .from("allocations")
      .select(`
        id,
        allocated_at,
        applicants ( name, email ),
        houses ( type )
      `);

    if (error) {
      console.error("Error fetching allocations:", error);
    } else {
      setAllocations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Handle deallocation
  const handleDeallocate = async (id: number) => {
    const { error } = await supabase.from("allocations").delete().eq("id", id);
    if (error) {
      console.error("Error deallocating house:", error);
      alert("Failed to deallocate house. Please try again.");
    } else {
      setAllocations(allocations.filter((allocation) => allocation.id !== id));
      alert("House deallocated successfully!");
    }
  };

  return (
   
    <div>
      <h1 className="text-2xl font-bold mb-4">Allocations Management</h1>

      {/* Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Allocate House
      </button>

      {/* Allocations List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Applicant</th>
              <th className="p-2">House Type</th>
              <th className="p-2">Allocated At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr key={allocation.id} className="border-b">
                <td className="p-2">
                  {allocation.applicants?.name} ({allocation.applicants?.email})
                </td>
                <td className="p-2">{allocation.houses?.type}</td>
                <td className="p-2">
                  {new Date(allocation.allocated_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeallocate(allocation.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Deallocate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Allocate House Modal */}
      <AllocateHouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshAllocations={fetchAllocations}
      />
    </div>
    
  );
}