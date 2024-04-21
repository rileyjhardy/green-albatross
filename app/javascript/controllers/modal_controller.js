import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.handleClickOutside = this.handleClickOutside.bind(this)
    document.addEventListener('click', this.handleClickOutside)
  }

  disconnect() {
    document.removeEventListener('click', this.handleClickOutside)
  }

  open() {
    this.element.classList.add('is-active')
  }

  close() {
    this.element.classList.remove('is-active')
  }

  onFormSubmit(event) {
    if (event.detail.success) {
      this.close()
    }
  }

  handleClickOutside(event) {
    const modal = this.element.querySelector('.box')
    if (!modal.contains(event.target)) {
      this.close()
    }
  }
}