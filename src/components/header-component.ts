import AbstractComponent from './abstract-component';

export default class HeaderComponent extends AbstractComponent {
  constructor(private name: string) {
    super();
  }

  getTemplate(): string {
    return (
      `<header class="board-app__header">
        <div class="board-app__inner">
          <h1>${this.name}</h1>
        </div>
      </header>`
    );
  }
}
