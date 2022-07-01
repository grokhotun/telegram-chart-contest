import { ChartData } from '@/types';
import {
  WIDTH,
  HEIGHT,
  DPI_WIDTH,
  DPI_HEIGHT,
  SLIDER_HEIGHT,
} from '@/chart/constants';
import { mapData } from '@/utils';
import { MainChart } from '@/components';
import { SliderChart } from '@/components/SliderChart';

export function newChart(
  root: HTMLElement,
  chartData: ChartData
): {
  init: () => void;
  destroy: () => void;
} {
  const slideRoot = root.querySelector(
    '[data-element="slider"]'
  ) as HTMLElement;

  const data = mapData(chartData);
  const store = {};

  const mainChart = new MainChart({
    store,
    root,
    data,
    width: WIDTH,
    height: HEIGHT,
    canvasWidth: DPI_WIDTH,
    canvasHeight: DPI_HEIGHT,
  });

  const sliderChart = new SliderChart({
    store,
    root: slideRoot,
    data,
    width: DPI_WIDTH / 2,
    height: SLIDER_HEIGHT,
    canvasWidth: DPI_WIDTH,
    canvasHeight: SLIDER_HEIGHT * 2,
  });

  return {
    init() {
      mainChart.init();
      sliderChart.init();
    },
    destroy() {},
  };
}
