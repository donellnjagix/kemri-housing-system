"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Houses", href: "/dashboard/admin/houses" },
    { name: "Applicants", href: "/dashboard/admin/applicants" },
    { name: "Allocations", href: "/dashboard/admin/allocations" },
    { name: "Waiting List", href: "/dashboard/admin/waiting-list" },
    { name: "Users", href: "/dashboard/admin/users" },
    { name: "Send Notification", href: "/dashboard/admin/send-notification" },
  ];

  return (
    <aside className="w-64 h-screen bg-sky-500 text-white p-6 shadow-lg flex flex-col">
      <h1 className="text-2xl font-semibold text-center mb-6">Admin Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`block p-3 rounded-md text-lg font-medium transition ${
                  pathname === link.href ? "bg-sky-600 shadow-md" : "hover:bg-sky-700"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
