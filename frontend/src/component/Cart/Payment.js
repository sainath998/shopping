import React,{useEffect,useState} from 'react'
import PaymentHelper from './PaymentHelper.js'

import { loadStripe } from "@stripe/stripe-js";

import { Elements } from "@stripe/react-stripe-js";
import axios from 'axios';


const Payment = () => {

    async function getStripeApiKey() {
        const { data } = await axios.get("/api/v1/stripeapikey");
        // setStripeApiKey(data.stripeApiKey);
        // setStripeApiKey("969192438555981")
      }
    
  const [stripeApiKey, setStripeApiKey] = useState("pk_test_51KezCJSIxwd6JxflxvfgggrGms04j3BFaXUKYNpkY8QzEaPpebQA9qS2vxcz1etdRkOZVLlxk6ge4xLJOYsI8F5K00tYSN0lqP");
    useEffect(()=>{
    getStripeApiKey();
    },[]);
    
  return (
    <Elements stripe={loadStripe(stripeApiKey)}>
        <PaymentHelper/>
  </Elements>
  )
}

export default Payment