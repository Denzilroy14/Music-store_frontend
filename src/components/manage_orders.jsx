import React,{useState,useEffect} from 'react';
import axios from 'axios';
export default function ManageOrder(){
    const [orders,setOrders]=useState([]);
    const[message,setMessage]=useState("");
    useEffect(()=>{
        axios.get('https://musicalstorebackend.pythonanywhere.com/manage_orders')
        .then((res)=>{
            if(Array.isArray(res.data)){
                setOrders(res.data);
            }
            else{
                setMessage(res.data.message);
            }
        })
        .catch((error)=>{
            console.error(error);
            setMessage('Err:Error fetching orders!');
        })
    },[]);

    const toggleStatus=(user_id,current_status,prod_id)=>{
      const new_status=current_status===0?1:0;
      axios.post('https://musicalstorebackend.pythonanywhere.com/update_order_status',{
        user_id:user_id,
        prod_id:prod_id,
        new_status:new_status,
      })
      .then((res)=>{
        setMessage(res.data.message);
        setOrders((prevOrders)=>
          prevOrders.map((order)=>
          order.user_id===user_id?{...order,product_status:new_status}:order
          )
        );
      })
      .catch((err)=>console.error(err));
    }
    return(
        <div>
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>{message && <p style={{ color: "red" }}>{message}</p>}</p>
        ) : (
          orders.map((order) => (
            <div key={`${order.prod_id}.${order.prod_quan}.${order.product_status}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h3>Product id:{order.prod_id}</h3>
              <h3>user id:{order.user_id}</h3>
              <h3>Customer name:{order.user_name}</h3>
              <h3>Customer contact:{order.usercontact}</h3>
              <h3>Customer address:{order.user_address}</h3>
              <h3>Product name:{order.product_name}</h3>
              <p>Ordered qty:{order.ordered_qty}</p>
              <p>Total:₹{order.Total_amount}</p>
              <p>Status:{order.product_status===0?'Pending':'Delivered'}</p>
              <button onClick={()=>toggleStatus(order.user_id,order.product_status,order.prod_id)}>Mark as {order.product_status===0?'delivered':'pending'}</button>
              <img
                src={order.product_image_name}
                alt="Product"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          ))
        )}
      </div>
    );   
}