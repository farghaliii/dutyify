import "core-js/stable";
import { formDataExtraction } from "../helpers";

class AddCategoryView {
  _parentEl = document.querySelector(".modal__content-body");
  _btnAddCategoryEl = document.querySelector(
    "[data-action-name='add-category']"
  );
  _data;

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  clear() {
    this._parentEl.querySelector(".form--adding").reset();
  }

  addHandlerRender(handler) {
    this._btnAddCategoryEl.addEventListener("click", handler);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handler(e);
      if (e.key === "c" && !this._isAnyInputOrTextareFocused()) handler();
    });
  }

  addHandlerSubmit(handler) {
    document.querySelector(".form--adding").addEventListener("submit", (e) => {
      e.preventDefault();
      handler(formDataExtraction(e.target));
    });
  }

  _generateMarkup() {
    const markup = `
      <form class="form form--adding">
        <div class="form__group form__group--full-col">
          <label for="name">Category Name</label>
          <input type="text" name="name" id="name" minlength="4" placeholder="Category name..." required>
          <span class="feedback-message">Must be more than<span class="highlighted">4 characters</span>.</span>
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

export default new AddCategoryView();
