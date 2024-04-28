import "core-js/stable";

class DisplayTaskView {
  _tasksBoardEl = document.querySelector(".board");
  _parentEl = document.querySelector(".modal__content-body");
  _data;

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  addHandlerRender(handler) {
    this._tasksBoardEl.addEventListener("click", function (e) {
      if (!e.target.closest(".task")) return;
      const taskId = e.target.closest(".task").dataset.id;
      const taskStatus = e.target.closest(".task").dataset.status;
      handler(taskStatus, taskId);
    });
  }

  addHandlerTaskActions(actions) {
    const taskActionsBoxEl = this._parentEl.querySelector(".task__actions");

    taskActionsBoxEl.addEventListener("click", (e) => {
      const targetEl = e.target;

      if (
        !targetEl.classList.contains("btn--delete-action") &&
        !targetEl.classList.contains("btn--delete-canceled") &&
        !targetEl.classList.contains("btn--delete-confirmed")
      )
        return;

      this._deletionHandler(targetEl, taskActionsBoxEl, actions.delete);
    });
  }

  _deletionHandler(btn, actionsBoxEl, action) {
    // Deletion - Display the confirmation message
    if (btn.classList.contains("btn--delete-action")) {
      const confirmtionBoxEl = btn.nextElementSibling;
      btn.classList.add("hidden");
      confirmtionBoxEl.classList.remove("hidden");
    }

    // Deletion - Canceled
    if (btn.classList.contains("btn--delete-canceled")) {
      actionsBoxEl
        .querySelector(".btn--delete-action")
        .classList.remove("hidden");

      actionsBoxEl
        .querySelector(".delete-action__confirmation")
        .classList.add("hidden");
    }

    // Deletion - Confirmed so delete the task
    if (btn.classList.contains("btn--delete-confirmed"))
      action.handler(action.task);
  }

  _generateMarkup() {
    const markup = `
      <div class="task task--opened task--${this._data.priority}" 
          data-id=${this._data.id}>
        <span class="priority__status priority__status--${
          this._data.priority
        }"></span>
        <span class="task__category">${this._data.category.name}</span>

        <h3 class="task__title">${this._data.title}</h3>

        <div class="task--opened__box">
          <label class="task--opened__label">Description</label>
          <p class="task__description">${this._data.description}</p>
        </div>

        <div class="task--opened__box task--opened__box--due-date">
          <label class="task--opened__label">Due Date</label>
          <p class="task__due-date">${new Date(
            this._data.dueDate
          ).toDateString()}</p>
        </div>

        <div class="task--opened__box">
          <label class="task--opened__label">Keywords</label>
          <div class="task__keywords">
            ${this._data.keywords
              .map((k) => `<span class="task__keyword">${k}</span>`)
              .join("")}
          </div>
        </div>
        <div class="task--opened__box task__actions">
          <div class="task__delete-action">
            <button class="btn btn--delete-action">Delete</button>
            <div class="delete-action__confirmation hidden">
                <p>You'll delete this task! Are you sure?</p>
                <button class="btn btn--delete-confirmed">Yes</button>
                <button class="btn btn--delete-canceled">No</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new DisplayTaskView();
