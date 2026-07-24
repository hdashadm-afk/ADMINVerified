"use client";

import { useTransition } from "react";
import { updateComplianceStatus } from "@/app/actions";
import type { ComplianceStatus } from "@/types/db";

const STATUS_LABEL: Record<ComplianceStatus, string> = {
  on_track: "On track",
  preparing: "Preparing",
  due_soon: "Due soon",
  overdue: "Overdue",
};

const STATUS_CLASS: Record<ComplianceStatus, string> = {
  on_track: "border-green-300 bg-green-50 text-green-800",
  preparing: "border-neutral-300 bg-neutral-50 text-neutral-700",
  due_soon: "border-amber-300 bg-amber-50 text-amber-800",
  overdue: "border-red-300 bg-red-50 text-red-800",
};

export function StatusSelect({ itemId, status }: { itemId: string; status: ComplianceStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as ComplianceStatus;
        startTransition(() => {
          updateComplianceStatus(itemId, next);
        });
      }}
      className={`rounded-md border px-2 py-1 text-xs font-medium ${STATUS_CLASS[status]} ${isPending ? "opacity-50" : ""}`}
    >
      {(Object.keys(STATUS_LABEL) as ComplianceStatus[]).map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
