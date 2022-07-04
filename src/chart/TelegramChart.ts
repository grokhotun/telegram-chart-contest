import {
  DPI_HEIGHT,
  WIDTH,
  HEIGHT,
  DPI_WIDTH,
  SLIDER_HEIGHT,
} from '@/chart/constants';
import { MainChart, SliderChart } from '@/components';
import { Label } from '@/components/Label';
import { Store } from '@/core/Observer';
import { Theme, theme as constantTheme, ThemeKeys } from '@/theme';
import { ChartData, MappedChartData } from '@/types';
import { mapData } from '@/utils';

import { template } from './template';

type Options = {
  root: HTMLElement;
  data: ChartData;
  theme?: Theme;
};

export class TelegramChart {
  private root: HTMLElement;
  private data: MappedChartData;
  private chart: HTMLElement;
  private slider: HTMLElement;
  private labels: HTMLElement;

  private mainChart: MainChart | null = null;
  private sliderChart: SliderChart | null = null;

  private store: Store;
  private activeChart: string[];
  private theme: Theme;

  constructor({ root, data, theme = constantTheme.light }: Options) {
    this.root = root;
    this.data = mapData(data);
    this.theme = theme;

    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.initChart = this.initChart.bind(this);
    this.initLabels = this.initLabels.bind(this);

    this.root.innerHTML = template();
    this.chart = root.querySelector('[data-element="chart"]') as HTMLElement;
    this.slider = root.querySelector('[data-element="slider"]') as HTMLElement;
    this.labels = root.querySelector('[data-element="labels"]') as HTMLElement;

    this.store = {};
    this.activeChart = this.data.yAxis.map(({ name }) => name);
  }

  setTheme(themeKey: ThemeKeys) {
    this.theme = constantTheme[themeKey];
  }

  private handleMouseClick(e: MouseEvent) {
    if (!(e.target instanceof HTMLInputElement)) return;

    const name = e.target.value;

    if (e.target.checked) {
      this.activeChart.push(name);
    } else {
      this.activeChart = this.activeChart.filter((v) => v !== name);
    }

    this.mainChart?.update(this.activeChart);
    this.sliderChart?.update(this.activeChart);
  }

  private initChart() {
    this.mainChart = new MainChart({
      store: this.store,
      root: this.chart,
      data: this.data,
      theme: this.theme,
      width: WIDTH,
      height: HEIGHT,
      canvasWidth: DPI_WIDTH,
      canvasHeight: DPI_HEIGHT,
    });

    this.sliderChart = new SliderChart({
      store: this.store,
      root: this.slider,
      data: this.data,
      theme: this.theme,
      width: DPI_WIDTH / 2,
      height: SLIDER_HEIGHT,
      canvasWidth: DPI_WIDTH,
      canvasHeight: SLIDER_HEIGHT * 2,
    });

    this.mainChart.init();
    this.sliderChart.init();
  }

  private initLabels() {
    this.labels.innerHTML = this.data.yAxis
      .map(({ name, color }) => new Label(name, color).render())
      .join('');

    this.labels.addEventListener('click', this.handleMouseClick);
  }

  init() {
    this.initChart();
    this.initLabels();
  }
}
