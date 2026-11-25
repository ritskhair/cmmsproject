ALTER TABLE silo_sensor_mappings
    DROP CONSTRAINT IF EXISTS uq_silo_sensor_mapping_sensor;

ALTER TABLE silo_sensor_mappings
    DROP CONSTRAINT IF EXISTS uq_silo_sensor_mapping_relationship;

ALTER TABLE silo_sensor_mappings
    ADD CONSTRAINT uq_silo_sensor_mapping_relationship
    UNIQUE (device_id, tag, equipment_id);
