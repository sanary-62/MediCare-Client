import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Analytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/participants?email=${user.email}`)
        .then((res) => {
          const formattedData = res.data.map((camp) => ({
            campName: camp.campName,
            fees: parseFloat(camp.fees) || 0,
          }));
          setAnalyticsData(formattedData);
        })
        .catch((err) => console.error("Error fetching analytics data", err));
    }
  }, [user, axiosSecure]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Camp Registration Analytics
      </h2>

      {analyticsData.length === 0 ? (
        <p className="text-center text-gray-500">
          No analytics data available.
        </p>
      ) : (
        <div className="w-full h-64 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analyticsData}
              margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="campName"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis label={{ value: "Fees ($)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar
                dataKey="fees"
                fill="#4f46e5"
                radius={[5, 5, 0, 0]}
                barSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
