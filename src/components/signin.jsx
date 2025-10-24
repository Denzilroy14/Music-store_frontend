import React,{useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
export default function Signin(){
    const [message,setMessage]=useState("");
    const navigate=useNavigate();
    const [form,setForm]=useState({
        username:'',
        email:'',
        password:'',
        confirm_password:''
    });
    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data=new FormData();
        data.append('username',form.username);
        data.append('email',form.email);
        data.append('password',form.password);
        data.append('confirm_password',form.confirm_password);
        try{
            await axios.post('https://musicalstorebackend.pythonanywhere.com/signin',data);
            setForm({
                username:'',
                email:'',
                password:'',
                confirm_password:''
            });
            setMessage("Registration successfull!");
            navigate('/login');
        }
        catch(error){
            console.error('Error in submiting form',error);
            setMessage("Error in registring!",error);
        }
    };

    return(
        <>
        <div className='signin-container'>
            <form onSubmit={handleSubmit} className='signin-form'>
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
                        Enter email:
                    </label>
                    <input
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    required
                    />
                    <br></br>
                </div>
                <div>
                    <label>
                        Create password:
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
                <div>
                    <label>
                        Confirm password:
                    </label>
                    <input
                    name='confirm_password'
                    type='password'
                    value={form.confirm_password}
                    onChange={handleChange}
                    required
                    />
                    <br></br>
                </div>
                <input type='Submit' value='Submit'></input>
            </form>
            <p>{message}</p>
        </div>
        </>
    )
}