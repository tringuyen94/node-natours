import { showAlert } from './alert';
import axios from 'axios';
const stripe = Stripe(
  'pk_test_51Q599dB25ODPKXFCKkuIagl9vpWWxVgteX5TQfL3VjQ2IamGARbpMrLnGtwVoIdoKmcX1Pa1ZT82vg94yjb43AJb00m4sDNrnJ'
);
export default bookTour = async (tourId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/booking/checkout-session/${tourId}`
    );

    const sessionId = response.data.session.id;
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      // Display error message to the customer
      showAlert('error', result.error.message);
    }
  } catch (error) {
    showAlert('error', error);
  }
};
