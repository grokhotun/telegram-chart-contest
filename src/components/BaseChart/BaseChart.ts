import { Options } from '@/components/types';
import { Draw } from '@/core/Draw';
import { Observer } from '@/core/Observer';
import { MappedChartData } from '@/types';
import { css } from '@/utils';

export abstract class BaseChart {
  readonly root: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly data: MappedChartData;
  readonly draw: Draw;
  readonly observer: Observer;

  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly width: number;
  readonly height: number;

  constructor(options: Options) {
    const { width, height, data, root, store, theme } = options;

    this.root = root;
    this.canvas = root.querySelector('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.draw = new Draw(this.context, theme);
    this.observer = new Observer(store);

    this.data = data;
    this.width = width;
    this.height = height;
    this.canvasWidth = width * 2;
    this.canvasHeight = height * 2;

    css(this.canvas, {
      width: `${width}px`,
      height: `${height}px`,
    });

    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  abstract render(): void;
}
