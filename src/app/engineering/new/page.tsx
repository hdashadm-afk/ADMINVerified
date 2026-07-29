import { createEngineeringReport } from "@/app/actions";

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

export default function NewEngineeringReportPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Add Engineering Report</h1>
        <p className="text-sm text-neutral-500">
          Company-wide reports leave Station blank. Per-station reports need a station code.
        </p>
      </div>

      <form action={createEngineeringReport} className="grid grid-cols-2 gap-3 rounded-lg border border-neutral-200 bg-white p-6">
        <Field label="Report date">
          <input type="date" name="report_date" defaultValue={today} required className={inputClass} />
        </Field>
        <Field label="Station" optional>
          <input type="text" name="station_code" placeholder="e.g. Hb — blank if company-wide" className={inputClass} />
        </Field>
        <Field label="Open repair count">
          <input type="number" name="open_repair_count" min={0} required className={inputClass} />
        </Field>
        <Field label="Repairs completed this period">
          <input type="number" name="repairs_completed_count" min={0} required className={inputClass} />
        </Field>
        <Field label="Reported by" optional>
          <input type="text" name="reported_by" placeholder="e.g. Arlene" className={inputClass} />
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
