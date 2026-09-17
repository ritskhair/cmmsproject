-- Run once against the cmmsproject database.
-- Existing EWO rows are assigned section 1 until their real section is confirmed.

ALTER TABLE ewo_requests
    ADD COLUMN IF NOT EXISTS section VARCHAR(10);

UPDATE ewo_requests
SET section = '1'
WHERE section IS NULL;

ALTER TABLE ewo_requests
    ALTER COLUMN section SET NOT NULL;

UPDATE accounts
SET role = 'operator'
WHERE role = 'tim_produksi';
