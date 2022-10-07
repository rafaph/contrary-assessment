import { injectable } from "inversify";
import { Pool } from "pg";

import { ExistsPersonIdRepository } from "@/domain/repositories/exists-person-id-repository";

@injectable()
export class PgExistsPersonIdRepository implements ExistsPersonIdRepository {
  public readonly QUERY_STATEMENT = `
    SELECT id
    FROM people
    WHERE person_id = $1
    LIMIT 1`;

  public constructor(private readonly pool: Pool) {}

  public async exists(personId: string): Promise<boolean> {
    const { rows } = await this.pool.query(this.QUERY_STATEMENT, [personId]);

    return rows.length > 0;
  }
}
