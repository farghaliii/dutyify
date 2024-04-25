import "core-js/stable";

class AddTaskView {
  _parentEl = document.querySelector(".modal__content-body");
  _btnAddTaskEl = document.querySelector(".btn--add");
  _data;

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  addHandlerRender(handler) {
    this._btnAddTaskEl.addEventListener("click", handler);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") handler(e);
      if (e.key === "n" || e.key === "N") handler();
    });
  }
  addHandlerSubmit(handler) {
    document.querySelector(".form--adding").addEventListener("submit", (e) => {
      e.preventDefault();
      handler(e);
    });
  }

  _generateMarkup() {
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
            <label for="category">Category</label>
            <select name="category" id="category">
              <option value="personal">Personal</option>
              <option value="design">Design</option>
              <option value="web-development">Web Development</option>
            </select>
          </div>

          <div class="form__group">
            <label for="priority-level">Priority</label>
            <select name="priority-level" id="priority-level">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="form__group">
            <label for="due-date">Due Date</label>
            <input type="date" value="2024-04-21" min="2024-04-21" name="due-date" id="due-date">
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
}

export default new AddTaskView();
