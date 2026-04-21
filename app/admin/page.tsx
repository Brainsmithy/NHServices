import { supabase } from "@/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ADMIN_NAME = "Nick";

type Tile = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
  countLabel?: string;
  highlight?: boolean;
};

function TestimonialIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function BrochureIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export default async function AdminDashboard() {
  const [pendingRes, galleryRes, brochuresRes] = await Promise.all([
    supabase
      .from("testimonials")
      .select("*", { count: "exact", head: true })
      .eq("approved", false),
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("brochures").select("*", { count: "exact", head: true }),
  ]);

  if (pendingRes.error) throw pendingRes.error;
  if (galleryRes.error) throw galleryRes.error;
  if (brochuresRes.error) throw brochuresRes.error;

  const pending = pendingRes.count ?? 0;
  const galleryCount = galleryRes.count ?? 0;
  const brochureCount = brochuresRes.count ?? 0;

  const tiles: Tile[] = [
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      description: "Approve or remove customer reviews.",
      icon: <TestimonialIcon />,
      count: pending,
      countLabel: pending === 1 ? "pending review" : "pending reviews",
      highlight: pending > 0,
    },
    {
      href: "/admin/gallery",
      label: "Gallery",
      description: "Upload and manage gallery photos.",
      icon: <GalleryIcon />,
      count: galleryCount,
      countLabel: galleryCount === 1 ? "image" : "images",
    },
    {
      href: "/admin/brochures",
      label: "Brochures",
      description: "Upload equipment PDFs by category.",
      icon: <BrochureIcon />,
      count: brochureCount,
      countLabel: brochureCount === 1 ? "brochure" : "brochures",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-1">
          Admin Dashboard
        </p>
        <h1 className="text-3xl font-bold text-brand-dark-gray">
          Welcome, {ADMIN_NAME}
        </h1>
        <p className="text-gray-500 mt-1">Here&rsquo;s what needs your attention.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
              t.highlight
                ? "border-brand-orange/40 ring-1 ring-brand-orange/20"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${
                  t.highlight
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "bg-blue-50 text-brand-blue"
                }`}
              >
                {t.icon}
              </div>
              {t.highlight && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange">
                  Action needed
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-brand-dark-gray">
              {t.label}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{t.description}</p>
            {typeof t.count === "number" && (
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-brand-dark-gray">
                  {t.count}
                </span>
                <span className="text-sm text-gray-500">{t.countLabel}</span>
              </p>
            )}
            <span className="absolute bottom-5 right-5 text-gray-300 group-hover:text-brand-blue transition-colors">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
