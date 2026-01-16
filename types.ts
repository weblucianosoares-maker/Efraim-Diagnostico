export type PageState = 'landing' | 'quiz' | 'results' | 'plan';

export interface RadarDataPoint {
  subject: string;
  A: number; // Current
  B: number; // Benchmark
  fullMark: number;
}

export interface SwotItem {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  items: string[];
}