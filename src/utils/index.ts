import { CIRCLE_RADIUS, DPI_WIDTH, MONTHS } from '@/chart/constants';
import { ChartData, Options, Types } from '@/types';

export function toDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function toCoords(
  x: number,
  y: number,
  {
    xRatio,
    yRatio,
    dpiHeight,
    padding,
  }: { dpiHeight: number; padding: number; xRatio: number; yRatio: number }
) {
  const xCoord = Math.floor(x * xRatio);
  const yCoord = Math.floor(dpiHeight - padding - y * yRatio);

  return [xCoord, yCoord];
}

export function isOver(mouseX: number, x: number, length: number) {
  const width = DPI_WIDTH / length;
  return Math.abs(x - mouseX) < width / 2;
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  coords: number[][],
  options: Options
) {
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

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  [x, y]: [number, number],
  color: string
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = '#fff';
  ctx.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

export function computeBoundaries({
  columns,
  types,
}: Pick<ChartData, 'columns' | 'types'>) {
  const data = columns
    .filter((column) => types[column[0] as keyof Types] === 'line')
    .map((array) => array.filter(Number) as number[])
    .flat();

  const max = Math.max(...data);
  const min = Math.min(...data);

  return [min, max];
}

export function css(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) {
  Object.assign(element.style, styles);
}
