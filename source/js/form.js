'use strict';

const form = document.querySelector('.contest__form');
const submitBtn = document.querySelector('.submit__btn');
const popupError = document.querySelector('.popup--error');
const popupSuccess = document.querySelector('.popup--success');
const closePopup = document.querySelectorAll('.popup__button');

function showCover() {
  var cover = document.createElement('div');
  cover.classList.add('cover');
  document.body.appendChild(cover);
}

function hideCover() {
  document.body.removeChild(document.querySelector('.cover'));
}

if (form) {
  submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (form.checkValidity()) {
      showCover();
      form.classList.remove('validation-error');
      popupSuccess.classList.add('popup--show');
      form.reset();
    } else {
      showCover();
      popupError.classList.add('popup--show');
      form.classList.add('validation-error');
    }
  });
}

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 27 || event.keyCode === 13) {
    if (popupError.classList.contains('popup--show') || popupSuccess.classList.contains('popup--show')) {
      event.preventDefault();
      hideCover();
      popupError.classList.remove('popup--show');
      popupSuccess.classList.remove('popup--show');
    }
  }
});

for (var i = 0; i < closePopup.length; i++) {
  closePopup[i].addEventListener('click', function (event) {
    event.preventDefault();
    hideCover();
    popupError.classList.remove('popup--show');
    popupSuccess.classList.remove('popup--show');
  });
}
