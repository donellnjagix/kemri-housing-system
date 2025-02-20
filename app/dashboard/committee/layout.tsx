import { ReactNode } from "react";
import CommitteeSidebar from "@/app/components/commitee/CommitteeSidebar";

export default function CommitteeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <CommitteeSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
