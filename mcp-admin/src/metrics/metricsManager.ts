import { SystemMetrics } from '../types/index.js';

class MetricsManager {
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalDurationMs = 0;
  private startedAt = new Date().toISOString();

  public recordRequest(statusCode: number, durationMs: number): void {
    this.totalRequests++;
    this.totalDurationMs += durationMs;

    if (statusCode >= 200 && statusCode < 400) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
    }
  }

  public getMetrics(): SystemMetrics {
    const avgDuration = this.totalRequests > 0 ? Number((this.totalDurationMs / this.totalRequests).toFixed(2)) : 0;

    return {
      requests: this.totalRequests,
      success: this.successfulRequests,
      errors: this.failedRequests,
      averageResponseTimeMs: avgDuration,
      startedAt: this.startedAt,
    };
  }

  public reset(): void {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalDurationMs = 0;
    this.startedAt = new Date().toISOString();
  }
}

export const metricsManager = new MetricsManager();
