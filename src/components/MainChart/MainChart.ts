import { LABELS_COUNT, PADDING } from '@/chart/constants';
import { BaseChart } from '@/components/BaseChart';
import {
  computeXRatio,
  computeYRatio,
  toCoords,
  toDate,
  isEven,
  isOver,
} from '@/utils';

import { Options } from '@/components/types';
import { MappedChartData, MouseProxy } from '@/types';
import { Tooltip } from '@/components/Tooltip';
import { Theme } from '@/theme';
import { computeBoundaries } from './helpers';

export class MainChart extends BaseChart {
  private raf: number;
  private readonly proxy: MouseProxy;
  private readonly tooltip: Tooltip;
  private prevMax: number | null = null;

  constructor(options: Options) {
    super(options);

    this.render = this.render.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
        activeChart: this.data.yAxis.map(({ name }) => name),
        max: null,
      },
      {
        set: (...args) => {
          const result = Reflect.set(...args);
          this.raf = requestAnimationFrame(this.render);
          return result;
        },
      }
    );

    this.tooltip = new Tooltip(
      this.root.querySelector('[data-element="tooltip"]') as HTMLElement
    );
  }

  get activeCharts() {
    return this.offsetData.yAxis.filter(({ name }) =>
      this.proxy.activeChart.includes(name)
    );
  }

  xAxis({
    data,
    xRatio,
    translate,
  }: {
    data: MappedChartData;
    xRatio: number;
    translate: number;
  }) {
    const xCoords = data.xAxis.coords;
    const step = Math.round(xCoords.length / LABELS_COUNT);

    this.context.beginPath();
    this.context.save();
    this.context.translate(translate, 0);

    xCoords.forEach((coord, idx) => {
      const xCoord = (idx + 1) * xRatio;
      const text = toDate(coord);

      if (isEven(idx, step)) {
        this.context.fillText(text, xCoord, this.canvasHeight - 10);
      }

      if (
        this.proxy.mouse.x &&
        isOver({
          mouseX: this.proxy.mouse.x,
          x: xCoord,
          length: xCoords.length,
          canvasWidth: this.canvasWidth,
          translate,
        })
      ) {
        this.context.save();
        this.context.moveTo(xCoord, PADDING / 2);
        this.context.lineTo(xCoord, this.canvasHeight - PADDING);
        this.context.restore();

        if (this.proxy.mouse.tooltip.top && this.proxy.mouse.tooltip.left) {
          const content = data.yAxis.map(({ color, coords, name }) => {
            return {
              color,
              name,
              value: `${coords[idx + 1]}`,
            };
          });

          this.tooltip.show({
            title: text,
            top: this.proxy.mouse.tooltip.top,
            left: this.proxy.mouse.tooltip.left,
            content,
          });
        }
      }
    });

    this.context.stroke();
    this.context.restore();
    this.context.closePath();
  }

  get offsetData() {
    if (!this.proxy.position) return this.data;

    const dataAmount = this.data.xAxis.coords.length;
    const leftIndex = Math.round((dataAmount * this.proxy.position[0]) / 100);
    const rightIndex = Math.round((dataAmount * this.proxy.position[1]) / 100);

    return {
      xAxis: {
        ...this.data.xAxis,
        coords: this.data.xAxis.coords.slice(leftIndex, rightIndex),
      },
      yAxis: this.data.yAxis.map((v) => ({
        ...v,
        coords: v.coords.slice(leftIndex, rightIndex),
      })),
    };
  }

  update(activeChart: string[]) {
    this.proxy.activeChart = activeChart;
  }

  translate(xRatio: number, left: number, length: number) {
    return -1 * Math.round((left * length * xRatio) / 100);
  }

  getMax(yMax: number) {
    const step = (yMax - this.prevMax!) / 500;

    if (this.proxy.max! < yMax) {
      this.proxy.max! += step;
    } else if (this.proxy.max! > yMax) {
      this.proxy.max = yMax;
      this.prevMax = yMax;
    }

    return this.proxy.max as number;
  }

  render() {
    this.clear();

    const [yMin, yMax] = computeBoundaries(this.offsetData.yAxis);

    if (!this.prevMax) {
      this.prevMax = yMax;
      this.proxy.max = yMax;
    }

    const max = this.getMax(yMax);

    const yRatio = computeYRatio(this.canvasHeight - PADDING * 2, max, yMin);
    const xRatio = computeXRatio(
      this.canvasWidth,
      this.offsetData.xAxis.coords.length
    );

    const left = this.proxy.position ? this.proxy.position[0] : 0;
    const translate = this.translate(
      xRatio,
      left,
      this.data.xAxis.coords.length
    );

    this.draw.yAxis({
      yMin,
      yMax,
      dpiWidth: this.canvasWidth,
      viewHeight: this.canvasHeight - PADDING * 2,
      textPadding: PADDING,
    });

    this.xAxis({
      data: this.data,
      xRatio,
      translate,
    });

    this.data.yAxis
      .map(({ color, coords: initialCoords }) => {
        const coords = initialCoords.map((y, i) =>
          toCoords(i, y, {
            xRatio,
            yRatio,
            dpiHeight: this.canvasHeight,
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
        this.draw.drawLine(coords, { color, translate });

        for (const [x, y] of coords) {
          if (
            this.proxy.mouse.x &&
            isOver({
              mouseX: this.proxy.mouse.x,
              x,
              length: coords.length,
              canvasWidth: this.canvasWidth,
              translate,
            })
          ) {
            this.draw.drawCircle([x, y], { color, translate });
          }
        }
      });
  }

  clear() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  onPositionUpdate(position: number[]) {
    this.proxy.position = position;
  }

  handleMouseMove({ clientX, clientY }: MouseEvent) {
    const { top, left } = this.canvas.getBoundingClientRect();

    this.proxy.mouse = {
      x: (clientX - left) * 2,
      tooltip: {
        top: clientY - top,
        left: clientX - left,
      },
    };
  }

  handleMouseLeave() {
    this.proxy.mouse.x = null;
    this.tooltip.hide();
  }

  setTheme(theme: Theme) {
    this.tooltip.setTheme(theme);
    this.draw.setTheme(theme);
    this.raf = requestAnimationFrame(this.render);
  }

  init() {
    this.render();
    this.observer.subscribe('slider', (position: number[] | undefined) => {
      if (!position) return;
      this.onPositionUpdate(position);
    });

    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

  destroy() {
    this.observer.unsubscribe('slider');
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}
