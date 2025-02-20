// app/dashboard/tenant/page.tsx
"use client";

import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function TenantDashboard() {
  return (
    <ProtectedLayout>
      <div>
        <h1>Tenant Dashboard</h1>
        <p>Welcome, Tenant! You can manage your housing details here.</p>
      </div>
    </ProtectedLayout>
  );
}