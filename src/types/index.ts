export interface Client {
  id: string;
  name: string;
  tag?: string;
}

export interface QueryExecuteRequest {
  client_id: string;
  sql: string;
  options?: {
    max_rows?: number;
    timeout_seconds?: number;
  };
}

export interface ColumnMetadata {
  name: string;
  type: string;
}

export interface QueryResultSelect {
  type: 'select';
  columns: ColumnMetadata[];
  rows: any[][];
  total_rows: number;
  has_more: boolean;
  next_cursor?: string;
  duration_ms: number;
}

export interface QueryResultNonSelect {
  type: 'non_select';
  statement_type: string;
  rows_affected: number;
  duration_ms: number;
  messages?: string[];
  warnings?: string[];
}

export interface QueryError {
  code: string;
  message: string;
  hint?: string;
}

export type QueryResult = QueryResultSelect | QueryResultNonSelect;

export interface ConnectionStatus {
  status: 'idle' | 'resolving' | 'resolved' | 'failed';
  message?: string;
}

