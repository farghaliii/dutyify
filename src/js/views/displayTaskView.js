import "core-js/stable";

class DisplayTaskView {
  _parentEl = document.querySelector(".modal__content-body");
  _data;

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  _generateMarkup() {
    const markup = `
      <div class="task task--opened task--${this._data.priority}" data-id=${
      this._data.id
    }>
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
          <p class="task__due-date">${this._data.dueDate}</p>
        </div>

        <div class="task--opened__box">
          <label class="task--opened__label">Keywords</label>
          <div class="task__keywords">
            ${this._data.keywords
              .map((k) => `<span class="task__keyword">${k}</span>`)
              .join("")}
          </div>
        </div>
      </div>
    `;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new DisplayTaskView();
