export interface RestApiResponse<T> {
  status: 'OK' | 'ERROR';
  result?: T;
  error?: string;
}
