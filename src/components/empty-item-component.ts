import AbstractComponent from './abstract-component';

export default class EmptyItemComponent extends AbstractComponent {
  constructor(
    private title: string,
    private taskStatus: string,
    private status: string) {
    super();
  }

  getTemplate(): string {
    return (
      `<div class="taskboard__item task task--${this.taskStatus} task--${this.status}">
        <p>${this.title}</p>
      </div>`
    );
  }
}
