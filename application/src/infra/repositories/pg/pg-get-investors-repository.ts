import { injectable } from "inversify";
import { None, Option, Some } from "oxide.ts";
import { Pool } from "pg";

import { GetInvestorsRepository } from "@/domain/repositories/get-investors-repository";

@injectable()
export class PgGetInvestorsRepository implements GetInvestorsRepository {
  public readonly QUERY_STATEMENT = `
    SELECT investors
    FROM companies
    WHERE $1 = ANY (linkedin_names);`;

  public constructor(private readonly pool: Pool) {}

  public async getInvestors(linkedinName: string): Promise<Option<string[]>> {
    const { rows } = await this.pool.query<{ investors: string[] }>(
      this.QUERY_STATEMENT,
      [linkedinName],
    );

    if (rows.length === 0) {
      return None;
    }

    return Some(rows[0].investors);
  }
}
