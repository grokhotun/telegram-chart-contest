import { getChartData } from '@/data';
import {
  ChartData, Options, Names, Types, Chart,
} from '@/types';
import {
  PADDING,
  WIDTH,
  HEIGHT,
  DPI_WIDTH,
  DPI_HEIGHT,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  ROWS_COUNT,
  STEP,
  LABELS_COUNT,
  Y_AXIS_STYLES,
} from '@/constants';
import { toCoords, toDate } from '@/utils';

function drawLine(ctx: CanvasRenderingContext2D, coords: number[][], options: Options) {
  const { color, lineWidth } = options;

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  for (const [x, y] of coords) {
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  ctx.closePath();
}

function computeBoundaries({ columns, types }: Pick<ChartData, 'columns' | 'types'>) {
  const data = columns
    .filter((column) => types[column[0] as keyof Types] === 'line')
    .map((array) => array.filter(Number) as number[])
    .flat();

  const max = Math.max(...data);
  const min = Math.min(...data);

  return [min, max];
}

function yAxis(ctx: CanvasRenderingContext2D, yMin: number, yMax: number) {
  const textStep = (yMax - yMin) / ROWS_COUNT;

  ctx.beginPath();

  ctx.lineWidth = Y_AXIS_STYLES.lineWidth;
  ctx.strokeStyle = Y_AXIS_STYLES.strokeStyle;
  ctx.font = Y_AXIS_STYLES.font;
  ctx.fillStyle = Y_AXIS_STYLES.fillStyle;

  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = STEP * i;
    const text = Math.round(yMax - textStep * i);
    ctx.fillText(`${text}`, 5, y + PADDING - 10);
    ctx.moveTo(0, y + PADDING);
    ctx.lineTo(DPI_WIDTH, y + PADDING);
  }

  ctx.stroke();
  ctx.closePath();
}

function xAxis(ctx: CanvasRenderingContext2D, data: (string | number)[], xRatio: number) {
  const step = Math.round(data.length / LABELS_COUNT);

  ctx.beginPath();

  for (let i = 1; i <= data.length; i += step) {
    const text = toDate(data[i] as number);
    const xCoord = i * xRatio;
    ctx.fillText(`${text}`, xCoord, DPI_HEIGHT - 10);
  }

  ctx.closePath();
}

function chart(canvas: HTMLCanvasElement, { columns, types, colors }: ChartData) {
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  canvas.style.width = `${WIDTH}px`;
  canvas.style.height = `${HEIGHT}px`;
  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;

  // @ts-ignore
  const proxy = new Proxy<{ mouse: { x: number } }>({}, {
    set(...args) {
      const result = Reflect.set(...args);
      // requestAnimationFrame(paint);
      return result;
    },
  });

  function mousemove({ clientX, clientY }: MouseEvent) {
    proxy.mouse = {
      x: clientX,
    };
  }

  canvas.addEventListener('mousemove', mousemove);

  const [yMin, yMax] = computeBoundaries({ columns, types });
  const yRatio = VIEW_HEIGHT / (yMax - yMin);
  const xRatio = VIEW_WIDTH / (columns[0].length - 2);

  const yData = columns
    .filter((column) => types[column[0] as keyof Types] === 'line');

  const xData = columns
    .filter((column) => types[column[0] as keyof Types] !== 'line')[0];

  yAxis(ctx, yMin, yMax);
  xAxis(ctx, xData, xRatio);

  const chartData = yData.map<Chart>((column) => {
    const columnName = column[0] as keyof Names;
    const color = colors[columnName];

    const coords = column
      // @ts-ignore
      .filter<number>(Number)
      .map((y, i) => toCoords(i, y, xRatio, yRatio));

    return {
      coords,
      color,
    };
  });

  chartData.forEach(({ color, coords }) => {
    drawLine(ctx, coords, { lineWidth: 4, color });
  });
}

const canvas = document.getElementById('chart');

chart(canvas as HTMLCanvasElement, getChartData());
