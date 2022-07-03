export class Label {
  color: string;
  name: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
  }

  render() {
    return `
      <div class="telegram-chart-checkbox">
        <input type="checkbox" value="${this.name}" checked />
        <label>
          <span style="border-color: ${this.color}"></span>
          ${this.name}
        </label>
      </div>
    `;
  }
}
