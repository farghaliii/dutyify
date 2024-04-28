import "core-js/stable";
import { formDataExtraction } from "../helpers";

class EditTaskView {
  _parentEl = document.querySelector(".modal__content-body");
  _btnEditTaskEl = document.querySelector(".btn--edit");
  _data;

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  clear() {
    this._parentEl.querySelector(".form--editing").reset();
  }

  addHandlerRender(handler) {
    this._btnEditTaskEl.addEventListener("click", handler);
  }

  addHandlerSubmit(handler) {
    document.querySelector(".form--editing").addEventListener("submit", (e) => {
      e.preventDefault();
      handler(formDataExtraction(e.target));
    });
  }

  _generateMarkup() {
    const todayDate = new Date().toISOString().split("T")[0];
    const markup = `
      <form class="form form--editing">
        <input type="hidden" name="id" value="${this._data.task.id}" />
        <input type="hidden" name="oldStatus" value="${
          this._data.task.status
        }" />

        <div class="form__first-box">
          <div class="form__group form__group--full-col">
            <label for="title">Title</label>
            <input type="text" name="title" value="${
              this._data.task.title
            }" id="title" minlength="4" placeholder="Task's title..." required>
            <span class="feedback-message">Must be more than<span class="highlighted">4 characters</span>.</span>
          </div>

          <div class="form__group form__group--full-col">
            <label for="description">Description</label>
            <textarea name="description" id="description" minlength="8" cols="30" rows="10" value="${
              this._data.task.description
            }"
              placeholder="Task's description..." required>${
                this._data.task.description
              }</textarea>
            <span class="feedback-message">Must be more than<span class="highlighted">10 characters</span></span>
          </div>
        </div>

        <div class="form__second-box">
          <div class="form__group">
            <label for="keywords">Keywords</label>
            <input type="text" name="keywords" value="${this._data.task.keywords.join(
              ","
            )}" id="keywords" placeholder="keywords Separated by comma ','">
            <span class="feedback-message">Optional! Maximum<span class="highlighted">3 keywords</span>.</span>
          </div>

          <div class="form__group">
            <label for="category">Category / Project</label>
            <select name="category" id="category">
              ${this._data.categories
                .map(
                  (cat) =>
                    `<option value="${cat.id}" ${
                      this._data.task.category.id == cat.id ? "selected" : ""
                    }>${cat.name}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="form__group">
            <label for="priority-level">Priority</label>
            <select name="priority-level" id="priority-level">
              <option value="low" ${
                this._data.task.priority == "low" ? "selected" : ""
              }>Low</option>
              <option value="medium" ${
                this._data.task.priority == "medium" ? "selected" : ""
              }>Medium</option>
              <option value="high" ${
                this._data.task.priority == "high" ? "selected" : ""
              }>High</option>
            </select>
          </div>

          <div class="form__group">
            <label for="status">Status</label>
            <select name="status" id="status">
              <option value="todo" ${
                this._data.task.status == "todo" ? "selected" : ""
              }>Todo</option>
              <option value="inProgress" ${
                this._data.task.status == "inProgress" ? "selected" : ""
              }>In Progress</option>
              <option value="completed" ${
                this._data.task.status == "completed" ? "selected" : ""
              }>Completed</option>
              <option value="outdated" ${
                this._data.task.status == "outdated" ? "selected" : ""
              }>Outdated</option>
            </select>
          </div>

          <div class="form__group">
            <label for="due-date">Due Date</label>
            <input type="date" value="${
              this._data.task.dueDate
            }" min="${todayDate}" name="due-date" id="due-date">
            <span class="feedback-message">Only<span class="highlighted">future</span> dates.</span>
          </div>
        </div>

        <div class="form__group form__group--actions form__group--full-col">
          <button type="submit" class="btn form__btn form__btn--edit">Update</button>
        </div>
      </form>
    `;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new EditTaskView();
