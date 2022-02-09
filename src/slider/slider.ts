import { Draw } from '@/core/draw';
import { Chart, ChartData, Names, Types } from '@/types';
import {
  computeBoundaries,
  computeXRatio,
  computeYRatio,
  css,
  toCoords,
} from '@/utils';

import { DPI_HEIGHT, HEIGHT } from './constants';

type Options = {
  dpiWidth: number;
};

type Callback = (position: number[]) => void;

export function chartSlider(
  root: HTMLElement,
  { columns, types, colors }: ChartData,
  { dpiWidth }: Options
) {
  const width = dpiWidth / 2;
  const minWidth = width * 0.05;
  let dispatch: Callback | null = null;

  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const draw = new Draw(ctx);

  canvas.width = dpiWidth;
  canvas.height = DPI_HEIGHT;

  const $left = root.querySelector('[data-element="left"]') as HTMLElement;
  const $window = root.querySelector('[data-element="window"]') as HTMLElement;
  const $right = root.querySelector('[data-element="right"]') as HTMLElement;

  css(canvas, {
    width: `${width}px`,
    height: `${HEIGHT}px`,
  });

  function update() {
    dispatch?.(getPosition());
  }

  function getPosition() {
    const left = parseInt($left.style.width, 10);
    const right = width - parseInt($right.style.width, 10);

    return [(left * 100) / width, (right * 100) / width];
  }

  function mousedown(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const dimensions = {
      left: parseInt($window.style.left, 10),
      right: parseInt($window.style.right, 10),
      width: parseInt($window.style.width, 10),
    };

    const { type } = e.target.dataset;
    const xCoord = e.pageX;
    switch (type) {
      case 'window': {
        document.onmousemove = (event) => {
          const delta = xCoord - event.pageX;
          if (!delta) return;

          const left = dimensions.left - delta;
          const right = width - left - dimensions.width;

          setPosition(left, right);
          update();
        };

        document.onmouseup = () => {
          document.onmousemove = null;
        };

        break;
      }
      case 'left':
      case 'right': {
        document.onmousemove = (event) => {
          const delta = xCoord - event.pageX;
          if (!delta) return;

          if (type === 'left') {
            const left = width - (dimensions.width + delta) - dimensions.right;
            const right = width - (dimensions.width + delta) - left;
            setPosition(left, right);
          } else {
            const right = width - (dimensions.width - delta) - dimensions.left;
            setPosition(dimensions.left, right);
          }

          update();
        };

        document.onmouseup = () => {
          document.onmousemove = null;
        };

        break;
      }

      default:
        break;
    }
  }

  function setPosition(left: number, right: number) {
    const computedWidth = width - right - left;

    if (computedWidth < minWidth) {
      css($window, {
        width: `${minWidth}px`,
      });
      return;
    }

    if (left < 0) {
      css($window, {
        left: '0px',
      });
      css($left, {
        width: '0px',
      });
      return;
    }

    if (right < 0) {
      css($window, {
        right: '0px',
      });
      css($right, {
        width: '0px',
      });
      return;
    }

    css($window, {
      width: `${computedWidth}px`,
      left: `${left}px`,
      right: `${right}px`,
    });

    css($left, {
      width: `${left}px`,
    });

    css($right, {
      width: `${right}px`,
    });
  }

  root.addEventListener('mousedown', mousedown);

  const defaultWidth = width * 0.3;
  setPosition(0, defaultWidth);

  const yData = columns.filter(
    (column) => types[column[0] as keyof Types] === 'line'
  );

  const [yMin, yMax] = computeBoundaries({ columns, types });
  const yRatio = computeYRatio(DPI_HEIGHT, yMax, yMin);
  const xRatio = computeXRatio(dpiWidth, columns[0].length);

  const mappedChartData = yData.map<Chart>((column) => {
    const columnName = column[0] as keyof Names;
    const color = colors[columnName];

    const coords = column
      // @ts-ignore
      .filter<number>(Number)
      .map((y, i) =>
        toCoords(i, y, {
          xRatio,
          yRatio,
          dpiHeight: DPI_HEIGHT,
          padding: -5,
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
  });

  return {
    subscribe(fn: Callback) {
      dispatch = fn;
      fn(getPosition());
    },
  };
}
