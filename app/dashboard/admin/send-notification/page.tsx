"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/app/components/ProtectedLayout";
import Sidebar from "@/app/components/admin/Sidebar"; // Import the Sidebar

export default function SendNotificationPage() {
  const [applicantId, setApplicantId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const router = useRouter();

  // Fetch applicants from the database
  useEffect(() => {
    const fetchApplicants = async () => {
      const { data, error } = await supabase
        .from("applicants")
        .select("id, name, email");

      if (error) {
        console.error("Error fetching applicants:", error);
      } else {
        setApplicants(data || []);
      }
    };

    fetchApplicants();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Insert notification into the database
    const { error } = await supabase
      .from("notifications")
      .insert([{ applicant_id: parseInt(applicantId), message }]);

    if (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification. Please try again.");
    } else {
      alert("Notification sent successfully!");
      setApplicantId("");
      setMessage("");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Send Notification</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="applicantId" className="block mb-2">Select Applicant:</label>
            <select
              id="applicantId"
              value={applicantId}
              onChange={(e) => setApplicantId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select an applicant</option>
              {applicants.map((applicant) => (
                <option key={applicant.id} value={applicant.id}>
                  {applicant.name} ({applicant.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block mb-2">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
}
