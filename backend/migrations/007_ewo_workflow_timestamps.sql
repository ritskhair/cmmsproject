ALTER TABLE ewo_requests ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE ewo_maintenance ALTER COLUMN code_approval DROP NOT NULL;
ALTER TABLE ewo_maintenance ALTER COLUMN start_time DROP NOT NULL;
ALTER TABLE ewo_maintenance ALTER COLUMN end_time DROP NOT NULL;
ALTER TABLE ewo_maintenance ADD COLUMN IF NOT EXISTS failure_category VARCHAR(20);
