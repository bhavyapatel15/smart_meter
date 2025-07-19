import { useState,useEffect} from "react";
import axios from "axios";

const UserTopbar = () => {

  const[userInfo,setUserInfo]=useState({});
  
  const token=localStorage.getItem('token');

  useEffect(()=>{

      const fetchUserData=async()=>{
        if(!token)
        {
          console.log("Invalid token");
          return;
        }

        const config={headers:{Authorization:`Bearer ${token}`},}

        try{
          const res=await axios.get('http://localhost:5000/api/user/me',config);
          setUserInfo(res.data);
        }catch(err){
          console.error("Error fetching data", err);
        }
      };
      fetchUserData();

  },[token]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4 py-2 mb-4 rounded">
      <div className="container-fluid justify-content-between">
        <span className="navbar-brand fw-bold">Welcome, {userInfo.name}</span>
        <div className="d-flex align-items-center">
          <span className="fw-semibold">{userInfo.email}</span>
        </div>
      </div>
    </nav>
  );
};

export default UserTopbar;
