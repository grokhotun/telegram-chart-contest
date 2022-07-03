import {
  DPI_HEIGHT,
  WIDTH,
  HEIGHT,
  DPI_WIDTH,
  SLIDER_HEIGHT,
} from '@/chart/constants';
import { MainChart, SliderChart } from '@/components';
import { Store } from '@/core/Observer';
import { theme } from '@/theme';
import { ChartData, MappedChartData } from '@/types';
import { mapData } from '@/utils';

import { template } from './template';

type Options = {
  root: HTMLElement;
  data: ChartData;
};

export class TelegramChart {
  private root: HTMLElement;
  private data: MappedChartData;
  private chart: HTMLElement;
  private slider: HTMLElement;
  private store: Store;

  constructor({ root, data }: Options) {
    this.root = root;
    this.data = mapData(data);

    this.root.innerHTML = template();
    this.chart = root.querySelector('[data-element="chart"]') as HTMLElement;
    this.slider = root.querySelector('[data-element="slider"]') as HTMLElement;
    this.store = {};
  }

  init() {
    const mainChart = new MainChart({
      store: this.store,
      root: this.chart,
      data: this.data,
      theme: theme.day,
      width: WIDTH,
      height: HEIGHT,
      canvasWidth: DPI_WIDTH,
      canvasHeight: DPI_HEIGHT,
    });

    const sliderChart = new SliderChart({
      store: this.store,
      root: this.slider,
      data: this.data,
      theme: theme.day,
      width: DPI_WIDTH / 2,
      height: SLIDER_HEIGHT,
      canvasWidth: DPI_WIDTH,
      canvasHeight: SLIDER_HEIGHT * 2,
    });

    mainChart.init();
    sliderChart.init();
  }
}
