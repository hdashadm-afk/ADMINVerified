import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
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

  // v1 is schema + seed data only (no compliance list/create UI yet, per
  // the founder's explicit scope decision — see SCOPE.md). This count is
  // just proof the schema/seed actually landed, not a real feature.
  const { count } = await supabase
    .from("av_compliance_items")
    .select("*", { count: "exact", head: true });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-2 text-lg font-semibold text-neutral-900">AdminVerified</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Government Compliance &amp; Admin tracking — DENR, DOE, Business Permit, Fire Safety,
        ECC, Real Property Tax.
      </p>
      <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        {count ?? 0} compliance item{count === 1 ? "" : "s"} seeded. The compliance
        list/tracking screen isn&apos;t built yet — this is a schema-and-auth
        scaffold, see <span className="font-mono">SCOPE.md</span> for what&apos;s next.
      </p>
    </div>
  );
}
