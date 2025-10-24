import './App.css';
import Signin from './components/signin';
import LoginPage from './/components/login';
import AdminPanel from './/components/admin';
import HomePage from './components/homepage';
import ProfilePage from './components/Profile';
import MyOrders from './components/myorders';
import ManageOrder from './components/manage_orders';
import ProductDetailPage from './components/product_detail_page';
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/my_orders' element={<MyOrders/>}/>
        <Route path='/manage_orders' element={<ManageOrder/>}/>
        <Route path='/view_product_details/:prodid' element={<ProductDetailPage/>}/>
      </Routes>
    </Router>
    </>
  );
}


export default App;
