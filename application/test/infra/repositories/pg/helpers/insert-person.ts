import { Pool } from "pg";

import { Person } from "@test/interfaces/person";

const INSERT_STATEMENT = `INSERT INTO people(person_id, company_name, company_li_name, last_title, group_start_date, group_end_date) VALUES ($1, $2, $3, $4, $5, $6)`;

export const insertPerson = async (
  pool: Pool,
  person: Person,
): Promise<void> => {
  await pool.query(INSERT_STATEMENT, [
    person.person_id,
    person.company_name,
    person.company_li_name,
    person.last_title,
    person.group_start_date,
    person.group_end_date,
  ]);
};

export const insertPeople = async (
  pool: Pool,
  people: Person[],
): Promise<void> => {
  await Promise.all(people.map((person) => insertPerson(pool, person)));
};
