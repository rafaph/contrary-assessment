CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  linkedin_names TEXT[] NOT NULL,
  description TEXT,
  headcount INTEGER,
  founding_date DATE,
  most_recent_raise BIGINT,
  most_recent_valuation BIGINT,
  investors TEXT[] NOT NULL,
  known_total_funding BIGINT,
  CONSTRAINT companies_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS people (
  id UUID DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL,
  company_name TEXT,
  company_li_name TEXT,
  last_title TEXT,
  group_start_date DATE,
  group_end_date DATE,
  CONSTRAINT people_pk PRIMARY KEY (id)
);
