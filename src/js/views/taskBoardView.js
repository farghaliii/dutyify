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

  addHandlerActions(handler) {
    this._boardHeaderEl.addEventListener("click", (e) => {
      const actionBtn = e.target.closest(".btn");
      const radioInput = e.target.closest("input");

      if (
        (!actionBtn && !radioInput) ||
        actionBtn.classList.contains("btn--add")
      )
        return;

      // For displaying action's aptions
      if (actionBtn && !radioInput)
        this._displayActionOptions(actionBtn.dataset.actionName);

      // For applying the action [sorting | filtering ..etc]
      if (!actionBtn && radioInput)
        handler({
          name: radioInput.dataset.actionName,
          field: radioInput.dataset.actionField,
          value: radioInput.value,
        });
    });
  }

  uncheckActionBtn(action) {
    this._dropmenuContentEl.querySelector(
      `[data-action-field='${action.field}'][value='${action.value}']`
    ).checked = false;
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

    // If user clicked on the same action button that mean show/hide these action's options
    if (action == this._dropmenuEl.dataset.currentAction) {
      this._dropmenuEl.classList.toggle("hidden");
      return;
    }

    // If user clicked on different action button that means generate that action's markup and display it

    // Generate the markup according to the action
    if (action == "sort") markup = this._generateSortActionMarkup();
    if (action == "filter") markup = this._generateFilterActionMarkup();

    // Displaying it.
    this._dropmenuContentEl.innerHTML = "";
    this._dropmenuContentEl.insertAdjacentHTML("afterbegin", markup);
    this._dropmenuEl.dataset.currentAction = action;
    this._dropmenuEl.classList.remove("hidden");
  }

  _generateSortActionMarkup() {
    return `
      <!-- Due Date -->
      <div class="sort__options">
        <div class="sort__option radio__group">
          <input type="radio" data-action-name="sort" data-action-field="dueDate" name="sort-dueDate" id="sortDueDateASC" value="asc" class="radio__input">
          <label for="sortDueDateASC" class="radio__label">
            <span class="radio__btn"></span>
            Date - Earliest First
          </label>
        </div>
        <div class="sort__option radio__group">
          <input type="radio" data-action-name="sort" data-action-field="dueDate" name="sort-dueDate" id="sortDueDateDESC" value="desc" class="radio__input">
          <label for="sortDueDateDESC" class="radio__label">
            <span class="radio__btn"></span>
            Date - Latest First
          </label>
        </div>

        <!-- Priority -->
        <div class="sort__option radio__group">
          <input type="radio" data-action-name="sort" data-action-field="priority" name="sort-priority" id="sortPriorityDESC" value="desc" class="radio__input">
          <label for="sortPriorityDESC" class="radio__label">
            <span class="radio__btn"></span>
            Priority - High to Low
          </label>
        </div>

        <div class="sort__option radio__group">
          <input type="radio" data-action-name="sort" data-action-field="priority" name="sort-priority" id="sortPriorityASC" value="asc" class="radio__input">
          <label for="sortPriorityASC" class="radio__label">
            <span class="radio__btn"></span>
            Priority - Low to High
          </label>
        </div>

        <!-- Title -->
        <div class="sort__option radio__group">
          <input type="radio" data-action-name="sort" data-action-field="title" name="sort-title" id="sortTitleDESC" value="desc" class="radio__input">
          <label for="sortTitleDESC" class="radio__label">
            <span class="radio__btn"></span>
            Title - Z to A
          </label>
        </div>

        <div class="sort__option radio__group">
          <input type="radio" data-action-name="sort" data-action-field="title" name="sort-title" id="sortTitleASC" value="asc" class="radio__input">
          <label for="sortTitleASC" class="radio__label">
            <span class="radio__btn"></span>
            Title - A to Z
          </label>
        </div>
     </div>
    `;
  }
  _generateFilterActionMarkup() {
    return `
      <div class="filter__options">
        <div class="filter__option radio__group">
          <input type="radio" name="filter" id="filterDueDateASC" value="asc" class="radio__input">
          <label for="filterDueDateASC" class="radio__label">
            <span class="radio__btn"></span>
            Due Date: ASC
          </label>
        </div>
        <div class="filter__option radio__group">
          <input type="radio" name="filter" id="filterDueDateDESC" value="desc" class="radio__input">
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
