import { PADDING } from '@/chart/constants';
import { BaseChart } from '@/components/BaseChart';
import { computeXRatio, computeYRatio, css, toCoords } from '@/utils';

import { Options } from '@/components/types';
import { MouseProxy } from '@/types';
import { computeBoundaries } from './helpers';

export class MainChart extends BaseChart {
  private raf: number;
  private readonly dpiWidth: number;
  private readonly dpiHeight: number;
  private readonly viewWidth: number;
  private readonly viewHeight: number;
  private readonly proxy: MouseProxy;

  constructor(options: Options) {
    super(options);

    this.render = this.render.bind(this);
    this.raf = requestAnimationFrame(this.render);
    this.proxy = new Proxy<MouseProxy>(
      {
        mouse: {
          x: null,
          tooltip: {
            top: null,
            left: null,
          },
        },
        position: null,
      },
      {
        set: (...args) => {
          const result = Reflect.set(...args);
          this.raf = requestAnimationFrame(this.render);
          return result;
        },
      }
    );

    this.dpiWidth = this.width * 2;
    this.dpiHeight = this.height * 2;
    this.viewWidth = this.dpiWidth;
    this.viewHeight = this.dpiHeight - PADDING * 2;

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

    this.draw.yAxis({
      yMin,
      yMax,
      dpiWidth: this.dpiWidth,
      viewHeight: this.viewHeight,
      textPadding: PADDING,
    });

    this.data.yAxis
      .map(({ color, coords: initialCoords }) => {
        const coords = initialCoords.map((y, i) =>
          toCoords(i, y, {
            xRatio,
            yRatio,
            dpiHeight: this.dpiHeight,
            padding: PADDING,
            yMin,
          })
        );

        return {
          color,
          coords,
        };
      })
      .forEach(({ color, coords }) => {
        this.draw.drawLine(coords, { lineWidth: 4, color });
      });
  }

  clear() {
    this.context.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
  }

  onPositionUpdate(position: number[]) {
    this.proxy.position = position;
  }

  init() {
    this.render();
    this.observer.subscribe('slider', (position: number[] | undefined) => {
      if (!position) return;
      this.onPositionUpdate(position);
    });
  }
}
