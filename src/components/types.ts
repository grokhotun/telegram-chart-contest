import { Store } from '@/core/Observer';
import { MappedChartData } from '@/types';

export type Options = {
  store: Store;
  root: HTMLElement;
  data: MappedChartData;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
};
