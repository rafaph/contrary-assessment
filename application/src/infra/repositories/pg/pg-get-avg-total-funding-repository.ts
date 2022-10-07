import { injectable } from "inversify";
import { Option, None, Some } from "oxide.ts";
import { Pool } from "pg";

import { GetAvgTotalFundingRepository } from "@/domain/repositories/get-avg-total-funding-repository";

@injectable()
export class PgGetAvgTotalFundingRepository
  implements GetAvgTotalFundingRepository
{
  public readonly QUERY_STATEMENT = `
    SELECT avg(c.known_total_funding)
    FROM companies c, people p
    WHERE c.name = p.company_name
      AND p.person_id = $1
      AND c.known_total_funding IS NOT NULL;`;

  public constructor(private readonly pool: Pool) {}

  public async getAvgTotalFunding(personId: string): Promise<Option<number>> {
    const { rows } = await this.pool.query<{ avg: string }>(
      this.QUERY_STATEMENT,
      [personId],
    );

    if (!rows[0].avg) {
      return None;
    }

    return Some(parseFloat(rows[0].avg));
  }
}
