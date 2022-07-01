import { CIRCLE_RADIUS, ROWS_COUNT, Y_AXIS_STYLES } from '@/chart/constants';
import { Options } from '@/types';

export class Draw {
  private readonly context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  drawLine(coords: number[][], options: Options) {
    const { color, lineWidth } = options;

    this.context.beginPath();
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = color;

    for (const [x, y] of coords) {
      this.context.lineTo(x, y);
    }

    this.context.stroke();
    this.context.closePath();
  }

  drawCircle([x, y]: number[], options: Pick<Options, 'color'>) {
    const { color } = options;

    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.fillStyle = '#fff';
    this.context.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }

  yAxis({
    yMin,
    yMax,
    dpiWidth,
    viewHeight,
    textPadding,
    rowsCount = ROWS_COUNT,
  }: {
    yMin: number;
    yMax: number;
    dpiWidth: number;
    viewHeight: number;
    textPadding: number;
    rowsCount?: number;
  }) {
    const textStep = (yMax - yMin) / rowsCount;

    this.context.beginPath();

    this.context.lineWidth = Y_AXIS_STYLES.lineWidth;
    this.context.strokeStyle = Y_AXIS_STYLES.strokeStyle;
    this.context.font = Y_AXIS_STYLES.font;
    this.context.fillStyle = Y_AXIS_STYLES.fillStyle;

    for (let i = 1; i <= rowsCount; i++) {
      const y = (viewHeight / rowsCount) * i;
      const text = Math.round(yMax - textStep * i);

      this.context.fillText(`${text}`, 5, y + textPadding - 10);
      this.context.moveTo(0, y + textPadding);
      this.context.lineTo(dpiWidth, y + textPadding);
    }

    this.context.stroke();
    this.context.closePath();
  }
}
