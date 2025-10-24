import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function AdminPanel(){
    const [products,setProducts]=useState([]);
    useEffect(()=>{
        axios.get('https://musicalstorebackend.pythonanywhere.com/view_products')
        .then(res=>setProducts(res.data))
        .catch(err=>console.error(err));
    },[]);
    const navigate_orders=useNavigate();
    const [message,setMessage]=useState('');
    const [form,setForm]=useState({
        prod_id:'',
        prod_name:'',
        prod_amt:'',
        prod_qty:'',
        prod_desc:'',
        prod_image:null
    });
    const handleOrders=()=>{
        navigate_orders('/manage_orders');
    }
    const handleChange=(e)=>{
        if(e.target.name==='prod_image'){
            setForm({...form,prod_image:e.target.files[0]});
        }
        else{
            setForm({...form,[e.target.name]:e.target.value});
        }
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data =new FormData();
        data.append('prod_name',form.prod_name);
        data.append('prod_amt',form.prod_amt);
        data.append('prod_qty',form.prod_qty);
        data.append('prod_desc',form.prod_desc);
        data.append('prod_image',form.prod_image);
        try{
            await axios.post('https://musicalstorebackend.pythonanywhere.com/add_product',data);
            setForm({
                prod_name:'',
                prod_amt:'',
                prod_qty:'',
                prod_desc:'',
                prod_image:null
            });
            setMessage("Product successfully added!");
        }
        catch(error){
            setMessage('Error in adding product');
            console.error('Error:',error);
        }
    };
    return(
        <div className='add_products_container'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Enter product name:
                    </label>
                    <input
                    type='text'
                    name='prod_name'
                    value={form.prod_name}
                    onChange={handleChange}
                    required
                    />
                    <br></br>
                </div>
                <div>
                    <label>
                        Enter product amount:
                    </label>
                    <input
                    type='text'
                    name='prod_amt'
                    value={form.prod_amt}
                    onChange={handleChange}
                    required
                    />
                    <br></br>
                </div>
                <div>
                    <label>
                        Enter product qty:
                    </label>
                    <input
                    type='text'
                    name='prod_qty'
                    value={form.prod_qty}
                    onChange={handleChange}
                    required
                    />
                    <br></br>
                </div>
                <div>
                    <label>
                        Enter product description:
                    </label>
                    <input
                    type='text'
                    name='prod_desc'
                    value={form.prod_desc}
                    onChange={handleChange}
                    required
                    />
                    <br></br>
                </div>
                <div>
                    <label>
                        Upload product pic:
                    </label>
                    <input
                    type='file'
                    name='prod_image'
                    onChange={handleChange}
                    required
                    />
                </div>
                <input type='Submit' value='Add product'/>
            </form>
            <p>{message}</p>
            <div className='product-list'>
                <h1>Added products to list</h1>
                <div>
                    <form action='https://musicalstorebackend.pythonanywhere.com/delete_products' method='POST'>
                    {Array.isArray(products)&&products.length===0?(
                        <p>No products</p>
                    ):(
                        products.map((products,index)=>(
                            <div>
                                <h3>Product name:{products.product_name}</h3>
                        <h3>Product amount:{products.product_amt}</h3>
                        <p>
                            Product desc:{products.product_desc}
                        </p>
                        <h3>Product qty:{products.product_qty}</h3>
                        <img
                        src={products.product_img_url}
                        alt="Product"
                        style={{ width: '200px', height: 'auto' }}
                        />
                         <input type='checkbox' name='product_to_delete' value={products.product_id}></input>
                            </div>
                        ))
                    )}
                    <button type='submit'>Delete selected item</button>
                    <button type='submit' onClick={handleOrders}>Orders</button>
                    </form>
                </div>
            </div>
        </div>
    )
}