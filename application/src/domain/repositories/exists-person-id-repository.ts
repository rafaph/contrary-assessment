export abstract class ExistsPersonIdRepository {
  public abstract exists(personId: string): Promise<boolean>;
}
