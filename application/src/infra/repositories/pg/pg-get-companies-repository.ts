import { injectable } from "inversify";
import { Pool } from "pg";

import { GetCompaniesRepository } from "@/domain/repositories/get-companies-repository";

@injectable()
export class PgGetCompaniesRepository implements GetCompaniesRepository {
  public readonly QUERY_STATEMENT = `
    SELECT company_name
    FROM people
    WHERE person_id = $1
      AND company_name IS NOT NULL;`;

  public constructor(private readonly pool: Pool) {}

  public async getCompanies(personId: string): Promise<string[]> {
    const { rows } = await this.pool.query<{ company_name: string }>(
      this.QUERY_STATEMENT,
      [personId],
    );

    return rows.map((row) => row.company_name);
  }
}
