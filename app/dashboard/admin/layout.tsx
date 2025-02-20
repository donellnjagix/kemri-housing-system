// app/dashboard/admin/layout.tsx
import { ReactNode } from "react";
import Sidebar from "@/app/components/admin/Sidebar";
// Import the Navbar component


export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
   
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}