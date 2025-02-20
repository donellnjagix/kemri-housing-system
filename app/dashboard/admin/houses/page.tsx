// app/dashboard/admin/houses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AddHouseModal from "@/app/components/admin/AddHouseModal"; // Import the modal
import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function HousesPage() {
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchHouses = async () => {
    const { data, error } = await supabase.from("houses").select("*");
    if (error) console.error("Error fetching houses:", error);
    else setHouses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("houses").delete().eq("id", id);
    if (error) console.error("Error deleting house:", error);
    else setHouses(houses.filter((house) => house.id !== id));
  };

  return (
    
    <div>
      <h1 className="text-2xl font-bold mb-4">Houses Management</h1>

      {/* Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add House
      </button>

      {/* Houses List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Type</th>
              <th className="p-2">Available</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house) => (
              <tr key={house.id} className="border-b">
                <td className="p-2">{house.type}</td>
                <td className="p-2">{house.available ? "Yes" : "No"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(house.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add House Modal */}
      <AddHouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshHouses={fetchHouses}
      />
    </div>
   
  );
}