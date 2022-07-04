import { DPI_WIDTH, Months } from '@/chart/constants';
import {
  ChartData,
  Column,
  MappedChartData,
  ChartTypes,
  ChartNames,
  ChartColors,
} from '@/types';

export function toDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${Months[date.getMonth()]} ${date.getDate()}`;
}

export function toCoords(
  x: number,
  y: number,
  {
    xRatio,
    yRatio,
    dpiHeight,
    padding,
    yMin,
  }: {
    dpiHeight: number;
    padding: number;
    xRatio: number;
    yRatio: number;
    yMin: number;
  }
) {
  const xCoord = Math.floor(x * xRatio);
  const yCoord = Math.floor(dpiHeight - padding - (y - yMin) / yRatio);

  return [xCoord, yCoord];
}

export function isOver(mouseX: number, x: number, length: number) {
  const width = DPI_WIDTH / length;
  return Math.abs(x - mouseX) < width / 2;
}

export function isEven(v: number, divider = 2) {
  return v % divider === 0;
}

export function css(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) {
  Object.assign(element.style, styles);
}

export function computeXRatio(width: number, length: number) {
  return width / (length - 1);
}

export function computeYRatio(height: number, max: number, min: number) {
  return (max - min) / height;
}

function isNumber(v: number | string): v is number {
  return typeof v === 'number';
}

export function mapData({
  columns,
  colors,
  types,
  names,
}: ChartData): MappedChartData {
  const xData = columns
    .filter((column) => types[column[0] as keyof ChartTypes] !== 'line')
    .flat();

  const yAxis = columns
    .filter((column) => types[column[0] as keyof ChartTypes] === 'line')
    .map<Column>((column) => ({
      type: types[column[0] as keyof ChartTypes],
      name: names[column[0] as keyof ChartNames],
      color: colors[column[0] as keyof ChartColors],
      coords: column.filter<number>(isNumber),
    }));

  return {
    xAxis: {
      type: types[xData[0] as keyof ChartTypes],
      coords: xData.filter<number>(isNumber),
    },
    yAxis,
  };
}
