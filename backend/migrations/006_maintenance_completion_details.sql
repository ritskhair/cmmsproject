ALTER TABLE ewo_maintenance ADD COLUMN IF NOT EXISTS root_cause TEXT;
ALTER TABLE ewo_maintenance ADD COLUMN IF NOT EXISTS tools_used TEXT;
ALTER TABLE ewo_maintenance ADD COLUMN IF NOT EXISTS failure_type VARCHAR(20);
