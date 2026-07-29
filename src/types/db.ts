export type ComplianceStatus = "on_track" | "preparing" | "due_soon" | "overdue";

export type ComplianceItemType = {
  id: string;
  code: string;
  label: string;
  category: "government" | "contract" | "other";
  default_cadence: string | null;
};

export type ComplianceItem = {
  id: string;
  station_code: string | null;
  item_type_id: string;
  title: string | null;
  cadence: string | null;
  due_date: string | null;
  status: ComplianceStatus;
  owner: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  av_compliance_item_types: ComplianceItemType | null;
};

export type EngineeringReport = {
  id: string;
  station_code: string | null;
  report_date: string;
  open_repair_count: number | null;
  repairs_completed_count: number | null;
  notes: string | null;
  reported_by: string | null;
  created_at: string;
};
