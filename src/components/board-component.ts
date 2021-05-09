import {InsertPosition, Status} from '../constants';
import {renderElement} from '../utils';
import AbstractComponent from './abstract-component';
import ListComponent from './list-component';
import TasksService from "../services/task-service";

export default class BoardComponent extends AbstractComponent {
  constructor(private taskService: TasksService) {
    super();
  }

  getTemplate(): string {
    return (
      `<section class="taskboard">
        <h2 class="visually-hidden">Ваши задачи:</h2>
      </section>`
    );
  }

  afterCreateElement(): void {
    Object.values(Status).forEach((status: string) => {
      const listComponent: ListComponent = new ListComponent(this.taskService, status);
      renderElement(this.getElement, listComponent.getElement, InsertPosition.BEFOREEND);
    });
  }
}
