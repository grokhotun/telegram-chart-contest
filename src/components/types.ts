import { Store } from '@/core/Observer';
import { Theme } from '@/theme';
import { MappedChartData } from '@/types';

export type Options = {
  store: Store;
  root: HTMLElement;
  data: MappedChartData;
  theme: Theme;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
};
