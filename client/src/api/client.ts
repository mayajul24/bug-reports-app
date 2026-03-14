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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getReports(): Promise<Report[]> {
    return this.request<Report[]>('/api/reports');
  }

  private async sendReportWithAttachment<T>(endpoint: string, fields: Record<string, string>, file: File, fileField: string): Promise<T> {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append(fileField, file);
    const response = await fetch(`${this.baseUrl}${endpoint}`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return response.json();
  }

  async createReport(payload: CreateReportPayload, file?: File): Promise<Report> {
    if (file) {
      return this.sendReportWithAttachment<Report>('/api/reports', payload, file, 'attachment');
    }
    return this.request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async approveReport(id: string): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}/approve`, { method: 'POST' });
  }

  async resolveReport(id: string): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}/resolve`, { method: 'POST' });
  }

  async checkStatus(email: string): Promise<CheckStatusResponse> {
    return this.request<CheckStatusResponse>(`/api/check-status?email=${encodeURIComponent(email)}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
