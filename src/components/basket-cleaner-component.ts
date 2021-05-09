import {StateActions, Status} from '../constants';
import AbstractComponent from './abstract-component';
import TasksService from "../services/task-service";

export default class BasketCleanerComponent extends AbstractComponent {
  constructor(private taskService: TasksService) {
    super();
  }

  getTemplate(): string {
    return (
      `<button class="taskboard__button button button--clear" type="button">
        <svg fill="none" height="22" viewBox="0 0 22 22" width="22" xmlns="http://www.w3.org/2000/svg">
            <rect fill="white" height="14.6667" transform="rotate(45 15.5374 5.16638)" width="1.83333" x="15.5374" y="5.16638"/>
            <rect fill="white" height="14.6667" transform="rotate(135 16.8337 15.5372)" width="1.83333" x="16.8337" y="15.5372"/>
        </svg>
        <span>Очистить</span>
      </button>`
    );
  }

  afterCreateElement(): void {
    this.getElement.addEventListener(`click`, this.cleanBasketHandler.bind(this));
    window.addEventListener(StateActions.TASK_UPDATE_POSITION, this.changeDataHandler.bind(this));
  }

  private cleanBasketHandler(): void {
    this.taskService.cleanupBasket();
    this.toggleDisabled(true);
  }

  private changeDataHandler(): void {
    const isDisabled = this.taskService.getByStatus(Status.BASKET).length === 0;
    this.toggleDisabled(isDisabled);
  }

  private toggleDisabled(isDisabled: boolean): void {
    this.getElement.toggleAttribute(`disabled`, isDisabled);
  }
}
