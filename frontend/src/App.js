import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import { useEffect } from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import UserOptions from "./component/layout/Header/UserOptions.js";
import store from "./store";
import { loadUser } from "./actions/userAction";
import Profile from "./component/User/Profile.js";
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js'
import ForgotPassword from './component/User/ForgotPassword.js'
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";


import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";

import Payment from "./component/Cart/Payment.js";
import Dashboard from './component/Admin/Dashboard.js'
import ProductList from './component/Admin/ProductList.js'
import NewProduct from './component/Admin/NewProduct.js'
import UpdateProduct from "./component/Admin/UpdateProduct";

import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";

import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews";

import { useState} from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import NotFound from './component/layout/Not Found/NotFound'
import Contact from './component/layout/Contact/Contact'
import About from './component/layout/About/About'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // const [stripeApiKey, setStripeApiKey] = useState("");
  
  // async function getStripeApiKey() {
  //   const { data } = await axios.get("/api/v1/stripeapikey");
  //   setStripeApiKey(data.stripeApiKey);
  // }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    // getStripeApiKey();
    
    if(isAuthenticated) console.log("logged in");
  }, []);

  // const {isAuthenticatedUser,user} = useSelector(state=>state.user)

  return (
    <Router>
      <Header />
      <Routes>
        
        <Route  path="/" element={<Home />} />
        <Route  path="/product/:id" element={<ProductDetails />} />
        <Route  path="/search" element={<Search />} />
        <Route  path="/products" element={<Products />} />
        <Route  path="/products/:keyword" element={<Products />} />
        <Route  path="/login" element={<LoginSignUp />} />
        <Route  path="/logout" element={<LoginSignUp />} />
        <Route  path="/me/update" element={isAuthenticated && <UpdateProfile />} />
        <Route  path="/account" element={isAuthenticated && <Profile />} />
        <Route  path="/password/update" element={<UpdatePassword />} />
        <Route exact path="/password/forgot" element={<ForgotPassword/>} />
        <Route exact path="/password/reset/:token" element={<ResetPassword/>} />
        <Route exact path="/cart" element={<Cart/>} />

        <Route exact path="/shipping" element={<Shipping/>} />
        <Route exact path="/success" element={<h2 style={{"textAlign":"center"}}>order was Successfully placed</h2>} />
        <Route exact path="/order/confirm" element={<ConfirmOrder/>} />
        <Route exact path="/orders" element={<MyOrders/>} />
        <Route exact path="/process/payment" element={<Payment/>} />
        <Route exact path="/orders" element={isAuthenticated && <MyOrders/>} />
        <Route exact path="/order/:id" element={isAuthenticated && <OrderDetails/>} />
        
        
        <Route exact path="/admin/dashboard" element={isAuthenticated && <Dashboard/>} />
        <Route exact path="/admin/products" element={isAuthenticated && <ProductList/>} />
        <Route exact path="/admin/product/new" element={isAuthenticated && <NewProduct/>} />
        <Route exact path="/admin/product/:id" element={isAuthenticated && <UpdateProduct/>} />
        <Route exact path="/admin/orders" element={isAuthenticated && <OrderList/>} />
        <Route exact path="/admin/order/:id" element={isAuthenticated && <ProcessOrder/>} />
        <Route exact path="/admin/users" element={isAuthenticated && <UsersList/>} />
        <Route exact path="/admin/user/:id" element={isAuthenticated && <UpdateUser/>} />
        <Route exact path="/admin/reviews" element={isAuthenticated && <ProductReviews/>} />

        
        <Route path="/contact" element={  <Contact/>} />
        <Route path="/about" element={  <About/>} />
        <Route path="/*" element={  <NotFound/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

/*

<Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>


<Route
          path="/"
          element={isAuthenticated && <UserOptions user={user} />}
        />*/

export default App;
