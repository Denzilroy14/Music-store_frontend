import React,{useState,useEffect} from "react";
import {FaShoppingCart} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function HomePage(){
    const [message,setMessage]=useState("");
    const navigate_signin=useNavigate();
    const navigate_login=useNavigate();
    const navigate_profile=useNavigate();
    const navigate_product=useNavigate();

    const handleClickLogin=()=>{
        navigate_login('/login');
    }
    const handleClickSignin=()=>{
        navigate_signin('/signin');
    }
    const handleClickProfile=()=>{
        navigate_profile('/profile')
    }
    const handleProductDetails=(prod_id)=>{
        navigate_product(`/view_product_details/${prod_id}`);
    }
    const [products,setProducts]=useState([]);
    useEffect(()=>{
        axios.get('https://musicalstorebackend.pythonanywhere.com /home')
        .then(res=>setProducts(res.data))
        .catch(err=>console.error(err));
    },[]);
    const addToCart=(prodid)=>{
        axios.post(`https://musicalstorebackend.pythonanywhere.com /add_to_cart/${prodid}`,{
                'quantity':1
            },{withCredentials:true})
            .then(res=>{
                setMessage(res.data.message);
            })
            .catch(err=>{
                if(err.response&&err.response.status===401){
                    setMessage("please to add item");
                    navigate_login('/login');
                }
                else{
                    console.error("error in adding product",err);
                    setMessage("error in adding product");
                }
            });
    }
    return(
        <div>
            {/**Navigate section */}
            <div className='homepage-container'>
                <header className='nav-container'>
                    <h1># Musicals</h1>
                    <nav className='nav-links'>
                    <button onClick={handleClickSignin}>Signin</button>
                    <button onClick={handleClickLogin}>Login</button>
                    <button title='Cart'onClick={handleClickProfile}>
                         <FaShoppingCart size={20}/>
                    </button>
                </nav>
                </header>
            </div>
            <div className='products-carousel'>
            {Array.isArray(products)&&products.length===0?(
                <p>No items </p>
            ):(
                <div className='carousel-track'>
                    {products.map((product,index)=>(
                    <div className='product-card' key={index}>
                        <img
                        src={product.product_img_url}
                        alt="Product"
                        className="product-image"
                        style={{ width: '200px', height: 'auto' }}
                        />
                        <h3>{product.product_name}</h3>
                        <h3>₹{product.product_amt}</h3>
                        <p>
                            {product.product_desc}
                        </p>
                        <h3>stock left:{product.product_qty}</h3>
                        {/*<a href="#"></a>*/}
                        <div className='button-group'>
                        <button onClick={()=>{handleProductDetails(product.product_id)}}>View more</button>
                        <button onClick={() => addToCart(product.product_id)} >Add to cart</button>
                        </div>
                    </div>
                ))}
                </div>
            )}
            </div>
            <div>
                 {Array.isArray(products)&&products.length===0?(
                <p>No items </p>
            ):(
                <div className='product'>
                    {products.map((product,index)=>(
                    <div className='product-card' key={index}>
                        <img
                        src={product.product_img_url}
                        alt="Product"
                        className="product-image"
                        style={{ width: '200px', height: 'auto' }}
                        />
                        <h3>{product.product_name}</h3>
                        <h3>₹{product.product_amt}</h3>
                        <p>
                            {product.product_desc}
                        </p>
                        <h3>stock left:{product.product_qty}</h3>
                        {/*<a href="#"></a>*/}
                        <div className='button-group'>
                        <button onClick={()=>{handleProductDetails(product.product_id)}}>View more</button>
                        <button onClick={() => addToCart(product.product_id)} >Add to cart</button>
                        </div>
                    </div>
                ))}
                </div>
            )}
            </div>
            <p>{message}</p>
        </div>
    );
}
