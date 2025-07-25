import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email || authLoading) return;

      try {
        const res = await axiosSecure.get(`/users/search?email=${user.email}`);
        setRole(res.data.role || "user");
      } catch (err) {
        console.error("Failed to fetch role", err);
        setRole("user"); 
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, authLoading, axiosSecure]);

  return { role, roleLoading: loading };


};

export default useUserRole;
