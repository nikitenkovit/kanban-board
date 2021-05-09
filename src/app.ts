import AddTaskComponent from './components/add-task-component';
import BoardComponent from './components/board-component';
import HeaderComponent from './components/header-component';
import {InsertPosition} from './constants';
import {tasks} from './data';
import TasksService from './services/task-service';
import {renderElement} from './utils';

export default class App {
  private taskService: TasksService;

  constructor() {
    this.taskService = new TasksService(tasks);
  }

  init(name: string): void {
    const headerComponent = new HeaderComponent(name);
    const headerElement = headerComponent.getElement;
    const bodyElement = document.querySelector(`body.board-app`);

    renderElement(bodyElement, headerElement, InsertPosition.AFTERBEGIN);

    const addTaskComponent = new AddTaskComponent(this.taskService);
    const addTaskElement = addTaskComponent.getElement;

    const boardAppInnerElement = document.querySelector(`main > div.board-app__inner`);

    const boardComponent = new BoardComponent(this.taskService);
    const boardElement = boardComponent.getElement;

    renderElement(boardAppInnerElement, addTaskElement, InsertPosition.AFTERBEGIN);
    renderElement(boardAppInnerElement, boardElement, InsertPosition.BEFOREEND);
  }
}
