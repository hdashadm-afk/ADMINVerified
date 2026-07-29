import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { EngineeringReport } from "@/types/db";

function dateLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

export default async function EngineeringPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-neutral-500">
          <Link href="/login" className="underline">Sign in</Link> to view Engineering reports.
        </p>
      </div>
    );
  }

  const { data: rows } = await supabase
    .from("av_engineering_reports")
    .select("*")
    .order("report_date", { ascending: false })
    .order("created_at", { ascending: false });

  const reports = (rows ?? []) as EngineeringReport[];
  const latestOpen = reports[0]?.open_repair_count ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Engineering</h1>
          <p className="text-sm text-neutral-500">
            Repair/maintenance status reports — company-wide and per-station.
          </p>
        </div>
        <Link href="/engineering/new" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          + Add report
        </Link>
      </div>

      {latestOpen !== null && (
        <div className="flex gap-3 text-sm">
          <span
            className={`rounded-md border px-3 py-1.5 font-medium ${
              latestOpen > 0
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-green-300 bg-green-50 text-green-800"
            }`}
          >
            {latestOpen} open repair{latestOpen === 1 ? "" : "s"} as of latest report
          </span>
        </div>
      )}

      {reports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          No Engineering reports yet. <Link href="/engineering/new" className="underline">Add the first one</Link>.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Station</th>
                <th className="px-4 py-2 font-medium">Open repairs</th>
                <th className="px-4 py-2 font-medium">Completed this period</th>
                <th className="px-4 py-2 font-medium">Reported by</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 align-top">
                  <td className="px-4 py-3 text-neutral-700">{dateLabel(r.report_date)}</td>
                  <td className="px-4 py-3 text-neutral-700">{r.station_code || "Company-wide"}</td>
                  <td className="px-4 py-3">
                    <span className={r.open_repair_count && r.open_repair_count > 0 ? "font-medium text-amber-700" : "text-neutral-700"}>
                      {r.open_repair_count ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{r.repairs_completed_count ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">
                    {r.reported_by || "—"}
                    {r.notes && <div className="mt-1 text-xs text-neutral-500">{r.notes}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-neutral-400">
        {reports.length} report{reports.length === 1 ? "" : "s"} · newest first
      </p>
    </div>
  );
}
