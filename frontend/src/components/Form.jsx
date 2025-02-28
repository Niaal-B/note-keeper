import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { Link } from "react-router-dom";


function Form({route,method}){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const name = method  == "login" ? "Login" : "Register"
    const handlesubmit = async(e) => {
        setLoading(true)
        e.preventDefault()
        try{
            const res = await api.post(route,{username,password})
            console.log(res);
            
            
            if (method === 'login'){

                dispatch(login({ access: res.data.access, refresh: res.data.refresh })); 
                const userResponse = await api.get("/api/user/", {
                    headers: { Authorization: `Bearer ${res.data.access}` },
                });
                console.log(userResponse);
                
                if (userResponse.status === 200) {
                    
                    dispatch(login({ 
                        access: res.data.access, 
                        refresh: res.data.refresh, 
                        user: userResponse.data 
                    }));
                }
                navigate("/")

            }
            else{
                navigate("/login")
            }
        }
        catch(error){
            alert(error)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handlesubmit} className="form-container">
        <h1>{name}</h1>
        <input type="text" className="form-input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username"/>
        <input type="password" className="form-input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
        {loading && <LoadingIndicator/>}
        <button className="form-button" type="submit">{name}</button>
        <Link to={method === "login" ? "/register" : "/login"}>
  {method === "login" ? "Go to Register" : "Go to Login"}
</Link>
    </form>

        </>
    )

    
}

export default Form