"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CommitteeDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applicants")
        .select("*");

      const { data: housesData, error: housesError } = await supabase
        .from("houses")
        .select("*");

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Committee Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Applications Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Total Applications</h2>
            <p className="text-4xl font-bold text-blue-600">{applications.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Pending Applications</h2>
            <p className="text-4xl font-bold text-yellow-500">
              {applications.filter((app) => app.status === "pending").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Approved Applications</h2>
            <p className="text-4xl font-bold text-green-500">
              {applications.filter((app) => app.status === "approved").length}
            </p>
          </div>

          {/* Housing Assignments Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Total Houses</h2>
            <p className="text-4xl font-bold text-purple-600">{houses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Available Houses</h2>
            <p className="text-4xl font-bold text-green-500">
              {houses.filter((house) => house.available).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Allocated Houses</h2>
            <p className="text-4xl font-bold text-red-500">
              {houses.filter((house) => !house.available).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
