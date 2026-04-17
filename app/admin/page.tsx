import { auth } from "@/auth";

export default async function AdminDashboard() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark-gray">
        Welcome, {session?.user?.email}
      </h1>
      <p className="mt-2 text-gray-600">
        Sprint 1.12 lands the testimonial approval UI here.
      </p>
    </div>
  );
}
