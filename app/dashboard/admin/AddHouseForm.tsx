// components/admin/AddHouseForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddHouseForm() {
  const [type, setType] = useState("");
  const [available, setAvailable] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("houses").insert([{ type, available }]);
    if (error) console.error("Error adding house:", error);
    else {
      alert("House added successfully!");
      setType("");
      setAvailable(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-xl font-bold mb-2">Add New House</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="House Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="mr-2"
          />
          Available
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add House
        </button>
      </div>
    </form>
  );
}