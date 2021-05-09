import {InsertPosition, Text} from '../constants';
import {renderElement} from '../utils';
import AbstractComponent from './abstract-component';
import FormComponent from './form-component';
import TasksService from "../services/task-service";

export default class AddTaskComponent extends AbstractComponent {
  private formComponent: FormComponent;

  constructor(private taskService: TasksService) {
    super();
  }

  getTemplate(): string {
    return (
      `<section class="add-task">
        <h2 class="visually-hidden">${Text.NEW_TASK}</h2>
      </section>`
    );
  }

  afterCreateElement(): void {
    this.formComponent = new FormComponent(this.taskService, Text.NEW_TASK);

    renderElement(this.getElement, this.formComponent.getElement, InsertPosition.BEFOREEND);
  }
}
