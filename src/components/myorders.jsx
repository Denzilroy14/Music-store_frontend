import React,{useState,useEffect} from "react";
import axios from 'axios';
export default function MyOrders(){
    const [orders,setorderedProducts]=useState([]);
    const [feedbacks,setFeedback]=useState({});
    const [message,setMessage]=useState("");
    useEffect(()=>{
        axios.get('https://musicalstorebackend.pythonanywhere.com/my_orders',{withCredentials:true})
        .then((res)=>{
            if (Array.isArray(res.data)){
                setorderedProducts(res.data);
            }
            else{
                setMessage(res.data.message);
            }
        })
        .catch((error)=>{
            console.error(error)
            setMessage("Err:Failed to fetch orders");
        })
    },[]);

    const handleFeedbackChange=(prodid,field,value)=>{
      setFeedback((prev)=>({
        ...prev,
        [prodid]:{
          ...prev[prodid],
          [field]:value,
        },
      }));
    };

    const handleFeedback=(prodid)=>{
      const feedback=feedbacks[prodid];
      axios.post(`https://musicalstorebackend.pythonanywhere.com/give_feedback`,{
          prod_id:prodid,
          comment:feedback.comment,
          rating:feedback.rating,
      })
      .then((res)=>{
        setMessage(res.data.message);
      })
      .catch((err)=>{
        console.error(err);
      });
    };
return (
    <div className='orders-container'>
      <h2>My Orders</h2>
      {orders.length === 0?(
        <p>{message && <p style={{ color: "red" }}>{message}</p>}</p>
      ) : (
        orders.map((order) => (
          <div key={`${order.prod_id}.${order.prod_quan}.${order.product_status}`} className='order-card'>
            <h3>Product:{order.prod_id}</h3>
            <p>Ordered qty:{order.ordered_quan}</p>
            <p>Total:₹{order.Total_amt}</p>
            <p>Status:{order.product_status===0?'Pending':'Delivered'}</p>
            <img
              src={order.prod_img_name}
              alt="Product"
              style={{ width: "200px", height: "auto" }}
            />
            {order.product_status===1 &&(
              <div className="feedback-container">
                <h4>Give your feedback</h4>
                <div>
                  <label>Rating:</label>
                  {[1,2,3,4,5].map((star)=>(
                    <span
                    key={star}
                    onClick={()=>handleFeedbackChange(order.prod_id,'rating',star)}
                    style={{
                      cursor: "pointer",
                      color: feedbacks[order.prod_id]?.rating >= star ? "gold" : "black",
                      fontSize: "20px",
                    }}
                    > ★</span>
                  ))}
                </div>
                <div className='feedback-section'>
                  <textarea
                  placeholder="Write your feedback..."
                  value={feedbacks[order.prod_id]?.comment||""}
                  onChange={(e)=>handleFeedbackChange(order.prod_id,'comment',e.target.value)}
                  rows={3}
                  cols={50}
                  >
                  </textarea>
                </div>
                <button onClick={()=>handleFeedback(order.prod_id)}>Submit feedback</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
