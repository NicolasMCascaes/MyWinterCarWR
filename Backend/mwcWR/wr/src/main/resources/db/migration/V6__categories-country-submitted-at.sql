ALTER TABLE mwc_users ADD COLUMN country VARCHAR(2);

ALTER TABLE attempts ADD COLUMN submitted_at TIMESTAMP WITHOUT TIME ZONE;

UPDATE attempts SET attempt_category = 'ICE_RACE' WHERE attempt_category = 'ICERACE';
UPDATE attempts SET attempt_category = 'FULL_ASSEMBLY' WHERE attempt_category = 'ASSEMBLY';
