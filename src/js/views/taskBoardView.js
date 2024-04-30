import "core-js/stable";

import { makeDraggable, makeDroppable } from "../helpers";

class TaskBoardView {
  _parentEl = document.querySelector(".board");
  _boardHeaderEl = document.querySelector(".board-header");
  _dropmenuEl = this._boardHeaderEl.querySelector(".board-header__dropmenu");
  _dropmenuContentEl = this._dropmenuEl.querySelector(".dropmenu__content");
  _todoCardEl = document.querySelector("#todo");
  _outdatedCardEl = document.querySelector("#outdated");
  _inprogressCardEl = document.querySelector("#inProgress");
  _completedCardEl = document.querySelector("#completed");
  _tasksContainersEl = document.querySelectorAll(".card__tasks-container");
  _data;

  constructor() {
    makeDraggable(this._parentEl);
    this._tasksContainersEl.forEach((container) =>
      makeDroppable(container, this._parentEl)
    );

    this._addHandlerDisplayActions();
  }

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  addHandlerRender(handler) {
    handler();
  }

  addHandlerUpdateTaskStatus(handler) {
    this._parentEl.addEventListener("taskStatusChanged", (e) =>
      handler(e.detail)
    );
  }

  _addHandlerDisplayActions() {
    this._boardHeaderEl.addEventListener("click", (e) => {
      const actionBtn = e.target.closest(".btn");

      if (
        !actionBtn ||
        (!actionBtn.classList.contains("btn--sort") &&
          !actionBtn.classList.contains("btn--filter"))
      )
        return;

      const action = actionBtn.dataset.actionType;

      this._displayActionOptions(action);
    });
  }

  _generateMarkup() {
    const todoMarkup = this._data.todo
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    const inProgressMarkup = this._data.inProgress
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    const completedMarkup = this._data.completed
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    const outdatedMarkup = this._data.outdated
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    this._todoCardMarkup(todoMarkup, this._data.todo.length);
    this._inProgressCardMarkup(inProgressMarkup, this._data.inProgress.length);
    this._completedCardMarkup(completedMarkup, this._data.completed.length);
    this._outdatedCardMarkup(outdatedMarkup, this._data.outdated.length);
  }

  _todoCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._todoCardEl, TasksMarkup, TasksNum);
  }

  _inProgressCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._inprogressCardEl, TasksMarkup, TasksNum);
  }

  _completedCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._completedCardEl, TasksMarkup, TasksNum);
  }

  _outdatedCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._outdatedCardEl, TasksMarkup, TasksNum);
  }

  _generateCardMarkup(cardEl, tasksMarkup, tasksNum) {
    this._updateTasksNumber(cardEl, tasksNum);
    const tasksContainer = cardEl.querySelector(".card__tasks-container");
    tasksContainer.innerHTML = "";
    tasksContainer.insertAdjacentHTML("afterbegin", tasksMarkup);
  }

  _updateTasksNumber(cardEl, tasksNum) {
    cardEl.querySelector(".tasks-number").innerHTML = tasksNum;
  }

  _generateTaskPreviewCardMarkup(task) {
    return `
      <li id="${task.id}" class="task" draggable="true" data-id="${
      task.id
    }" data-status="${task.status}">
        <span class="task__category">${task.category.name}</span>
        <div class="task__details-box">
          <p class="task__title">${task.title}</p>
          <p class="task__description">${task.description}</p>
        </div>
        <div class="task__info">
          <div class="task__priority-box">
            <span class="priority__status priority__status--${
              task.priority
            }"></span>
          </div>

          <div class="task__keywords">
            ${task.keywords
              .map((keyword) => `<span class="task__keyword">${keyword}</span>`)
              .join("")}
          </div>
        </div>
      </li>
    `;
  }

  _displayActionOptions(action) {
    let markup = "";
    if (action == "sort") markup = this._generateSortActionMarkup();
    if (action == "filter") markup = this._generateFilterActionMarkup();

    if (action == this._dropmenuEl.dataset.currentAction) {
    }

    if (this._dropmenuEl.dataset.isOpen == "false") {
      this._dropmenuContentEl.innerHTML = "";
      this._dropmenuContentEl.insertAdjacentHTML("afterbegin", markup);
      this._dropmenuEl.dataset.isOpen = "true";
      this._dropmenuEl.classList.remove("hidden");
    } else {
      this._dropmenuEl.dataset.isOpen = "false";
      this._dropmenuEl.classList.add("hidden");
    }
  }

  _generateSortActionMarkup() {
    return `
      <div class="sort__options">
        <div class="sort__option radio__group">
          <input type="radio" name="sort-dueDate" id="sortDueDateASC" class="radio__input">
          <label for="sortDueDateASC" class="radio__label">
            <span class="radio__btn"></span>
            Due Date: ASC
          </label>
        </div>
        <div class="sort__option radio__group">
          <input type="radio" name="sort-dueDate" id="sortDueDateDESC" class="radio__input">
          <label for="sortDueDateDESC" class="radio__label">
            <span class="radio__btn"></span>
            Due Date: DESC
          </label>
        </div>

        <div class="sort__option radio__group">
          <input type="radio" name="sort-priority" id="sortPriorityDESC" class="radio__input">
          <label for="sortPriorityDESC" class="radio__label">
            <span class="radio__btn"></span>
            Priority: DESC
          </label>
        </div>

        <div class="sort__option radio__group">
          <input type="radio" name="sort-priority" id="sortPriorityASC" class="radio__input">
          <label for="sortPriorityASC" class="radio__label">
            <span class="radio__btn"></span>
            Priority: ASC
          </label>
        </div>
     </div>
    `;
  }
  _generateFilterActionMarkup() {
    return `
      <div class="filter__options">
        <div class="filter__option radio__group">
          <input type="radio" name="filter" id="filterDueDateASC" class="radio__input">
          <label for="filterDueDateASC" class="radio__label">
            <span class="radio__btn"></span>
            Due Date: ASC
          </label>
        </div>
        <div class="filter__option radio__group">
          <input type="radio" name="filter" id="filterDueDateDESC" class="radio__input">
          <label for="filterDueDateDESC" class="radio__label">
            <span class="radio__btn"></span>
            Due Date: DESC
          </label>
        </div>
      </div>
    `;
  }
}

export default new TaskBoardView();
