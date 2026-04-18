import { supabase } from "@/db";
import type { Testimonial } from "@/db/types";
import { TestimonialsTable } from "@/components/admin/testimonials-table";

export const dynamic = "force-dynamic";

export default async function AdminTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select()
    .order("approved", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows: Testimonial[] = data ?? [];

  const pendingCount = rows.filter((r) => !r.approved).length;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-1">
            Reviews
          </p>
          <h1 className="text-3xl font-bold text-brand-dark-gray">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length} total · {pendingCount} pending approval
          </p>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500 font-medium">No testimonials yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            New customer reviews will show up here for approval.
          </p>
        </div>
      ) : (
        <TestimonialsTable rows={rows} />
      )}
    </div>
  );
}
