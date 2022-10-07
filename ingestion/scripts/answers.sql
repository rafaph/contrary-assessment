-- Question 1:
-- What is the average total funding of all of the companies that the person with ID =
-- ‘92a52877-8d5d-41a6-950f-1b9c6574be7a’ has worked at?

SELECT avg(c.known_total_funding)
FROM companies c, people p
WHERE c.name = p.company_name
  AND p.person_id = '92a52877-8d5d-41a6-950f-1b9c6574be7a'
  AND c.known_total_funding IS NOT NULL;
-- A: 108.000.000


-- Question 2:
-- How many companies are in the companies table that no people in the people table have worked
-- for?

SELECT count(name)
FROM companies
WHERE name NOT IN (SELECT DISTINCT company_name FROM people WHERE company_name IS NOT NULL);
-- A: 9431

-- Question 3:
-- What are the ten most popular companies that these 1,000 people have worked for?

SELECT company_name
FROM people
WHERE company_name IS NOT NULL
GROUP BY company_name
ORDER BY count(company_name) DESC
LIMIT 10;
-- A:
-- Microsoft
-- Amazon
-- Intel Corporation
-- Google
-- Apple
-- Hewlett Packard Enterprise
-- Facebook
-- Texas Instruments
-- Hewlett-Packard
-- Meta

-- Question 4:
-- Identify company founders in the people table.
-- Then identify the companies that these people have founded and
-- list the top three largest companies by headcount,
-- along with the name of that company and the person ID of the founder(s)

SELECT p.person_id, p.company_name, c.headcount
FROM people p, companies c
WHERE p.last_title IS NOT NULL
  AND p.company_name IS NOT NULL
  AND c.headcount IS NOT NULL
  AND p.last_title ILIKE '%founder%'
  AND p.company_name = c.name
GROUP BY p.person_id, p.company_name, c.headcount
ORDER BY c.headcount DESC
LIMIT 3;
-- A:
-- bb0d8489-4360-4a94-bd3d-c079f75afc96,Dafiti,2907
-- a292842c-475e-4b4f-9671-fb09536c472e,eBay for Business,1336
-- c6f69f63-c7d5-419f-af34-d0cccf544e18,UWorld,439


-- Question 5:
-- For each person in the people table, identify their 2nd most recent job (if they only have 1 job,
-- please exclude them). What is the average duration in years of employment across everyone’s
-- 2nd most recent job? Additionally, how many people have had more than 1 job?

SELECT avg(extract(year from group_end_date) - extract(year from group_start_date)) as duration
FROM (
    SELECT
      p.group_start_date,
      coalesce(p.group_end_date, CURRENT_DATE) as group_end_date,
      row_number() OVER (PARTITION BY person_id ORDER BY greatest(p.group_start_date, coalesce(p.group_end_date, CURRENT_DATE)) DESC)
    FROM people p
    WHERE (
      SELECT count(*) FROM people p1 WHERE p.person_id = p1.person_id
    ) > 1 AND p.group_start_date IS NOT NULL
) as Temp
WHERE row_number = 2;
-- A: 3.7044444444444444

-- Additionally, how many people have had more than 1 job?
SELECT count(*) FROM (
  SELECT p.person_id
  FROM people p
  WHERE (SELECT count(*) FROM people p1 WHERE p.person_id = p1.person_id) > 1
  GROUP BY p.person_id
) as Temp;
-- A: 904

-- api endpoints --

-- 1) /avg-funding-by-person/[person_id]
-- This route will accept a person_id, and return the dynamic answer to question 1 for the
-- person_id requested. (if there is no funding value then return 0).

-- see question 1 answer

-- 2) /companies-by-person/[person_id]
-- This route will accept a person_id and return a list of all of the companies that person has
-- worked at

SELECT company_name
FROM people
WHERE person_id = '92a52877-8d5d-41a6-950f-1b9c6574be7a'
  AND company_name IS NOT NULL;

-- 3) /investors-by-company/[company_linkedin_name]
-- This route will accept a company by any of its linkedin names, and return a list of the
-- investors.

SELECT investors
FROM companies
WHERE '53171782' = ANY (linkedin_names);
