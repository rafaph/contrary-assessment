import { Pool } from "pg";

import { Company } from "@test/interfaces/company";

const INSERT_STATEMENT = `INSERT INTO companies(name, linkedin_names, description, headcount, founding_date, most_recent_raise, most_recent_valuation, investors, known_total_funding) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

export const insertCompany = async (
  pool: Pool,
  company: Company,
): Promise<void> => {
  await pool.query(INSERT_STATEMENT, [
    company.name,
    company.linkedin_names,
    company.description,
    company.headcount,
    company.founding_date,
    company.most_recent_raise,
    company.most_recent_valuation,
    company.investors,
    company.known_total_funding,
  ]);
};

export const insertCompanies = async (
  pool: Pool,
  companies: Company[],
): Promise<void> => {
  await Promise.all(companies.map((company) => insertCompany(pool, company)));
};
