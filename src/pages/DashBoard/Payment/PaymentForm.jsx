

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const {campId} = useParams();
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
const navigate = useNavigate();


    const [error,setError] = useState('');

    const { isPending, data: campInfo = {}, error: queryError } = useQuery({
  queryKey: ['camps', campId],
  queryFn: async () => {
    const res = await axiosSecure.get(`/camps/${campId}`);
    return res.data;
  }
});

if (queryError) {
  console.error("Query error:", queryError.message);
  return <p className="text-red-500">Camp not found or an error occurred.</p>;
}

    if (isPending) {
        return <span className="loading loading-dots loading-lg"></span>
    }

    console.log (campInfo)
    const amount = campInfo.fees;
    const amountInCents = amount*100;
    console.log (amountInCents)

    const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  const card = elements.getElement(CardElement);
  if (!card) return;

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card,
  });

  if (error) {
    setError(error.message);
    return;
  } else {
    setError('');
    console.log('payment method', paymentMethod);
  }

  try {
    const res = await axiosSecure.post('/create-payment-intent', {
      amount: amountInCents,
      campId
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.participantName,
          email: user.email
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        const paymentInfo = {
          transactionId: result.paymentIntent.id,
          email: user.email,
          amount: campInfo.fees,
           campId: campId,
          campName: campInfo.campName,
          participantName: user.participantName,
          date: new Date().toISOString()
        };

        const saveRes = await axiosSecure.post('/payment-success', paymentInfo);

        if (saveRes.data.insertedId) {
          Swal.fire({
  title: ' Payment Successful!',
  html: `Transaction ID: <strong>${saveRes.data.transactionId}</strong>`,

  icon: 'success',
  confirmButtonText: 'Go to My Camps'
}).then(() => {
  navigate('/dashboard/registeredCamps');
});

        } else {
          Swal.fire({
            title: ' Payment Saved Failed',
            text: 'Payment went through but record was not saved.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      }
    }
  } catch (err) {
    console.error("Error during payment:", err);
    Swal.fire({
      title: ' Payment Error',
      text: 'Something went wrong while processing your payment.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};


    return (
        <div className="mt-5 w-96 mx-auto bg-base-100 p-6 rounded-xl shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 border border-gray-300 rounded bg-base-200">
                    <CardElement className="text-base" />
                </div>
                <button type='submit' 
                disabled={!stripe} 
                className="btn btn-primary w-full">
                    Pay ${amount}
                </button>
                {
                    error && <p className='text-red-600'>{error}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;
