import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
  if (user?.email) {
    axiosSecure
      .get(`/participants?participantEmail=${user.email}`)
      .then((res) => {
        const paidCamps = res.data.filter((camp) => camp.paymentStatus === "paid");
        setPaymentHistory(paidCamps);
      })
      .catch((err) => console.error("Error loading payment history", err));
  }
}, [user, axiosSecure]);


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        My Payment History
      </h2>

      {paymentHistory.length === 0 ? (
        <p className="text-center text-gray-500">No payment history available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th>#</th>
                <th>Camp Name</th>
                <th>Fees</th>
                <th>Payment Status</th>
                <th>Confirmation Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.campName}</td>
                  <td>${item.fees}</td>
                  <td className="text-green-600 font-semibold">Paid</td>
                  <td
                    className={
                      item.confirmationStatus === "Confirmed"
                        ? "text-green-700"
                        : "text-yellow-600"
                    }
                  >
                    {item.confirmationStatus || "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
