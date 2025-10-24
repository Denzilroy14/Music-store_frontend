import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function ProfilePage(){
    const [message,setMessage]=useState("");
    const [cart_products,setCartProducts]=useState([]);
    const [totalbill,setTotalBill]=useState(null);
    const [contactinfo,setContactInfo]=useState({
        contact:null,
        address:'',
        payment_method:''
    });
    const navigate_home=useNavigate();
    const handleClickHome=()=>{
        navigate_home('/');
    }
    const handleClickOrder=()=>{
        navigate_home('/my_orders');
    }
    useEffect(()=>{
        axios.get('https://musicalstorebackend.pythonanywhere.com/profile',{
            withCredentials:true
        })
        .then((res)=>{
            if(Array.isArray(res.data)){
                const productswithuserQty=res.data.map((item)=>({
                ...item,
                user_qty:1,
            }));
                setCartProducts(productswithuserQty);
            }
            else{
                setMessage(res.data.message);
            }
        })
        .catch(err=>console.error(err));
    },[]);
    const incrementqty=(index)=>{
        setCartProducts((prevProducts)=>{
            const updateproduct=[...prevProducts]
            updateproduct[index]={
                ...updateproduct[index],
                user_qty:updateproduct[index].user_qty+1,
            };
            return updateproduct;
        });
    };
    const decrementqty=(index)=>{
        setCartProducts((prevproducts)=>{
            const updateproduct=[...prevproducts]
            updateproduct[index]={
                ...updateproduct[index],
                user_qty:updateproduct[index].user_qty-1,
            };
            return updateproduct;
        });
    }
    const handleBillNow=(product,qty)=>{
        if(!contactinfo.address||!contactinfo.contact||!contactinfo.payment_method){
            setMessage("Please fill in contact details for delivery");
            return;
        }
        else{
        axios.post(`https://musicalstorebackend.pythonanywhere.com/billnow/${product.product_id}/${product.user_id}/${qty}`,{
            contact:contactinfo.contact,
            address:contactinfo.address,
            payment_method:contactinfo.payment_method

        },{withCredentials:true})
        .then(res=>{
            setMessage(res.data.message);
            setTotalBill(res.data.bill);
            setContactInfo({
                contact:null,
                address:"",
                payment_method:""
            });
        })
        .catch(err=>{
            console.error('error:',err);
            const errormessage=err?.response?.data?.message||"Error:sorry couldnt process with billing"
            setMessage(errormessage);
        });}
    };
            /*if(err.response&&err.response.status===401){
                //User has not logged in redirect to login
                //navigate('/login');
            else{
                setMessage("Error in fetching details");
            }*/
    return(
        <div className='profile-container'>
            <p>{message}</p>
            {cart_products.length===0?(
                <div>
                <h2>username:{cart_products.username}</h2>
                <p>No items yet in your cart!</p>
                </div>
            ):(
                cart_products.map((item,index)=>(
                    <div className='profile-items-grid'>
                        <div className='product-details'>
                            <h1>{item.user_id}'s profile</h1>
                            <img
                            src={item.product_img}
                            alt='product_image'
                            />
                        <h3>product name:{item.product_name}</h3>
                        <h3>product id:{item.product_id}</h3>
                        <div className='qty-control'>
                        <h3>product qty choosen:
                            <button onClick={()=>incrementqty(index)}>+</button>
                            {item.user_qty}
                            <button onClick={()=>decrementqty(index)}>-</button>
                        </h3>
                        </div>
                        <h3>product price:{item.product_amt}</h3>
                        </div>
                <div className='shipping-details'>
                <h2>Shipping summary</h2>
                <label>Enter contact number:</label>
                <input
                type='text'
                name='contact'
                value={contactinfo.contact}
                onChange={(e)=>setContactInfo({...contactinfo,contact:e.target.value})}
                required
                />
                <br></br>
                <label>Enter address number:</label>
                <textarea
                name='address'
                value={contactinfo.address}
                onChange={(e)=>setContactInfo({...contactinfo,address:e.target.value})}
                >
                </textarea>
                <br></br>
                <label>choose payment method:</label>
                <input
                type='select'
                name='payment_method'
                value={contactinfo.payment_method}
                onChange={(e)=>setContactInfo({...contactinfo,payment_method:e.target.value})}
                required
                />
                 <button className='Bill_now_button'onClick={()=>handleBillNow(item,item.user_qty)}>Bill now</button>
            </div>
                    </div>
                ))
            )}
            {totalbill!==null&&(
                <h2>Total bill:{totalbill}</h2>
            )}
            <button onClick={handleClickHome}>Go to purchase</button>
             <button onClick={handleClickOrder}>My orders</button>
        </div>
    )
}