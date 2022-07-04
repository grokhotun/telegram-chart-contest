export function template() {
  return `
    <div class="telegram-chart" data-element="chart">
      <div data-element="tooltip" class="telegram-chart-tooltip"></div>
      <canvas></canvas>
      <div class="telegram-chart-slider" data-element="slider">
        <canvas></canvas>
        <div data-element="left" class="telegram-chart-slider__left">
          <div class="telegram-chart-slider__handle--left" data-element="handle" data-type="left"></div>
        </div>
        <div data-element="window" data-type="window" class="telegram-chart-slider__window"></div>
        <div data-element="right" class="telegram-chart-slider__right">
          <div class="telegram-chart-slider__handle--right" data-element="handle" data-type="right"></div>
        </div>
      </div>
      <div class="telegram-chart-labels" data-element="labels"></div>
    </div>
  `;
}
