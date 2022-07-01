import { ChartData, ChartNames, ChartTypes, Chart, MouseProxy } from '@/types';
import {
  PADDING,
  WIDTH,
  HEIGHT,
  DPI_WIDTH,
  DPI_HEIGHT,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  LABELS_COUNT,
} from '@/chart/constants';
import {
  toCoords,
  toDate,
  isOver,
  computeBoundaries,
  css,
  computeYRatio,
  computeXRatio,
} from '@/utils';
import { tooltip } from '@/tooltip';
import { chartSlider } from '@/slider';
import { Draw } from '@/core/draw';

export function chart(
  root: HTMLElement,
  chartData: ChartData
): {
  init: () => void;
  destroy: () => void;
} {
  const { columns, types, colors, names } = chartData;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const canvasTooltip = tooltip(
    root.querySelector('[data-element="tooltip"]') as HTMLElement
  );
  const slider = chartSlider(
    root.querySelector('[data-element="slider"]') as HTMLElement,
    chartData,
    { dpiWidth: DPI_WIDTH }
  );

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const draw = new Draw(ctx);

  css(canvas, {
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
  });

  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;

  let raf: number;

  const proxy = new Proxy<MouseProxy>(
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
      set(...args) {
        const result = Reflect.set(...args);
        raf = requestAnimationFrame(paint);
        return result;
      },
    }
  );

  slider.subscribe((position) => {
    proxy.position = position;
  });

  function clear() {
    ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
  }

  function paint() {
    clear();

    const dataLength = columns[0].length;
    const leftIndex = Math.round((dataLength * proxy.position![0]) / 100);
    const rightIndex = Math.round((dataLength * proxy.position![1]) / 100);

    const computedColumns = columns.map((column) => {
      const result = column.slice(leftIndex, rightIndex);

      if (typeof result[0] !== 'string') {
        result.unshift(column[0]);
      }

      return result;
    });

    const yData = computedColumns.filter(
      (column) => types[column[0] as keyof ChartTypes] === 'line'
    );

    const xData = computedColumns.filter(
      (column) => types[column[0] as keyof ChartTypes] !== 'line'
    )[0];

    const [yMin, yMax] = computeBoundaries({ columns: computedColumns, types });
    const yRatio = computeYRatio(VIEW_HEIGHT, yMax, yMin);
    const xRatio = computeXRatio(VIEW_WIDTH, computedColumns[0].length);

    draw.yAxis({
      yMin,
      yMax,
      dpiWidth: DPI_WIDTH,
      viewHeight: VIEW_HEIGHT,
      textPadding: PADDING,
    });

    xAxis(xData, yData, xRatio);

    const mappedChartData = yData.map<Chart>((column) => {
      const columnName = column[0] as keyof ChartNames;
      const color = colors[columnName];

      const coords = column
        // @ts-ignore
        .filter<number>(Number)
        .map((y, i) =>
          toCoords(i, y, {
            xRatio,
            yRatio,
            dpiHeight: DPI_HEIGHT,
            padding: PADDING,
            yMin,
          })
        );

      return {
        coords,
        color,
      };
    });

    mappedChartData.forEach(({ color, coords }) => {
      draw.drawLine(coords, { lineWidth: 4, color });

      for (const [x, y] of coords) {
        if (proxy.mouse.x && isOver(proxy.mouse.x, x, coords.length)) {
          draw.drawCircle([x, y], { color });
        }
      }
    });
  }

  function mousemove({ clientX, clientY }: MouseEvent) {
    const { top, left } = canvas.getBoundingClientRect();

    proxy.mouse = {
      x: (clientX - left) * 2,
      tooltip: {
        top: clientY - top,
        left: clientX - left,
      },
    };
  }

  function mouseleave() {
    proxy.mouse.x = null;
    canvasTooltip.hide();
  }

  function xAxis(
    xData: (string | number)[],
    yData: (string | number)[][],
    xRatio: number
  ) {
    const step = Math.round(xData.length / LABELS_COUNT);

    ctx.beginPath();

    for (let i = 1; i <= xData.length; i++) {
      const xCoord = i * xRatio;

      if ((i - 1) % step === 0) {
        const text = toDate(xData[i] as number);
        ctx.fillText(`${text}`, xCoord, DPI_HEIGHT - 10);
      }

      if (proxy.mouse.x && isOver(proxy.mouse.x, xCoord, xData.length)) {
        ctx.save();
        ctx.moveTo(xCoord, PADDING / 2);
        ctx.lineTo(xCoord, DPI_HEIGHT - PADDING);
        ctx.restore();

        if (proxy.mouse.tooltip.top && proxy.mouse.tooltip.left) {
          const content = yData.map((column) => ({
            color: colors[column[0] as keyof ChartNames],
            name: names[column[0] as keyof ChartNames],
            value: `${column[i + 1]}`,
          }));

          const title = toDate(xData[i] as number);

          canvasTooltip.show(
            {
              top: proxy.mouse.tooltip.top,
              left: proxy.mouse.tooltip.left,
            },
            { title, content }
          );
        }
      }
    }

    ctx.stroke();
    ctx.closePath();
  }

  return {
    init() {
      canvas.addEventListener('mousemove', mousemove);
      canvas.addEventListener('mouseleave', mouseleave);

      paint();
    },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('mouseleave', mouseleave);
    },
  };
}
