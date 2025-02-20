"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CommitteeSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard/committee" },
    { name: "View Houses", href: "/dashboard/committee/view-houses" },
    { name: "View Applications", href: "/dashboard/committee/view-applications" },
    { name: "Allocate Houses", href: "/dashboard/committee/allocate-houses" },
    { name: "Send Notification", href: "/dashboard/committee/send-notification" },
  ];

  return (
    <aside className="w-64 h-screen bg-sky-500 text-white p-6 shadow-lg flex flex-col">
      <h1 className="text-2xl font-semibold text-center mb-6">Committee Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`block p-3 rounded-md text-lg font-medium transition ${
                  pathname === link.href
                    ? "bg-sky-600 shadow-md"
                    : "hover:bg-sky-700"
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
