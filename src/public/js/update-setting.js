import axios from 'axios';
import { showAlert } from './alert';

export const updateInfo = async (payload, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8080/api/v1/auth/update-password'
        : 'http://localhost:8080/api/v1/users/me';
    const res = await axios({
      method: 'PATCH',
      url,
      data: payload,
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type === 'password' ? 'PASSWORD' : 'INFORMATION'}  Updated`
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
