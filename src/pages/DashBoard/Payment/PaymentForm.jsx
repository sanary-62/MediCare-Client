import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';


const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const {campId} = useParams();
    const axiosSecure = useAxiosSecure();

    const [error,setError] = useState('');

    const {isPending,data: campInfo={}} = useQuery({
        queryKey: ['camps', campId],
        queryFn: async() => {
            const res = await axiosSecure.get(`/camps/${campId}`);
            return res.data;
        }
    })


    if (isPending) {
        return <span className="loading loading-dots loading-lg"></span>
    }


    console.log (campInfo)


    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!stripe || !elements){
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })

        if (error){
            setError(error.message);
        }
        else{
            setError('');
            console.log('payment method',paymentMethod)
        }
    }

    return (
        <div className="mt-5 w-96 mx-auto bg-base-100 p-6 rounded-xl shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 border border-gray-300 rounded bg-base-200">
                    <CardElement className="text-base" />
                </div>
                <button type='submit' 
                disabled={!stripe} 
                className="btn btn-primary w-full">
                    Pay for the Camp
                </button>
                {
                    error && <p className='text-red-600'>{error}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;


