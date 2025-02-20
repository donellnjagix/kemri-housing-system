// components/admin/AddHouseModal.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddHouseModal({
  isOpen,
  onClose,
  refreshHouses,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshHouses: () => void;
}) {
  const [type, setType] = useState("studio"); // Default house type
  const [available, setAvailable] = useState(true); // Default availability
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      // Insert the new house into the `houses` table
      const { data, error } = await supabase
        .from("houses")
        .insert([{ type, available }])
        .select();

      if (error) {
        console.error("Error adding house:", error);
        alert("Failed to add house. Please try again.");
        return;
      }

      if (data) {
        console.log("House added successfully:", data);
        alert("House added successfully!");
        setType("studio"); // Reset form fields
        setAvailable(true);
        refreshHouses(); // Refresh the houses list
        onClose(); // Close the modal
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New House</h2>
        <form onSubmit={handleSubmit}>
          {/* House Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">House Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="studio">Studio</option>
              <option value="1-bedroom">1 Bedroom</option>
              <option value="2-bedroom">2 Bedroom</option>
              <option value="3-bedroom">3 Bedroom</option>
              <option value="4-bedroom">4 Bedroom</option>
            </select>
          </div>

          {/* Availability Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="mr-2"
              />
              Available
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add House"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}