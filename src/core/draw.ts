import { CIRCLE_RADIUS } from '@/chart/constants';
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
}
