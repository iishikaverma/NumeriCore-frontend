// Mirrors the backend JSON contract (see docs/api-documentation.md).

export type Operation = 'calculate_area' | 'calculate_volume';

export interface CalculateRequest {
  operation: Operation;
  start: number;
  end: number;
  x_values: number[];
  y_values: number[];
  midpoint_values: number[];
  actual_area?: number;
  actual_volume?: number;
}

export interface MethodResult {
  estimated_value: number;
  absolute_error: number | null;
  percentage_error: number | null;
}

export type MethodKey = 'trapezoidal' | 'midpoint' | 'simpson';

export interface CalculationData {
  step_size: number;
  actual_value: number | null;
  comparison_available: boolean;
  results: Record<MethodKey, MethodResult>;
  most_accurate_methods: string[];
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  data: CalculationData | null;
  error: ApiError | null;
}
