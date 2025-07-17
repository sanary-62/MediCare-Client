import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/payment-history?email=${user.email}`)
        .then(res => {
           console.log("Payment history data:", res.data); 
          // Sort by date (newest first)
          const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPayments(sorted);
        })
        .catch(error => {
          console.error("Failed to fetch payment history:", error);
        });
    }
  }, [user?.email, axiosSecure]);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">My Payment History</h2>

      <div className="overflow-x-auto shadow-xl rounded-xl">
        <table className="table table-zebra w-full">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th>#</th>
              <th>Camp Name</th>
              <th>Fees</th>
              <th>Payment Status</th>
              <th>Confirmation Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td>{payment.campName}</td>
                <td>${payment.amount}</td>
                <td>
                  <span className="badge badge-success text-white bg-green-700">
                    {payment.paymentStatus || 'Paid'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${payment.confirmationStatus === 'Confirmed' ? 'badge-primary' : 'badge-ghost'}`}>
                    {payment.confirmationStatus || 'Pending'}
                  </span>
                </td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
