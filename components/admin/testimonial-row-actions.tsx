"use client";

import { Button } from "@heroui/react";
import {
  approveTestimonial,
  unapproveTestimonial,
  deleteTestimonial,
} from "@/app/admin/testimonials/actions";

export function TestimonialRowActions({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  return (
    <div className="flex gap-2">
      {approved ? (
        <form action={unapproveTestimonial.bind(null, id)}>
          <Button type="submit" size="sm" variant="flat">
            Unapprove
          </Button>
        </form>
      ) : (
        <form action={approveTestimonial.bind(null, id)}>
          <Button type="submit" size="sm" color="primary">
            Approve
          </Button>
        </form>
      )}
      <form
        action={deleteTestimonial.bind(null, id)}
        onSubmit={(e) => {
          if (!confirm("Delete this testimonial?")) e.preventDefault();
        }}
      >
        <Button type="submit" size="sm" color="danger" variant="flat">
          Delete
        </Button>
      </form>
    </div>
  );
}
