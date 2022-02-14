import { Draw } from '@/core/draw';
import { MappedChartData } from '@/types';
import { computeBoundaries2, computeXRatio, computeYRatio, css } from '@/utils';

type Options = {
  canvas: HTMLCanvasElement;
  data: MappedChartData;
  width: number;
  height: number;
};

export class BaseChart {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly data: MappedChartData;
  private readonly draw: Draw;
  private readonly raf: number;
  private readonly width: number;
  private readonly height: number;
  private readonly dpiWidth: number;
  private readonly dpiHeight: number;
  private readonly viewWidth: number;
  private readonly viewHeight: number;

  constructor(options: Options) {
    const { canvas, width, height, data } = options;

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.data = data;

    this.draw = new Draw(this.context);
    this.raf = requestAnimationFrame(this.render);
    this.render = this.render.bind(this);

    this.width = width;
    this.height = height;
    this.dpiWidth = this.width * 2;
    this.dpiHeight = this.height * 2;
    this.viewWidth = this.dpiWidth;
    this.viewHeight = this.dpiHeight - 40 * 2;

    css(this.canvas, {
      width: `${this.width}px`,
      height: `${this.height}px`,
    });

    console.log('Log');

    this.canvas.width = this.dpiWidth;
    this.canvas.height = this.dpiHeight;
  }

  render() {
    const [yMin, yMax] = computeBoundaries2({ yAxis: this.data.yAxis });
    const yRatio = computeYRatio(this.viewHeight, yMax, yMin);
    const xRatio = computeXRatio(this.viewWidth, this.data.xAxis.coords.length);
  }

  clear() {
    this.context.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
  }
}
