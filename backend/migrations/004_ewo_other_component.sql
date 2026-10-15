-- Add "Other" component description and failure category to ewo_requests
ALTER TABLE ewo_requests ADD COLUMN IF NOT EXISTS component_other_description TEXT;
ALTER TABLE ewo_requests ADD COLUMN IF NOT EXISTS failure_category VARCHAR(20);
