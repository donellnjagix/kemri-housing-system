"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedLayout from "@/app/components/ProtectedLayout";
import { Bar, Layers, Users, Clock, Check, X, Bell, List } from "lucide-react";
type Applicant = {
  name: string;
  points: number;
};
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="dashboard-card group">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="stat-label">{label}</h3>
        <div className="stat-value">{value.toLocaleString()}</div>
      </div>
      <div className="h-12 w-12 rounded-full bg-slate-100 p-2.5 group-hover:bg-slate-200 transition-colors duration-200">
        <Icon className="h-full w-full text-slate-600" />
      </div>
    </div>
  </div>
);
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
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-slate-900"></div>
      </div>
    );
  }
  const statCards = [
    { label: "Total Houses", value: stats.totalHouses, icon: Bar },
    { label: "Total Applications", value: stats.totalApplications, icon: Layers },
    { label: "Approved Applications", value: stats.approvedApplications, icon: Check },
    { label: "Pending Applications", value: stats.pendingApplications, icon: Clock },
    { label: "Rejected Applications", value: stats.rejectedApplications, icon: X },
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Waitlist Count", value: stats.waitlistCount, icon: List },
    { label: "Total Notifications", value: stats.totalNotifications, icon: Bell },
  ];
  return (
    <ProtectedLayout>
      <div className="min-h-screen animate-fade-in p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Overview of your application statistics</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Top Scoring Applicants</h2>
          <div className="dashboard-card mt-4">
            <ul className="top-applicants-list">
              {stats.topScoringApplicants.length > 0 ? (
                stats.topScoringApplicants.map((applicant, index) => (
                  <li key={index} className="top-applicant-item">
                    <span className="flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                        {index + 1}
                      </span>
                      <span className="ml-3 font-medium text-slate-900">{applicant.name}</span>
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                      {applicant.points} points
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-center text-slate-600 py-4">No top scoring applicants yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}