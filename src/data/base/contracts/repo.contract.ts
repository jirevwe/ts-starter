export interface QueryResult<T> {
  page: number;
  per_page: number;
  sort: string | object;
  result: T[];
}

/**
 * A repository query that specifies pagination options
 */
export interface PaginationQuery {
  archived?: boolean | string;
  conditions: any;
  page?: number;
  per_page?: number;
  projections?: any;
  sort?: string | object;
}

/**
 * A repository query
 */
export interface Query {
  conditions: any;
  projections?: any;
  sort?: string | object;
}

export interface Repository<T> {
  create(attributes: any): Promise<T>;
  byID(id: string, projections?: any, archived?: boolean): Promise<T>;
  byQuery(query: any, projections?: any, archived?: boolean);
  list(query: PaginationQuery): Promise<QueryResult<T>>;
  all(query: Query): Promise<T[]>;
  update(condition: string | object, update: any): Promise<T>;
  updateWithOperators(condition: string | object, update: any): Promise<T>;
  updateAll(condition: string | object, update: any): Promise<T[]>;
  remove(condition: string | object): Promise<T>;
  destroy(condition: string | object): Promise<T>;
}
