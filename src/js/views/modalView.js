import "core-js/stable";

class ModalView {
  _parentEl = document.querySelector(".modal");
  _btnCloseModalEl = document.querySelector(".modal__btn--close");

  constructor() {
    this._btnCloseModalEl.addEventListener("click", this.closeModal.bind(this));

    // Using arrow function here to make it inherit 'this' from the surrounding code
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("modal")) return;
      this.closeModal();
    });
  }

  closeModal() {
    this._parentEl.classList.add("modal--close");
    document.querySelector("html").style.overflow = "auto";
    document.querySelector("html").style.overflowX = "hidden";
    document.querySelector("body").style.overflow = "auto";
  }

  openModal() {
    this._parentEl.classList.remove("modal--close");
    document.querySelector("html").style.overflow = "hidden";
    document.querySelector("body").style.overflow = "hidden";
  }
}

export default new ModalView();
