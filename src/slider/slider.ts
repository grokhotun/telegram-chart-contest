import { ChartData } from '@/types';
import { css } from '@/utils';

import { DPI_HEIGHT, HEIGHT } from './constants';

type Options = {
  dpiWidth: number;
};

export function chartSlider(
  root: HTMLElement,
  data: ChartData,
  { dpiWidth }: Options
) {
  const width = dpiWidth / 2;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = dpiWidth;
  canvas.height = DPI_HEIGHT;
  css(canvas, {
    width: `${width}px`,
    height: `${HEIGHT}px`,
  });
}
