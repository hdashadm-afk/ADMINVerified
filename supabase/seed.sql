-- AdminVerified — seed data. The six item types match the real set
-- katiwala-owner-os-'s migration 091 already seeded (DENR, DOE, Real
-- Property Tax, Business Permit, Fire Safety, ECC), plus a few realistic
-- compliance_items rows so v1's home page isn't showing a bare zero.

insert into av_compliance_item_types (code, label, category, default_cadence) values
  ('denr', 'DENR', 'government', 'annual'),
  ('doe', 'DOE', 'government', 'annual'),
  ('real_property_tax', 'Real Property Tax', 'government', 'annual'),
  ('business_permit', 'Business Permit Renewal', 'government', 'annual'),
  ('fire_safety', 'Fire Safety Inspection Certificate', 'government', 'annual'),
  ('ecc', 'ECC', 'government', null);

insert into av_compliance_items (item_type_id, station_code, due_date, status, owner)
select id, 'Hb', (current_date + interval '45 days')::date, 'preparing', 'Arlene'
from av_compliance_item_types where code = 'business_permit';

insert into av_compliance_items (item_type_id, station_code, due_date, status, owner)
select id, 'Hb', (current_date + interval '10 days')::date, 'due_soon', 'Arlene'
from av_compliance_item_types where code = 'fire_safety';

insert into av_compliance_items (item_type_id, station_code, due_date, status, owner)
select id, null, (current_date + interval '200 days')::date, 'on_track', 'Arlene'
from av_compliance_item_types where code = 'denr';
