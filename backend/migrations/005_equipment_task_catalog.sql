CREATE TABLE IF NOT EXISTS equipment_task_catalog (
    id UUID PRIMARY KEY,
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    task_list TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    review_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    source VARCHAR(30) NOT NULL DEFAULT 'import',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ewo_requests ADD COLUMN IF NOT EXISTS task_catalog_id UUID REFERENCES equipment_task_catalog(id);
