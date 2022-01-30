import { getChartData } from '@/data';

export type ChartData = ReturnType<typeof getChartData>;

export type Types = ChartData['types'];
export type Colors = ChartData['colors'];
export type Names = ChartData['names'];

export type Chart = {
  color: string;
  coords: number[][];
};

export type Options = {
  color: string;
  lineWidth: number;
};

export type MouseProxy = {
  mouse: {
    x: number | null;
  };
};
