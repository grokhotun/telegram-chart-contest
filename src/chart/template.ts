export function template() {
  return `
    <div class="telegram-chart" data-element="chart">
      <div data-element="tooltip" class="telegram-chart-tooltip"></div>
      <canvas></canvas>
      <div class="telegram-chart-slider" data-element="slider">
        <canvas></canvas>
        <div data-element="left" class="telegram-chart-slider__left">
          <div class="telegram-chart-slider__arrow--left" data-element="arrow" data-type="left"></div>
        </div>
        <div data-element="window" data-type="window" class="telegram-chart-slider__window"></div>
        <div data-element="right" class="telegram-chart-slider__right">
          <div class="telegram-chart-slider__arrow--right" data-element="arrow" data-type="right"></div>
        </div>
      </div>
    </div>
  `;
}
