import { sendData, signout } from './login';
import { displayMap } from './mapbox';
import { updateInfo } from './update-setting';
import bookTour from './stripe';
//DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userSettingForm = document.querySelector('.form-user-settings');
const btnLogout = document.querySelector('.nav__el--logout');
const userPhoto = document.getElementById('photo');
const btnBookTour = document.getElementById('book-tour');
//HANDLE PHOTO CHANGE
const userPhotoPreview = (e) => {
  const imagePreview = document.querySelector('.form__user-photo');
  const imageInfo = document.getElementsByClassName('image__info');
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      imageInfo.textContent = 'Please select a valid image file';
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
};
if (userPhoto) {
  userPhoto.addEventListener('change', userPhotoPreview);
}
if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    sendData({ email, password });
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', document.getElementById('email').value);
    formData.append('name', document.getElementById('name').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    updateInfo(formData);
  });
}
if (userSettingForm) {
  userSettingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-update--password').textContent = 'Updating...';
    const oldPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    await updateInfo(
      { oldPassword, newPassword, newPasswordConfirm },
      'password'
    );
    document.querySelector('.btn-update--password').textContent =
      'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
if (btnLogout) {
  btnLogout.addEventListener('click', signout);
}

if (btnBookTour) {
  btnBookTour.addEventListener('click', (e) => {
    e.target.textContent = 'Processing ...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
