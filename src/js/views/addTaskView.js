import "core-js/stable";
import { formDataExtraction } from "../helpers";
import { PRIORITY_HIGH, PRIORITY_LOW, PRIORITY_MEDIUM } from "../config";

class AddTaskView {
  _parentEl = document.querySelector(".modal__content-body");
  _btnAddTaskEl = document.querySelector("[data-action-name='add-task']");
  _data;

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  clear() {
    this._parentEl.querySelector(".form--adding").reset();
  }

  addHandlerRender(handler) {
    this._btnAddTaskEl.addEventListener("click", handler);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handler(e);
      if (e.key === "t" && !this._isAnyInputOrTextareFocused()) handler();
    });
  }

  addHandlerSubmit(handler) {
    document.querySelector(".form--adding").addEventListener("submit", (e) => {
      e.preventDefault();
      handler(formDataExtraction(e.target));
    });
  }

  _generateMarkup() {
    const todayDate = new Date().toISOString().split("T")[0];
    const markup = `
      <form class="form form--adding">
        <div class="form__first-box">
          <div class="form__group form__group--full-col">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" minlength="4" placeholder="Task's title..." required>
            <span class="feedback-message">Must be more than<span class="highlighted">4 characters</span>.</span>
          </div>

          <div class="form__group form__group--full-col">
            <label for="description">Description</label>
            <textarea name="description" id="description" minlength="8" cols="30" rows="10" value=""
              placeholder="Task's description..." required></textarea>
            <span class="feedback-message">Must be more than<span class="highlighted">10 characters</span></span>
          </div>
        </div>

        <div class="form__second-box">
          <div class="form__group">
            <label for="keywords">Keywords</label>
            <input type="text" name="keywords" id="keywords" placeholder="keywords Separated by comma ','">
            <span class="feedback-message">Optional! Maximum<span class="highlighted">3 keywords</span>.</span>
          </div>

          <div class="form__group">
            <label for="category">Category / Project</label>
            <select name="category" id="category">
              ${this._data
                .map(
                  (cat) => `
                    <option value="${cat.id}"
                      ${cat.id === "general" ? "disabled" : ""}>
                      ${cat.name}
                    </option>`
                )
                .join("")}
            </select>
          </div>

          <div class="form__group">
            <label for="priority-level">Priority</label>
            <select name="priority-level" id="priority-level">
              <option value="${PRIORITY_LOW}">Low</option>
              <option value="${PRIORITY_MEDIUM}">Medium</option>
              <option value="${PRIORITY_HIGH}">High</option>
            </select>
          </div>

          <div class="form__group">
            <label for="due-date">Due Date</label>
            <input type="date" value="${todayDate}" min="${todayDate}" name="due-date" id="due-date">
            <span class="feedback-message">Only<span class="highlighted">future</span> dates.</span>
          </div>
        </div>

        <div class="form__group form__group--actions form__group--full-col">
          <button type="submit" class="btn form__btn form__btn--add">Add</button>
        </div>
      </form>
    `;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _isAnyInputOrTextareFocused() {
    const focusedElement = document.activeElement;
    return (
      focusedElement.tagName === "INPUT" ||
      focusedElement.tagName === "TEXTAREA"
    );
  }
}

export default new AddTaskView();
