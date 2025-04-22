import { useEffect, useState } from 'react';
import axios from 'axios'
const useAuth = () => {
  const [auth, setAuth] = useState({ loading: true, user: null });

  useEffect(() => {
    const authUser = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/protectedRoute/auth/verify',{withCredentials:true});
            console.log(response.data);
            setAuth({ loading: false, user: response.data.user })
        } catch (error) {
            setAuth({ loading: false, user: null });
            console.error("Error while verifying user, Error: ",error);
        }
    }
    authUser();
  }, []);

  return auth;
};

export default useAuth;