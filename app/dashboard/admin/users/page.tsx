"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function UsersPage() {
  const [users, setUsers] = useState<{ id: string; role: string; email?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and their emails
  const fetchUsers = async () => {
    console.log("Fetching users...");

    // Step 1: Fetch users from the `users` table
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, role");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      setLoading(false);
      return;
    }

    console.log("Fetched users:", usersData);

    // Step 2: Fetch emails separately from `auth.users`
    const usersWithEmails = await Promise.all(
      usersData.map(async (user) => {
        const { data: authData, error: authError } = await supabase
          .from("auth.users")
          .select("email")
          .eq("id", user.id)
          .single();

        if (authError) {
          console.error(`Error fetching email for user ${user.id}:`, authError);
        }

        return {
          ...user,
          email: authData?.email || "Unknown",
        };
      })
    );

    setUsers(usersWithEmails);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role update
  const handleUpdateRole = async (id: string, newRole: string) => {
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", id);

    if (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    } else {
      alert("User role updated successfully!");
      fetchUsers(); // Refresh the users list
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } else {
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the users list
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="applicant">Applicant</option>
                    <option value="committee">Committee</option>
                    <option value="admin">Admin</option>
                    <option value="tenant">Tenant</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

