import { supabase } from "@/db";
import type { Testimonial } from "@/db/types";
import { TestimonialRowActions } from "@/components/admin/testimonial-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select()
    .order("approved", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows: Testimonial[] = data ?? [];

  if (rows.length === 0) {
    return <p className="text-gray-600">No testimonials yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Stars</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Message</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-gray-100">
              <td className="px-4 py-2 whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {r.first_name} {r.last_name}
              </td>
              <td className="px-4 py-2 max-w-md truncate">{r.message}</td>
              <td className="px-4 py-2">
                {r.approved ? (
                  <span className="inline-block rounded bg-green-100 text-green-800 px-2 py-0.5 text-xs">
                    Approved
                  </span>
                ) : (
                  <span className="inline-block rounded bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">
                    Pending
                  </span>
                )}
              </td>
              <td className="px-4 py-2">
                <TestimonialRowActions id={r.id} approved={r.approved} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
