import { Chart, ChartData, Names, Types } from '@/types';
import { computeBoundaries, css, drawLine, toCoords } from '@/utils';

import { DPI_HEIGHT, HEIGHT } from './constants';

type Options = {
  dpiWidth: number;
};

export function chartSlider(
  root: HTMLElement,
  { columns, types, colors }: ChartData,
  { dpiWidth }: Options
) {
  const width = dpiWidth / 2;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = dpiWidth;
  canvas.height = DPI_HEIGHT;

  css(canvas, {
    width: `${width}px`,
    height: `${HEIGHT}px`,
  });

  const yData = columns.filter(
    (column) => types[column[0] as keyof Types] === 'line'
  );

  const [yMin, yMax] = computeBoundaries({ columns, types });
  const yRatio = DPI_HEIGHT / (yMax - yMin);
  const xRatio = dpiWidth / (columns[0].length - 2);

  const mappedChartData = yData.map<Chart>((column) => {
    const columnName = column[0] as keyof Names;
    const color = colors[columnName];

    const coords = column
      // @ts-ignore
      .filter<number>(Number)
      .map((y, i) =>
        toCoords(i, y, { xRatio, yRatio, dpiHeight: DPI_HEIGHT, padding: -5 })
      );

    return {
      coords,
      color,
    };
  });

  mappedChartData.forEach(({ color, coords }) => {
    drawLine(ctx, coords, { lineWidth: 4, color });
  });
}
