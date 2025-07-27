import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import SearchBar from '../../SearchBar/SearchBar';  

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/payment-history?email=${user.email}&page=${page}&limit=${limit}`)
        .then(res => {
          // Expect backend to return { payments: [], totalPages: n }
          // Sort by date (newest first)
          const sorted = res.data.payments.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPayments(sorted);
          setTotalPages(res.data.totalPages);
        })
        .catch(error => {
          console.error("Failed to fetch payment history:", error);
        });
    }
  }, [user?.email, axiosSecure, page]);

  // Filter payments by search term (campName, paymentStatus, confirmationStatus)
  const filteredPayments = payments.filter(payment => {
    const term = searchTerm.toLowerCase();
    const campName = payment.campName?.toLowerCase() || "";
    const paymentStatus = (payment.paymentStatus || "paid").toLowerCase();
    const confirmationStatus = (payment.confirmationStatus || "pending").toLowerCase();

    return (
      campName.includes(term) ||
      paymentStatus.includes(term) ||
      confirmationStatus.includes(term)
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">My Payment History</h2>

      {/* SearchBar added here */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by camp name, payment status, or confirmation status"
      />

      <div className="overflow-x-auto shadow-xl rounded-xl mt-4">
        <table className="table table-zebra w-full min-w-[600px]">
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
            {filteredPayments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{(page - 1) * limit + index + 1}</td>
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

      {/* Pagination Controls */}
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </button>
        <span className="btn btn-sm btn-disabled">{page}</span>
        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;
