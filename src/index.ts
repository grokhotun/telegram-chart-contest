import { getChartData } from '@/data';
import { ChartData } from '@/types';

const PADDING = 40;
const WIDTH = 600;
const HEIGHT = 200;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
const VIEW_WIDTH = DPI_WIDTH;
const ROWS_COUNT = 5;
const STEP = VIEW_HEIGHT / ROWS_COUNT;

type Options = {
  color: string
  lineWidth: number
}

const line = (ctx: CanvasRenderingContext2D, coords: number[][], options: Options) => {
  const { color, lineWidth } = options;

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  for (const [x, y] of coords) {
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.closePath();
};

const computeBoundaries = ({ columns, types }: Pick<ChartData, 'columns' | 'types'>) => {
  const data = columns
    // @ts-ignore
    .filter((column) => types[column[0]] === 'line')
    .map((array) => array.filter(Number) as number[])
    .flat();

  const max = Math.max(...data);
  const min = Math.min(...data);

  return [min, max];
};

const chart = (canvas: HTMLCanvasElement, { columns, types, colors }: ChartData) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  canvas.style.width = `${WIDTH}px`;
  canvas.style.height = `${HEIGHT}px`;
  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;

  const [yMin, yMax] = computeBoundaries({ columns, types });
  const yRatio = VIEW_HEIGHT / (yMax - yMin);
  const xRatio = VIEW_WIDTH / (columns[0].length - 2);

  const textStep = (yMax - yMin) / ROWS_COUNT;

  columns.forEach((column) => {
    const columnName = column[0] as string;

    // @ts-ignore
    if (types[columnName] === 'line') {
      const coords = column.map((y, i) => {
        const xCoord = i;
        const yCoord = y as number;
        return [
          Math.floor((xCoord - 1) * xRatio),
          Math.floor(DPI_HEIGHT - PADDING - yCoord * yRatio),
        ];
      }).filter((_, i) => i !== 0);

      // @ts-ignore
      const color = colors[columnName] as string;

      line(ctx, coords, { lineWidth: 4, color });
    }
  });

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#bbb';
  ctx.font = 'normal 20px Helvetica,sans-serif';
  ctx.fillStyle = '#96a2aa';
  for (let i = 1; i <= ROWS_COUNT; i++) {
    const y = STEP * i;
    const text = Math.round(yMax - textStep * i);
    ctx.fillText(`${text}`, 5, y + PADDING - 10);
    ctx.moveTo(0, y + PADDING);
    ctx.lineTo(DPI_WIDTH, y + PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};

const canvas = document.getElementById('chart');

chart(canvas as HTMLCanvasElement, getChartData());
