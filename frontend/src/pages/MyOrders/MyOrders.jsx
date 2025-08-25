import { useContext, useEffect, useState, useCallback } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token,currency,userId} = useContext(StoreContext);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready to Collect':
        return '#28a745'; // Green
      case 'Rejected':
        return '#dc3545'; // Red
      case 'Food Processing':
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Gray for unknown status
    }
  };

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      console.error('No userId in context');
      return;
    }
    const response = await axios.post(
      url+"/api/order/userorders",
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(response.data.data)
  }, [userId, url, token]);

  const deleteOrder = async (orderId) => {
    const response = await axios.post(url + "/api/order/delete", { orderId });
    if (response.data.success) {
      fetchOrders();
    }
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  },[token, fetchOrders])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p className='order-number'>Order No: {order.orderNumber}</p>
                <p className='collection-date'>
                    <b>Collection Date:</b> {order.collectedDate ? order.collectedDate.slice(0, 10) : 'N/A'}
                    {order.collectionTime && <span> at {order.collectionTime}</span>}
                </p>
                <p>{order.items.map((item,index)=>{
                  let itemText = item.name;
                  
                  // Add side dishes information if present
                  if (item.sideDishes && item.sideDishes.length > 0) {
                    const sideDishNames = item.sideDishes.map(sd => sd.name).join(', ');
                    itemText += ` (with ${sideDishNames})`;
                  }
                  
                  itemText += ` x ${item.quantity}`;
                  
                  if (index === order.items.length-1) {
                    return itemText;
                  } else {
                    return itemText + ", ";
                  }
                })}</p>
                <p>{currency}{Number(order.amount).toFixed(2)}</p>
                <p>Items: {order.items.length}</p>
                <p>
                  <span 
                    style={{ 
                      color: getStatusColor(order.status),
                      fontSize: '1.2em',
                      marginRight: '8px'
                    }}
                  >
                    &#x25cf;
                  </span> 
                  <b>{order.status}</b>
                </p>
                <button className='my-orders-remove-btn' onClick={() => deleteOrder(order._id)}>Remove Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
