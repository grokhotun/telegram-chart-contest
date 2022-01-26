import { DPI_HEIGHT, MONTHS, PADDING } from '@/constants';

export function toDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function toCoords(x: number, y: number, xRatio: number, yRatio: number) {
  const xCoord = Math.floor(x * xRatio);
  const yCoord = Math.floor(DPI_HEIGHT - PADDING - y * yRatio);

  return [xCoord, yCoord];
}
