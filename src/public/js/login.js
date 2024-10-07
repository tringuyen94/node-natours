import axios from 'axios';
import { showAlert } from './alert';
export const sendData = async ({ email, password }) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/auth/signin',
      data: { email, password },
    });
    if (res.data.status === 'success') {
      setTimeout(function () {
        window.location.assign('http://localhost:8080/overview');
      }, 2000);
      showAlert('success', 'Login sucessfully');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const signout = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/auth/signout',
    });
    if (res.data.status === 'success') {
      setTimeout(function () {
        if (window.location.href.split('/')[3] === 'account') {
          window.location.assign('http://localhost:8080/overview');
        } else window.location.reload();
      }, 2000);
      showAlert('success', 'Loggout success');
    }
  } catch (error) {
    showAlert('error', 'Loggout Failed');
  }
};
