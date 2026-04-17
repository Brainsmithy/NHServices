import { supabase } from "@/db";
import { auth } from "@/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  const { count, error } = await supabase
    .from("testimonials")
    .select("*", { count: "exact", head: true })
    .eq("approved", false);
  if (error) throw error;
  const pending = count ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark-gray">
        Welcome, {session?.user?.email}
      </h1>
      <Link
        href="/admin/testimonials"
        className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
      >
        <div className="text-sm text-gray-500">Testimonials</div>
        <div className="text-3xl font-bold text-brand-dark-gray mt-1">
          {pending}{" "}
          <span className="text-base font-normal text-gray-500">
            pending approval
          </span>
        </div>
      </Link>
    </div>
  );
}
