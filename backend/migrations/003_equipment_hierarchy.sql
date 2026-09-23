CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO sections (code, name)
VALUES
    ('1', 'Section 1'),
    ('2', 'Section 2'),
    ('3', 'Section 3'),
    ('4', 'Section 4'),
    ('5', 'Section 5')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE equipment ADD COLUMN IF NOT EXISTS section_id UUID;

UPDATE equipment
SET section_id = sections.id
FROM sections
WHERE sections.code = equipment.section
  AND equipment.section_id IS NULL;

ALTER TABLE equipment
    DROP CONSTRAINT IF EXISTS equipment_section_id_fkey;

ALTER TABLE equipment
    ADD CONSTRAINT equipment_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES sections(id);

CREATE TABLE IF NOT EXISTS components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Operational',
    machine_id UUID NOT NULL REFERENCES equipment(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE components ALTER COLUMN asset_id DROP NOT NULL;

ALTER TABLE ewo_requests ADD COLUMN IF NOT EXISTS component_id UUID;

ALTER TABLE ewo_requests
    DROP CONSTRAINT IF EXISTS ewo_requests_component_id_fkey;

ALTER TABLE ewo_requests
    ADD CONSTRAINT ewo_requests_component_id_fkey
    FOREIGN KEY (component_id) REFERENCES components(id);