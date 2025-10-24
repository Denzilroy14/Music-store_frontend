import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function ProductDetail(){
  const { prodid } = useParams(); // Get product ID from route
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const navigate_login=useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/view_product_details/${prodid}`)
      .then(response => {
        setProduct(response.data);
        console.log(response.data)
      })
      .catch((error) => console.error(error));
  }, [prodid]);

  if (!product) return <div>Loading...</div>;
  const addToCart=(prodid)=>{
        axios.post(`http://localhost:5000/add_to_cart/${prodid}`,{
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
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={product.product_img_url} alt={product.product_name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2>{product.product_name}</h2>
          <p>{product.product_desc}</p>
          <h4>₹{product.product_amt}</h4>
          <p>In Stock: {product.product_qty}</p>
          
          {/*<div className="mb-3">
            <label>Quantity: </label>
            <input 
              type="number" 
              min="1"
              max={product.product_qty}
              className="form-control w-25"
            />
          </div>*/}
          <button className="btn btn-primary" onClick={()=>addToCart(prodid)}>Add to Cart</button>
          {message && <p className="mt-3 text-success">{message}</p>}
        </div>
      </div>

      <hr />

      <div className="review-container">
        <h4>Reviews:</h4>
        {product.reviews.length===0?(
          <p>No reviews yet for this product!</p>
        ):(
          <div>
            {product.reviews.map(review=>(
              <div>
                <p>Comments:{review[1]}</p>
                <p>Rating:{"⭐".repeat(review[2])}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

