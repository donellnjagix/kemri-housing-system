"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedLayout from "@/app/components/ProtectedLayout";

type Applicant = {
  name: string;
  points: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalHouses: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalUsers: 0,
    waitlistCount: 0,
    totalNotifications: 0,
    topScoringApplicants: [] as Applicant[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: totalHouses } = await supabase
          .from("houses")
          .select("id", { count: "exact" });

        const { data: totalApplications } = await supabase
          .from("applicants")
          .select("id", { count: "exact" });

        const { data: approvedApplications } = await supabase
          .from("applicants")
          .select("id", { count: "exact" })
          .eq("status", "approved");

        const { data: pendingApplications } = await supabase
          .from("applicants")
          .select("id", { count: "exact" })
          .eq("status", "pending");

        const { data: rejectedApplications } = await supabase
          .from("applicants")
          .select("id", { count: "exact" })
          .eq("status", "rejected");

        const { data: totalUsers } = await supabase
          .from("users")
          .select("id", { count: "exact" });

        const { data: waitlistCount } = await supabase
          .from("waitlist")
          .select("id", { count: "exact" });

        const { data: totalNotifications } = await supabase
          .from("notifications")
          .select("id", { count: "exact" });

        const { data: topScoringApplicants } = await supabase
          .from("applicants")
          .select("name, points")
          .order("points", { ascending: false })
          .limit(5);

        setStats({
          totalHouses: totalHouses?.length || 0,
          totalApplications: totalApplications?.length || 0,
          approvedApplications: approvedApplications?.length || 0,
          pendingApplications: pendingApplications?.length || 0,
          rejectedApplications: rejectedApplications?.length || 0,
          totalUsers: totalUsers?.length || 0,
          waitlistCount: waitlistCount?.length || 0,
          totalNotifications: totalNotifications?.length || 0,
          topScoringApplicants: topScoringApplicants || [],
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedLayout>
      <div className="p-6 bg-slate-100 min-h-screen">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[
            { label: "Total Houses", value: stats.totalHouses },
            { label: "Total Applications", value: stats.totalApplications },
            { label: "Approved Applications", value: stats.approvedApplications, color: "emerald-500" },
            { label: "Pending Applications", value: stats.pendingApplications, color: "yellow-500" },
            { label: "Rejected Applications", value: stats.rejectedApplications, color: "rose-500" },
            { label: "Total Users", value: stats.totalUsers },
            { label: "Waitlist Count", value: stats.waitlistCount },
            { label: "Total Notifications", value: stats.totalNotifications },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white/20 hover:shadow-xl transition-shadow"
            >
              <p className="text-slate-600 text-lg">{item.label}</p>
              <p className={`text-2xl font-semibold text-${item.color || "slate-900"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Top Scoring Applicants */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Top Scoring Applicants</h2>
          <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-6 mt-4 border border-white/20">
            {stats.topScoringApplicants.length > 0 ? (
              <ul className="space-y-3">
                {stats.topScoringApplicants.map((applicant, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="font-semibold text-slate-700">{applicant.name}</span>
                    <span className="text-emerald-500 font-medium">{applicant.points} points</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600">No top scoring applicants yet.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}