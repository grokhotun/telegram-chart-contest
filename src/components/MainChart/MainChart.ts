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
        activeChart: this.activeCharts,
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
    return this.data.yAxis.map(({ name }) => name);
  }

  drawXAxis({ data, xRatio }: { data: MappedChartData; xRatio: number }) {
    const xCoords = data.xAxis.coords;
    const step = Math.round(xCoords.length / LABELS_COUNT);

    this.context.beginPath();

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
    this.context.closePath();
  }

  calculateOffsetCoords() {
    if (!this.proxy.position)
      return {
        ...this.data,
      };

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

  render() {
    this.clear();
    const calculatedData = this.calculateOffsetCoords();
    const activeCharts = calculatedData.yAxis.filter(({ name }) =>
      this.proxy.activeChart.includes(name)
    );

    const [yMin, yMax] = computeBoundaries({ yAxis: activeCharts });
    const yRatio = computeYRatio(this.canvasHeight - PADDING * 2, yMax, yMin);
    const xRatio = computeXRatio(
      this.canvasWidth,
      calculatedData.xAxis.coords.length
    );

    this.draw.yAxis({
      yMin,
      yMax,
      dpiWidth: this.canvasWidth,
      viewHeight: this.canvasHeight - PADDING * 2,
      textPadding: PADDING,
    });

    this.drawXAxis({
      data: calculatedData,
      xRatio,
    });

    activeCharts
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
        this.draw.drawLine(coords, color);

        for (const [x, y] of coords) {
          if (
            this.proxy.mouse.x &&
            isOver({
              mouseX: this.proxy.mouse.x,
              x,
              length: coords.length,
              canvasWidth: this.canvasWidth,
            })
          ) {
            this.draw.drawCircle([x, y], color);
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
