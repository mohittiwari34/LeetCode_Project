import { GoogleLogin } from "@react-oauth/google";
import axiosClient from "../Utils/axiosClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { handleSuccess } from "../authslice";
import { useDispatch } from "react-redux";

function Login1() {
  const [successful, setSuccessful] = useState(null);
  
  const dispatch=useDispatch();

  const onSubmit=(res)=>{
    dispatch(handleSuccess(res.credential));
  }

  return (
    <GoogleLogin
      onSuccess={onSubmit}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default Login1;
