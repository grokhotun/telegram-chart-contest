import { getChartData } from '@/data';
import {
  ChartData, Options, Names, Types, Chart, MouseProxy,
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
  CIRCLE_RADIUS,
} from '@/constants';
import { toCoords, toDate } from '@/utils';

const telegramChart = chart(document.getElementById('chart') as HTMLCanvasElement, getChartData());

telegramChart.init();

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

function drawCircle(ctx: CanvasRenderingContext2D, [x, y]: [number, number], color: string) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = '#fff';
  ctx.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
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

function xAxis(ctx: CanvasRenderingContext2D, data: (string | number)[], xRatio: number, { mouse }: MouseProxy) {
  const step = Math.round(data.length / LABELS_COUNT);

  ctx.beginPath();

  for (let i = 1; i <= data.length; i++) {
    const xCoord = i * xRatio;

    if ((i - 1) % step === 0) {
      const text = toDate(data[i] as number);
      ctx.fillText(`${text}`, xCoord, DPI_HEIGHT - 10);
    }

    if (mouse.x && isOver(mouse.x, xCoord, data.length)) {
      ctx.save();
      ctx.moveTo(xCoord, PADDING / 2);
      ctx.lineTo(xCoord, DPI_HEIGHT - PADDING);
      ctx.restore();
    }
  }

  ctx.stroke();
  ctx.closePath();
}

function chart(canvas: HTMLCanvasElement, { columns, types, colors }: ChartData): {
  init: () => void,
  destroy: () => void
} {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  let raf: number;
  canvas.style.width = `${WIDTH}px`;
  canvas.style.height = `${HEIGHT}px`;
  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;

  const proxy = new Proxy<MouseProxy>({
    mouse: {
      x: null,
    },
  }, {
    set(...args) {
      const result = Reflect.set(...args);
      raf = requestAnimationFrame(paint);
      return result;
    },
  });

  function clear() {
    (ctx).clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
  }

  function paint() {
    clear();

    const [yMin, yMax] = computeBoundaries({ columns, types });
    const yRatio = VIEW_HEIGHT / (yMax - yMin);
    const xRatio = VIEW_WIDTH / (columns[0].length - 2);

    const yData = columns
      .filter((column) => types[column[0] as keyof Types] === 'line');

    const xData = columns
      .filter((column) => types[column[0] as keyof Types] !== 'line')[0];

    yAxis(ctx, yMin, yMax);
    xAxis(ctx, xData, xRatio, proxy);

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

      for (const [x, y] of coords) {
        if (proxy.mouse.x && isOver(proxy.mouse.x, x, coords.length)) {
          drawCircle(ctx, [x, y], color);
        }
      }
    });
  }

  function mousemove({ clientX, clientY }: MouseEvent) {
    const { left } = canvas.getBoundingClientRect();

    proxy.mouse = {
      x: (clientX - left) * 2,
    };
  }

  function mouseleave() {
    proxy.mouse.x = null;
  }

  canvas.addEventListener('mousemove', mousemove);
  canvas.addEventListener('mouseleave', mouseleave);

  return {
    init() {
      paint();
    },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('mouseleave', mouseleave);
    },
  };
}

function isOver(mouseX: number, x: number, length: number) {
  const width = DPI_WIDTH / length;
  return Math.abs(x - mouseX) < width / 2;
}
