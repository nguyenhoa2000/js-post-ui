import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background:'#81c2e3',
      }
    }).showToast();
  },

  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background:'#54ff20',
      }
    }).showToast();
  },

  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background:'#ff3220',
      }
    }).showToast();
  },
}
