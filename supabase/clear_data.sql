-- WARNING: This will delete ALL data in these tables
TRUNCATE TABLE owners CASCADE;
TRUNCATE TABLE properties CASCADE;
-- blocked_dates is linked to properties so it should be cleared by CASCADE, but for safety:
TRUNCATE TABLE blocked_dates CASCADE;
