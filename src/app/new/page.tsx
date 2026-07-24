import { createClient } from "@/lib/supabase/server";
import { createComplianceItem } from "@/app/actions";
import type { ComplianceItemType } from "@/types/db";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";
const buttonClass =
  "rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800";

function Field({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {optional && <span className="ml-1 font-normal text-neutral-400">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

export default async function NewCompliancePage() {
  const supabase = await createClient();
  const { data: itemTypes } = await supabase
    .from("av_compliance_item_types")
    .select("*")
    .order("label");

  const typeList = (itemTypes ?? []) as ComplianceItemType[];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Add Compliance Item</h1>
        <p className="text-sm text-neutral-500">
          Company-wide items (e.g. DENR) leave Station blank. Per-station items (e.g. Business
          Permit) need a station code.
        </p>
      </div>

      <form action={createComplianceItem} className="grid grid-cols-2 gap-3 rounded-lg border border-neutral-200 bg-white p-6">
        <div className="col-span-2">
          <Field label="Item type">
            <select name="item_type_id" required className={inputClass}>
              <option value="">Select item type</option>
              {typeList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Title" optional>
          <input type="text" name="title" placeholder="Defaults to item type label" className={inputClass} />
        </Field>
        <Field label="Station" optional>
          <input type="text" name="station_code" placeholder="e.g. Hb — blank if company-wide" className={inputClass} />
        </Field>
        <Field label="Cadence" optional>
          <input type="text" name="cadence" placeholder="e.g. annual" className={inputClass} />
        </Field>
        <Field label="Due date" optional>
          <input type="date" name="due_date" className={inputClass} />
        </Field>
        <Field label="Owner" optional>
          <input type="text" name="owner" placeholder="e.g. Arlene" className={inputClass} />
        </Field>
        <Field label="Starting status">
          <select name="status" defaultValue="preparing" className={inputClass}>
            <option value="on_track">On track</option>
            <option value="preparing">Preparing</option>
            <option value="due_soon">Due soon</option>
            <option value="overdue">Overdue</option>
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Notes" optional>
            <textarea name="notes" rows={2} className={inputClass} />
          </Field>
        </div>
        <div className="col-span-2">
          <button type="submit" className={buttonClass}>Save</button>
        </div>
      </form>
    </div>
  );
}
