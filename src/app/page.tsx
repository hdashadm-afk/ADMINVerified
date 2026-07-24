import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/status-select";
import type { ComplianceItem, ComplianceStatus } from "@/types/db";

const STATUS_ORDER: Record<ComplianceStatus, number> = {
  overdue: 0,
  due_soon: 1,
  preparing: 2,
  on_track: 3,
};

const STATUS_LABEL: Record<ComplianceStatus, string> = {
  on_track: "On track",
  preparing: "Preparing",
  due_soon: "Due soon",
  overdue: "Overdue",
};

function dueDateLabel(dueDate: string | null) {
  if (!dueDate) return "No due date";
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
  const formatted = new Date(dueDate).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
  if (days < 0) return `${formatted} — ${Math.abs(days)}d overdue`;
  return `${formatted} — ${days}d away`;
}

export default async function CompliancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dipstify-app-icon.png" alt="Dipstify" width={40} height={40} className="mx-auto mb-2" />
        <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Dipstify</span>
        <h1 className="-mt-0.5 mb-2 text-lg font-semibold text-neutral-900">AdminVerified</h1>
        <p className="mb-6 text-sm text-neutral-500">Government Compliance &amp; Admin — part of the Dipstify product family.</p>
        <Link href="/login" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Sign in
        </Link>
      </div>
    );
  }

  const { data: rows } = await supabase
    .from("av_compliance_items")
    .select("*, av_compliance_item_types(*)")
    .order("due_date", { ascending: true, nullsFirst: false });

  const items = (rows ?? []) as unknown as ComplianceItem[];
  const sorted = [...items].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const overdueCount = items.filter((i) => i.status === "overdue").length;
  const dueSoonCount = items.filter((i) => i.status === "due_soon").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Compliance</h1>
          <p className="text-sm text-neutral-500">
            DENR, DOE, Real Property Tax, Business Permit, Fire Safety, ECC — company-wide and per-station.
          </p>
        </div>
        <Link href="/new" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          + Add item
        </Link>
      </div>

      {items.length > 0 && (
        <div className="flex gap-3 text-sm">
          {overdueCount > 0 && (
            <span className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 font-medium text-red-800">
              {overdueCount} overdue
            </span>
          )}
          {dueSoonCount > 0 && (
            <span className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 font-medium text-amber-800">
              {dueSoonCount} due soon
            </span>
          )}
          {overdueCount === 0 && dueSoonCount === 0 && (
            <span className="rounded-md border border-green-300 bg-green-50 px-3 py-1.5 font-medium text-green-800">
              Nothing overdue or due soon
            </span>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          No compliance items yet. <Link href="/new" className="underline">Add the first one</Link>.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="px-4 py-2 font-medium">Item</th>
                <th className="px-4 py-2 font-medium">Station</th>
                <th className="px-4 py-2 font-medium">Owner</th>
                <th className="px-4 py-2 font-medium">Due</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100 last:border-0 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">
                      {item.title || item.av_compliance_item_types?.label || "Untitled"}
                    </div>
                    {item.av_compliance_item_types && item.title && (
                      <div className="text-xs text-neutral-400">{item.av_compliance_item_types.label}</div>
                    )}
                    {item.notes && <div className="mt-1 text-xs text-neutral-500">{item.notes}</div>}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{item.station_code || "Company-wide"}</td>
                  <td className="px-4 py-3 text-neutral-700">{item.owner || "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{dueDateLabel(item.due_date)}</td>
                  <td className="px-4 py-3">
                    <StatusSelect itemId={item.id} status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-neutral-400">
        {sorted.length} item{sorted.length === 1 ? "" : "s"} · sorted {Object.values(STATUS_LABEL).join(" → ")}
      </p>
    </div>
  );
}
