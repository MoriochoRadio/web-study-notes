-- Run in a selected practice database. Only session-local temporary data is used.
CREATE TEMPORARY TABLE ct16_animals (started_at DATETIME NOT NULL);
INSERT INTO ct16_animals VALUES
('2026-09-18 08:00:00'), ('2026-08-31 23:59:59'),
('2026-09-18 20:30:00'), ('2026-09-18 20:30:00');
SELECT 'unordered + duplicate maximum' AS test,
       MAX(started_at) = '2026-09-18 20:30:00' AS passed FROM ct16_animals;
DELETE FROM ct16_animals;
INSERT INTO ct16_animals VALUES ('2026-01-01 00:00:00');
SELECT 'single row' AS test,
       MAX(started_at) = '2026-01-01 00:00:00' AS passed FROM ct16_animals;
DELETE FROM ct16_animals;
SELECT 'empty set' AS test, MAX(started_at) IS NULL AS passed FROM ct16_animals;
DROP TEMPORARY TABLE ct16_animals;
