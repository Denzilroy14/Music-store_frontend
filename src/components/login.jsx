import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function LoginPage(){
    const [message,setMessage]=useState("");
    const navigate=useNavigate();
    const [form,setForm]=useState({
        username:'',
        password:''
    });

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data=new FormData();
        data.append('username',form.username);
        data.append('password',form.password);
        try{
            await axios.post('https://musicalstorebackend.pythonanywhere.com/login',data,{withCredentials:true});
            setForm({
                username:'',
                password:''
            });
            alert("Login succesfully")
            setMessage('Login successful');
            navigate('/profile');
        }
        catch(error){
            console.error('Error:',error);
            setMessage("Sorry could not login!");
        }
    };
    return(
        <div>
            <div className='login-container'>
                <form onSubmit={handleSubmit} className='login-form'>
                    <div>
                        <label>
                            Enter username:
                        </label>
                        <input
                        name='username'
                        type='text'
                        value={form.username}
                        onChange={handleChange}
                        required
                        />
                        <br></br>
                    </div>
                    <div>
                        <label>
                            Enter password:
                        </label>
                        <input
                        name='password'
                        type='password'
                        value={form.password}
                        onChange={handleChange}
                        required
                        />
                        <br></br>
                    </div>
                    <input type='Submit' value='Login'/>
                </form>
                <p>{message}</p>
            </div>
        </div>
    )
}
