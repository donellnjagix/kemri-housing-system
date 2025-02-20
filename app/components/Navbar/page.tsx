"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: userDetails, error } = await supabase
          .from("users")
          .select("name, role")
          .eq("id", userData.user.id)
          .single();
        if (!error) {
          setUser(userDetails);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image src="/logo.webp" alt="Logo" width={50} height={50} />
        <span className="text-xl font-semibold">Housing Portal</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="text-lg">
            <span className="font-medium">{user.name}</span> ({user.role})
          </div>
        ) : (
          <span className="text-sm">Loading...</span>
        )}
        <button
          onClick={handleSignOut}
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
