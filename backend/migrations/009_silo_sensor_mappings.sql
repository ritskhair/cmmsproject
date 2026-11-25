CREATE TABLE IF NOT EXISTS silo_sensor_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(150) NOT NULL,
    tag VARCHAR(150) NOT NULL,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    display_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_silo_sensor_mapping_relationship UNIQUE (device_id, tag, equipment_id)
);
