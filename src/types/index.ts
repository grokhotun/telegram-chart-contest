import { getChartData } from '@/data';

export type ChartData = ReturnType<typeof getChartData>;

export type ChartTypes = ChartData['types'];
export type ChartColors = ChartData['colors'];
export type ChartNames = ChartData['names'];

export type Column = {
  name: string;
  type: string;
  color: string;
  coords: number[];
};

export type MappedChartData = {
  xAxis: Pick<Column, 'type' | 'coords'>;
  yAxis: Column[];
};

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
    tooltip: {
      top: number | null;
      left: number | null;
    };
  };
  position: number[] | null;
  activeChart: string[];
};
