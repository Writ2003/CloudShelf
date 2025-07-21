import { useEffect, useState } from 'react';
import axios from 'axios'
const useAuth = () => {
  const [auth, setAuth] = useState({ loading: true, user: null, userType: null });

  useEffect(() => {
    const authUser = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/protectedRoute/auth/verify',{withCredentials:true});
            setAuth({ loading: false, user: response.data.user, userType: response.data.userType })
        } catch (error) {
            setAuth({ loading: false, user: null , userType: null});
            console.error("Error while verifying user, Error: ",error);
        }
    }
    authUser();
  }, []);

  return auth;
};

export default useAuth;