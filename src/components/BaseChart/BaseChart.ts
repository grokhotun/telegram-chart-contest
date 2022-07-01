import { Options } from '@/components/types';
import { Draw } from '@/core/draw';
import { MappedChartData } from '@/types';
import { css } from '@/utils';

export abstract class BaseChart {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly data: MappedChartData;
  readonly draw: Draw;
  readonly width: number;
  readonly height: number;

  constructor(options: Options) {
    const { canvas, width, height, data } = options;

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.draw = new Draw(this.context);

    this.data = data;
    this.width = width;
    this.height = height;

    css(this.canvas, {
      width: `${this.width}px`,
      height: `${this.height}px`,
    });

    this.canvas.width = width;
    this.canvas.height = height;
  }

  abstract render(): void;
}
