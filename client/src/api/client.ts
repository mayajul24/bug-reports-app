import { Report, CreateReportPayload, CheckStatusResponse } from '../types/Report';
import { API_BASE_URL } from '../config';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error ?? `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getReports(): Promise<Report[]> {
    return this.request<Report[]>('/api/reports');
  }

  async createReport(payload: CreateReportPayload, file?: File): Promise<Report> {
    if (file) {
      const formData = new FormData();
      const { attachmentUrl: _, ...rest } = payload;
      Object.entries(rest).forEach(([key, value]) => formData.append(key, value));
      formData.append('attachment', file);
      const response = await fetch(`${this.baseUrl}/api/reports`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      return response.json();
    }
    return this.request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async approveReport(id: string, email: string): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resolveReport(id: string, email: string): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async login(email: string, password: string): Promise<CheckStatusResponse> {
    return this.request<CheckStatusResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
