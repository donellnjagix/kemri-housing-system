"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar/page";

export default function ApplicantDashboard() {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any>(null);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [totalWaitlist, setTotalWaitlist] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Applicant Data
      const { data: applicantData, error: applicantError } = await supabase
        .from("applicants")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (applicantError) {
        console.error("Error fetching application:", applicantError);
        router.push("/dashboard/applicant/welcome");
        return;
      }

      setApplication(applicantData);
      setTotalPoints(applicantData.points || 0);

      // Fetch Notifications
      const { data: notificationsData } = await supabase
        .from("notifications")
        .select("*")
        .eq("applicant_id", applicantData.id)
        .order("created_at", { ascending: false });

      setNotifications(notificationsData || []);

      // Fetch Scoring Breakdown
      const { data: scoringData } = await supabase
        .from("scoring_questions")
        .select("question, points");

      setScoreBreakdown(scoringData || []);

      // Fetch Feedback
      const { data: feedbackData } = await supabase
        .from("feedback")
        .select("message")
        .eq("applicant_id", applicantData.id)
        .order("created_at", { ascending: false })
        .limit(1);

      setFeedback(feedbackData?.[0]?.message || "No feedback yet.");

      // Fetch Allocation Status
      const { data: allocationData } = await supabase
        .from("allocations")
        .select("id, house_id, allocated_at, houses(type, available)")
        .eq("applicant_id", applicantData.id)
        .single();

      setAllocation(allocationData || null);

      // Fetch Waitlist Information
      const { data: waitlistData } = await supabase
        .from("waitlist")
        .select("id")
        .eq("applicant_id", applicantData.id)
        .single();

      if (waitlistData) {
        const { data: allWaitlisted } = await supabase
          .from("waitlist")
          .select("id");

        setTotalWaitlist(allWaitlisted ? allWaitlisted.length : 0);
        setWaitlistPosition(allWaitlisted ? allWaitlisted.findIndex((w) => w.id === waitlistData.id) + 1 : null);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!application) return null;

  // Status UI Enhancements
  const statusColors: Record<string, string> = {
    pending: "text-yellow-500", // 🟡 Pending
    approved: "text-green-500", // 🟢 Approved
    rejected: "text-red-500", // 🔴 Rejected
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 space-y-8">

        {/* Application Status Overview */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Application Status Overview</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Application ID:</strong> {application.id}</p>
            <p className={`font-semibold ${statusColors[application.status]}`}>
              <strong>Status:</strong> {application.status.toUpperCase()}
            </p>
            <p><strong>Submission Date:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Scoring & Feedback */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Scoring & Feedback</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Total Points Earned:</strong> {totalPoints}</p>
            <p className="mt-4"><strong>Breakdown of Scores:</strong></p>
            <ul className="list-disc list-inside">
              {scoreBreakdown.map((score) => (
                <li key={score.question}>
                  {score.question}: <span className="font-semibold">{score.points} pts</span>
                </li>
              ))}
            </ul>
            <p className="mt-4"><strong>Committee Feedback:</strong> {feedback}</p>
          </div>
        </div>

        {/* House Allocation Details */}
        <div>
          <h2 className="text-2xl font-bold mb-4">House Allocation Details</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {allocation ? (
              <>
                <p><strong>Allocation Status:</strong> ✅ Allocated</p>
                <p><strong>House Type:</strong> {allocation.houses.type}</p>
                <p><strong>House ID:</strong> {allocation.house_id}</p>
                <p><strong>Allocation Date:</strong> {new Date(allocation.allocated_at).toLocaleDateString()}</p>
                <p><strong>House Availability:</strong> {allocation.houses.available ? "Available" : "Occupied"}</p>
              </>
            ) : (
              <p><strong>Allocation Status:</strong> ❌ Not Allocated</p>
            )}
          </div>
        </div>

        {/* Waitlist Information */}
        {waitlistPosition && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Waitlist Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p><strong>Your Position:</strong> #{waitlistPosition}</p>
              <p><strong>Total Applicants on Waitlist:</strong> {totalWaitlist}</p>
              <p><strong>Estimated Waiting Time:</strong> {waitlistPosition * 2} weeks</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Actions</h2>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={() => router.push("/dashboard/applicant/edit-application")}>
              Edit Application
            </button>
            <button className="w-full bg-red-500 text-white py-2 rounded" onClick={() => router.push("/dashboard/applicant/withdraw-application")}>
              Withdraw Application
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}