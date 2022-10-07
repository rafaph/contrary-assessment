export abstract class GetCompaniesRepository {
  public abstract getCompanies(personId: string): Promise<string[]>;
}
