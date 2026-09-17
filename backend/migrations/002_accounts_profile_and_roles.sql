-- Add account profile fields and normalize management roles.
ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS department VARCHAR(100),
    ADD COLUMN IF NOT EXISTS position VARCHAR(100);

ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_role_check;

ALTER TABLE accounts
    ADD CONSTRAINT accounts_role_check
    CHECK (role IN ('operator', 'teknisi', 'team_leader', 'manager', 'general_manager', 'super_admin'))
    NOT VALID;

UPDATE accounts SET role = 'teknisi' WHERE role = 'teknisi_mtc';
UPDATE accounts SET role = 'team_leader' WHERE role IN ('teamleader_mtc', 'teamleader_produksi');
UPDATE accounts SET role = 'manager' WHERE role IN ('manager_mtc', 'manager_produksi');
UPDATE accounts SET role = 'general_manager' WHERE role = 'general_manager';
UPDATE accounts SET role = 'super_admin' WHERE role = 'super_admin';
UPDATE accounts SET role = 'super_admin' WHERE username = 'khairi';

ALTER TABLE accounts VALIDATE CONSTRAINT accounts_role_check;
