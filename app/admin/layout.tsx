import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-semibold text-brand-dark-gray"
          >
            NH Admin
          </Link>
          <Link
            href="/admin/testimonials"
            className="text-sm text-gray-600 hover:text-brand-dark-gray"
          >
            Testimonials
          </Link>
          <Link
            href="/admin/gallery"
            className="text-sm text-gray-600 hover:text-brand-dark-gray"
          >
            Gallery
          </Link>
          <Link
            href="/admin/brochures"
            className="text-sm text-gray-600 hover:text-brand-dark-gray"
          >
            Brochures
          </Link>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-gray-600 hover:text-brand-dark-gray"
          >
            Sign out
          </button>
        </form>
      </header>
      <div className="px-6 py-8 max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
