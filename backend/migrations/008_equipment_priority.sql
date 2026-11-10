ALTER TABLE equipment
    ADD COLUMN IF NOT EXISTS priority VARCHAR(10);

ALTER TABLE equipment
    DROP CONSTRAINT IF EXISTS equipment_priority_check;

ALTER TABLE equipment
    ADD CONSTRAINT equipment_priority_check
    CHECK (priority IS NULL OR priority IN ('High', 'Medium', 'Low'));
