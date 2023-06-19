import React,{useEffect, useState} from "react";
import jwtDecode from 'jwt-decode'
//import{useHistory} from 'react-router-dom';
import { useLocation} from "react-router-dom";
import Axios from 'axios';
import "../pagesCss/UserProfile.css"
import { useNavigate } from "react-router-dom";


const UserProfile = ()=>{
    const history = useLocation();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [userEmail, setUserEmail] = useState('');
   async function populateQuote(){
        const {data} = await Axios.get('http://localhost:5000/RegistraionAndLogin/quote',{
            headers:{
                'x-access-token':localStorage.getItem('token'),
            }
        })

        console.log(data);
        if(data.success === true){
             setFirstName(data.firstName)
             setUserEmail(data.email);
        }else{
            alert(data.error);
        }
    }
    useEffect(()=>{

        const token = localStorage.getItem('token');
        if(token){
            const user = jwtDecode(token)

            if(!user){
                localStorage.removeItem('token')
                window.location.href = '/'
                history.replace('/login')
            }
            else{
                populateQuote();
            }
        }

    },[])
    return(
        <>
          <div className="wrap">

            <div className="body_column">
               { firstName?
                                <div class="card">
                                    <img  className="img" src={require("../img/cute-profile.jpg")}  />
                                    <h1>{firstName}</h1>
                                    <p><span>Country: </span>Bangladesh</p>
                                    <p><span>University: </span>GUB</p>
                                    <p><span>Since: </span>1/22/623,9316</p>
                                    <p><span>Points: </span>Bangladesh</p>
                                    <p><span>Solved: </span>214</p>
                                    <p><span>Tried: </span>221</p>
                                    <p><span>Submission: </span>400</p>                                

                                    <button onClick={()=>{  navigate("/Submission",
                                            {state:{email:userEmail}
                                            });}} >My submissions</button>

                                
                                    <p><button>Contact</button></p>
                                </div>                      
                               : <h1> Hi You are not logged in.  </h1>       
                  
               }

                
        </div>
        </div>
        </>
    );
}
export default UserProfile;