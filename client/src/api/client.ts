import { Report, CreateReportPayload } from '../types/Report';
import { LoginResponse } from '../types/Auth';
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
    const url = new URL(endpoint, this.baseUrl).toString();
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

  // Sends multipart/form-data when a file is attached so the browser sets the correct
  // Content-Type boundary automatically. Falls back to JSON when there is no attachment.
  async createReport(payload: CreateReportPayload, file?: File): Promise<Report> {
    if (file) {
      const formData = new FormData();
      const { attachmentUrl: _, ...rest } = payload;
      Object.entries(rest).forEach(([key, value]) => formData.append(key, value));
      formData.append('attachment', file);
      const url = new URL('/api/reports', this.baseUrl).toString();
      const response = await fetch(url, { method: 'POST', body: formData });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      return response.json();
    }
    return this.request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  private async updateReportStatus(id: string, action: 'approve' | 'resolve', email: string): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}/${action}`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async approveReport(id: string, email: string): Promise<Report> {
    return this.updateReportStatus(id, 'approve', email);
  }

  async resolveReport(id: string, email: string): Promise<Report> {
    return this.updateReportStatus(id, 'resolve', email);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
