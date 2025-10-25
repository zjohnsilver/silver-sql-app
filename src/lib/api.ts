import axios from 'axios';
import type { Client, QueryExecuteRequest, QueryResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async searchClients(search: string, limit: number = 20): Promise<Client[]> {
    const response = await apiClient.get('/clients', {
      params: { search, limit },
    });
    return response.data;
  },

  async resolveConnection(clientId: string): Promise<{ status: string; message?: string }> {
    const response = await apiClient.post(`/clients/${clientId}/resolve`);
    return response.data;
  },

  async executeQuery(request: QueryExecuteRequest): Promise<QueryResult> {
    const response = await apiClient.post('/query/execute', request);
    return response.data;
  },

  async cancelQuery(queryId: string): Promise<void> {
    await apiClient.post(`/query/${queryId}/cancel`);
  },
};

