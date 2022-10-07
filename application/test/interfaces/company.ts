export interface Company {
  name: string;
  linkedin_names: string[];
  description?: string;
  headcount?: number;
  founding_date?: Date;
  most_recent_raise?: number;
  most_recent_valuation?: number;
  investors: string[];
  known_total_funding?: number;
}
