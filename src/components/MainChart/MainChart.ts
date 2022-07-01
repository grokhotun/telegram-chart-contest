import { BaseChart } from '@/components/BaseChart';
import { MappedChartData } from '@/types';
import { computeXRatio, computeYRatio, css } from '@/utils';

import { computeBoundaries } from './helpers';

type Options = {
  canvas: HTMLCanvasElement;
  data: MappedChartData;
  width: number;
  height: number;
};

export class MainChart extends BaseChart {
  private readonly raf: number;
  private readonly dpiWidth: number;
  private readonly dpiHeight: number;
  private readonly viewWidth: number;
  private readonly viewHeight: number;

  constructor(options: Options) {
    super(options);

    this.render = this.render.bind(this);
    this.raf = requestAnimationFrame(this.render);

    this.dpiWidth = this.width * 2;
    this.dpiHeight = this.height * 2;
    this.viewWidth = this.dpiWidth;
    this.viewHeight = this.dpiHeight - 40 * 2;

    css(this.canvas, {
      width: `${this.width}px`,
      height: `${this.height}px`,
    });

    this.canvas.width = this.dpiWidth;
    this.canvas.height = this.dpiHeight;
  }

  render() {
    this.clear();

    const [yMin, yMax] = computeBoundaries({ yAxis: this.data.yAxis });
    const yRatio = computeYRatio(this.viewHeight, yMax, yMin);
    const xRatio = computeXRatio(this.viewWidth, this.data.xAxis.coords.length);
  }

  clear() {
    this.context.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
  }
}
