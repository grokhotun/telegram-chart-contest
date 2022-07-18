import { BaseChart } from '@/components/BaseChart';
import { computeBoundaries } from '@/components/MainChart/helpers';

import { Options } from '@/components/types';
import { Theme } from '@/theme';
import { computeXRatio, computeYRatio, css, toCoords } from '@/utils';

export class SliderChart extends BaseChart {
  readonly window: HTMLElement;
  readonly leftSliderPart: HTMLElement;
  readonly rightSliderPart: HTMLElement;
  readonly leftHandle: HTMLElement;
  readonly rightHandle: HTMLElement;

  constructor(options: Options) {
    super(options);

    this.window = options.root.querySelector(
      '[data-element="window"]'
    ) as HTMLElement;

    this.leftSliderPart = options.root.querySelector(
      '[data-element="left"]'
    ) as HTMLElement;
    this.rightSliderPart = options.root.querySelector(
      '[data-element="right"]'
    ) as HTMLElement;

    this.leftHandle = this.leftSliderPart.querySelector(
      '[data-element="handle"]'
    ) as HTMLElement;
    this.rightHandle = this.rightSliderPart.querySelector(
      '[data-element="handle"]'
    ) as HTMLElement;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.setPositions = this.setPositions.bind(this);
    this.render = this.render.bind(this);
    this.init = this.init.bind(this);
  }

  private broadcast() {
    this.observer.dispatch('slider', this.getPosition());
  }

  private getPosition() {
    const left = parseInt(this.leftSliderPart.style.width, 10);
    const right = this.width - parseInt(this.rightSliderPart.style.width, 10);

    return [(left * 100) / this.width, (right * 100) / this.width];
  }

  private handleMouseDown(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const dimensions = {
      left: parseInt(this.window.style.left, 10),
      right: parseInt(this.window.style.right, 10),
      width: parseInt(this.window.style.width, 10),
    };

    const { type } = e.target.dataset;
    const xCoord = e.pageX;

    switch (type) {
      case 'window': {
        document.onmousemove = (event) => {
          const delta = xCoord - event.pageX;
          if (!delta) return;

          const left = dimensions.left - delta;
          const right = this.width - left - dimensions.width;

          this.setPositions(left, right);
          this.broadcast();
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
            const left =
              this.width - (dimensions.width + delta) - dimensions.right;
            const right = this.width - (dimensions.width + delta) - left;
            this.setPositions(left, right);
          } else {
            const right =
              this.width - (dimensions.width - delta) - dimensions.left;
            this.setPositions(dimensions.left, right);
          }

          this.broadcast();
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

  private setPositions(left: number, right: number) {
    const computedWidth = this.width - right - left;
    const minWidth = this.canvasWidth * 0.03;

    if (computedWidth < minWidth) {
      css(this.window, {
        width: `${minWidth}px`,
      });
      return;
    }

    if (left < 0) {
      css(this.window, {
        left: '0px',
      });
      css(this.leftSliderPart, {
        width: '0px',
      });
      return;
    }

    if (right < 0) {
      css(this.window, {
        right: '0px',
      });
      css(this.rightSliderPart, {
        width: '0px',
      });
      return;
    }

    css(this.window, {
      width: `${computedWidth}px`,
      left: `${left}px`,
      right: `${right}px`,
    });

    css(this.leftSliderPart, {
      width: `${left}px`,
    });

    css(this.rightSliderPart, {
      width: `${right}px`,
    });
  }

  update(activeCharts: string[]) {}

  render() {
    const [yMin, yMax] = computeBoundaries(this.data.yAxis);
    const yRatio = computeYRatio(this.canvasHeight, yMax, yMin);
    const xRatio = computeXRatio(
      this.canvasWidth,
      this.data.xAxis.coords.length
    );

    this.data.yAxis
      .map(({ color, coords: initialCoords }) => {
        const coords = initialCoords.map((y, i) =>
          toCoords(i, y, {
            xRatio,
            yRatio,
            dpiHeight: this.canvasHeight,
            padding: -5,
            yMin,
          })
        );

        return {
          color,
          coords,
        };
      })
      .forEach(({ color, coords }) => {
        this.draw.drawLine(coords, { color });
      });
  }

  setTheme(theme: Theme) {
    css(this.window, {
      borderColor: theme.sliderHandle,
    });
    css(this.leftSliderPart, {
      background: theme.sliderBackground,
    });
    css(this.rightSliderPart, {
      background: theme.sliderBackground,
    });
    css(this.leftHandle, {
      background: theme.sliderHandle,
    });
    css(this.rightHandle, {
      background: theme.sliderHandle,
    });
  }

  init() {
    this.setPositions(0, this.width * 0.3);
    this.broadcast();

    this.render();
    this.root.addEventListener('mousedown', this.handleMouseDown);
  }

  destroy() {
    this.root.removeEventListener('mousedown', this.handleMouseDown);
  }
}
