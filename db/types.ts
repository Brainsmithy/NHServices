// Row-level types for the public tables, used across the app for type safety
// on Supabase SDK results. Mirrors db/schema.sql.

export type Testimonial = {
  id: string;
  first_name: string;
  last_name: string;
  message: string;
  rating: number;
  approved: boolean;
  created_at: string; // ISO timestamp
};

export type NewTestimonial = {
  first_name: string;
  last_name: string;
  message: string;
  rating: number;
  approved?: boolean;
};

export type User = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
};

export type NewUser = {
  email: string;
  password_hash: string;
  role?: string;
};

export type GalleryImage = {
  id: string;
  storage_path: string;
  filename: string;
  alt: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type Brochure = {
  id: string;
  storage_path: string;
  filename: string;
  title: string;
  category: string;
  sort_order: number;
  created_at: string;
};
