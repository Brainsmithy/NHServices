"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";
import {
  approveTestimonial,
  unapproveTestimonial,
  deleteTestimonial,
} from "@/app/admin/testimonials/actions";
import type { Testimonial } from "@/db/types";

function StarRow({
  rating,
  size = "h-4 w-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} of 5`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${size} ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

function StatusPill({ approved }: { approved: boolean }) {
  return approved ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-semibold">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-semibold">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Pending
    </span>
  );
}

function Avatar({
  firstName,
  lastName,
  size = "h-9 w-9 text-sm",
}: {
  firstName: string;
  lastName: string;
  size?: string;
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return (
    <span
      className={`${size} inline-flex items-center justify-center rounded-full bg-brand-gradient text-white font-bold shadow-sm shrink-0`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      className="h-10 w-10 text-brand-blue/25"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
  );
}

function AnimatedCheck() {
  return (
    <motion.svg
      className="h-12 w-12 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.polyline
        points="20 6 9 17 4 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
      />
    </motion.svg>
  );
}

type Mode = "view" | "confirm-delete" | "success-approved" | "success-unapproved" | "success-deleted";

export function TestimonialsTable({ rows }: { rows: Testimonial[] }) {
  const [active, setActive] = useState<Testimonial | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [busy, setBusy] = useState<"approve" | "delete" | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function open(row: Testimonial) {
    setActive(row);
    setMode("view");
    setBusy(null);
    onOpen();
  }

  function handleClose() {
    if (busy !== null) return;
    onClose();
  }

  async function handleToggleApproved() {
    if (!active) return;
    setBusy("approve");
    const wasApproved = active.approved;
    try {
      if (wasApproved) {
        await unapproveTestimonial(active.id);
      } else {
        await approveTestimonial(active.id);
      }
      setMode(wasApproved ? "success-unapproved" : "success-approved");
      setBusy(null);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!active) return;
    setBusy("delete");
    try {
      await deleteTestimonial(active.id);
      setMode("success-deleted");
      setBusy(null);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch {
      setBusy(null);
      setMode("view");
    }
  }

  const successConfig: Record<
    "success-approved" | "success-unapproved" | "success-deleted",
    { color: string; title: string; subtitle: string }
  > = {
    "success-approved": {
      color: "from-green-500 to-emerald-600",
      title: "Review approved",
      subtitle: "It's now live on the public site.",
    },
    "success-unapproved": {
      color: "from-yellow-500 to-amber-600",
      title: "Review unapproved",
      subtitle: "It's been hidden from the public site.",
    },
    "success-deleted": {
      color: "from-red-500 to-rose-600",
      title: "Review deleted",
      subtitle: "Removed permanently.",
    },
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-28" />
            <col className="w-32" />
            <col className="w-56" />
            <col />
            <col className="w-28" />
            <col className="w-20" />
          </colgroup>
          <thead className="bg-gradient-to-b from-gray-50 to-gray-100 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
            <tr>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Rating</th>
              <th className="px-4 py-3.5">Customer</th>
              <th className="px-4 py-3.5">Message</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => open(r)}
                className={`group border-t border-gray-100 cursor-pointer transition-colors hover:bg-blue-50/60 ${
                  !r.approved ? "bg-yellow-50/40" : ""
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StarRow rating={r.rating} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      firstName={r.first_name}
                      lastName={r.last_name}
                      size="h-8 w-8 text-xs"
                    />
                    <span className="font-semibold text-brand-dark-gray truncate">
                      {r.first_name} {r.last_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 truncate">{r.message}</td>
                <td className="px-4 py-3">
                  <StatusPill approved={r.approved} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue group-hover:translate-x-0.5 transition-transform">
                    Open
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        backdrop="blur"
        hideCloseButton
        scrollBehavior="inside"
        isDismissable={busy === null && !mode.startsWith("success")}
        classNames={{
          base: "bg-white rounded-2xl shadow-2xl overflow-hidden",
          body: "p-0",
        }}
      >
        <ModalContent>
          {active && (
            <ModalBody>
              <AnimatePresence mode="wait">
                {mode === "view" && (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={busy !== null}
                      aria-label="Close"
                      className="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full text-gray-400 hover:text-brand-dark-gray hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50"
                    >
                      <CloseIcon />
                    </button>

                    <header className="px-7 sm:px-9 pt-7 pb-6 border-b border-gray-100">
                      <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue mb-2">
                        Customer Review
                      </p>
                      <div className="flex items-start gap-4">
                        <Avatar
                          firstName={active.first_name}
                          lastName={active.last_name}
                          size="h-14 w-14 text-base"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold text-brand-dark-gray">
                              {active.first_name} {active.last_name}
                            </h2>
                            <StatusPill approved={active.approved} />
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                            <StarRow rating={active.rating} size="h-4 w-4" />
                            <span>·</span>
                            <span>
                              {new Date(active.created_at).toLocaleString(
                                undefined,
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </header>

                    <div className="px-7 sm:px-9 py-7">
                      <div className="relative bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-7">
                        <div className="absolute top-4 right-4">
                          <QuoteIcon />
                        </div>
                        <p className="text-base sm:text-lg leading-relaxed text-brand-dark-gray pr-12">
                          &ldquo;{active.message}&rdquo;
                        </p>
                      </div>
                    </div>

                    <footer className="px-7 sm:px-9 py-5 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setMode("confirm-delete")}
                        disabled={busy !== null}
                        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                      <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={handleClose}
                          disabled={busy !== null}
                          className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-dark-gray hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          Close
                        </button>
                        {active.approved ? (
                          <button
                            type="button"
                            onClick={handleToggleApproved}
                            disabled={busy !== null}
                            className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg border border-yellow-300 text-yellow-800 bg-yellow-50 hover:bg-yellow-100 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {busy === "approve" ? "Updating…" : "Unapprove"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleToggleApproved}
                            disabled={busy !== null}
                            className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg bg-brand-gradient text-white text-sm font-semibold shadow-md hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                          >
                            {busy === "approve" ? (
                              "Approving…"
                            ) : (
                              <>
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </footer>
                  </motion.div>
                )}

                {mode === "confirm-delete" && (
                  <motion.div
                    key="confirm-delete"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-7 sm:px-9 py-9"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-600 mb-4">
                        <svg
                          className="h-7 w-7"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark-gray">
                        Delete this review?
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 max-w-md">
                        This will permanently remove the review from{" "}
                        <span className="font-semibold text-brand-dark-gray">
                          {active.first_name} {active.last_name}
                        </span>
                        . This action cannot be undone.
                      </p>
                    </div>
                    <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMode("view")}
                        disabled={busy !== null}
                        className="inline-flex items-center justify-center h-10 px-5 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-dark-gray hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={busy !== null}
                        className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                      >
                        {busy === "delete" ? "Deleting…" : "Yes, delete"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {(mode === "success-approved" ||
                  mode === "success-unapproved" ||
                  mode === "success-deleted") && (
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-7 sm:px-9 py-12 flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                      }}
                      className={`relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br ${successConfig[mode].color} text-white shadow-xl`}
                    >
                      <motion.span
                        initial={{ scale: 1, opacity: 0.55 }}
                        animate={{ scale: 1.7, opacity: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${successConfig[mode].color}`}
                        aria-hidden="true"
                      />
                      <AnimatedCheck />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.25 }}
                      className="mt-5 text-2xl font-bold text-brand-dark-gray"
                    >
                      {successConfig[mode].title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.26, duration: 0.25 }}
                      className="mt-1.5 text-sm text-gray-500"
                    >
                      {successConfig[mode].subtitle}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
