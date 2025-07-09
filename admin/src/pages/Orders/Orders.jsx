import React, { useEffect, useState, useRef } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import dayjs from 'dayjs';
import { useLanguage } from '../../LanguageContext';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';

const STALLS = [
  { id: 'Store 1', name: 'Store 1' },
  { id: 'Store 2', name: 'Store 2' },
  { id: 'Store 3', name: 'Store 3' },
  { id: 'Store 4', name: 'Store 4' },
  { id: 'Store 5', name: 'Store 5' },
  { id: 'Store 6', name: 'Store 6' },
  { id: 'Store 7', name: 'Store 7' },
  { id: 'Store 8', name: 'Store 8' },
];

const Order = () => {
  const { t } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [selectedStall, setSelectedStall] = useState(() => {
    return localStorage.getItem('admin_selectedStall') || '';
  });

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    }
    else {
      toast.error("Error")
    }
  }

  // Update 'now' every second for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [])

  // When the stall filter changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('admin_selectedStall', selectedStall);
  }, [selectedStall]);

  // Filter by stall (case-insensitive)
  const filteredOrders = selectedStall
    ? orders.filter(order => {
        console.log('Comparing:', order.stallId, selectedStall);
        return order.stallId && order.stallId.toLowerCase() === selectedStall.toLowerCase();
      })
    : orders;

  // Calculate visible orders and countdown
  const visibleOrders = filteredOrders.filter(order => {
    if (order.status === 'Ready to Collect' || order.status === 'Rejected') {
      const updatedAt = dayjs(order.statusUpdatedAt);
      const secondsElapsed = dayjs(now).diff(updatedAt, 'second');
      return secondsElapsed < 30;
    }
    return true;
  });

  const getCountdown = (order) => {
    if (order.status === 'Ready to Collect' || order.status === 'Rejected') {
      const updatedAt = dayjs(order.statusUpdatedAt);
      const secondsElapsed = dayjs(now).diff(updatedAt, 'second');
      return Math.max(0, 30 - secondsElapsed);
    }
    return null;
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: newStatus
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  const deleteOrder = async (orderId) => {
    const response = await axios.post(`${url}/api/order/delete`, { orderId });
    if (response.data.success) {
      toast.success("Order cleared");
      await fetchAllOrders();
    } else {
      toast.error("Failed to clear order");
    }
  }

  const clearAllOrders = async () => {
    const response = await axios.post(`${url}/api/order/clearall`);
    if (response.data.success) {
      toast.success("All orders cleared");
      await fetchAllOrders();
    } else {
      toast.error("Failed to clear all orders");
    }
  }

  return (
    <div className='order add'>
      <h3>{t('orderPage')}</h3>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="stall-select">{t('filterByStall')} </label>
        <select
          id="stall-select"
          value={selectedStall}
          onChange={e => setSelectedStall(e.target.value)}
        >
          <option value="">-- All Stalls --</option>
          {STALLS.map(stall => (
            <option key={stall.id} value={stall.id}>{stall.name}</option>
          ))}
        </select>
      </div>
      <button className='order-clearall-btn' onClick={clearAllOrders}>{t('clearAllOrders')}</button>
      <div className="order-list">
        {visibleOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-number'>{t('orderNo')} {order.orderNumber}</p>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  let itemText = item.name;
                  
                  // Add side dishes information if present
                  if (item.sideDishes && item.sideDishes.length > 0) {
                    const sideDishNames = item.sideDishes.map(sd => sd.name).join(', ');
                    itemText += ` (with ${sideDishNames})`;
                  }
                  
                  itemText += ` x ${item.quantity}`;
                  
                  if (index === order.items.length - 1) {
                    return itemText;
                  } else {
                    return itemText + ", ";
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.name}</p>
              <div className='order-item-address'>
                <p>Class: {order.address.class}</p>
                <p>Secondary level: {order.address.secondaryLevel}</p>
                <p>Email: {order.address.email}</p>
              </div>
              <p><b>Collection Date:</b> {order.collectedDate ? order.collectedDate.slice(0, 10) : 'N/A'}</p>
              {/* <p className='order-item-phone'>{order.address.phone}</p> */}
            </div>
            <p>{t('items')}: {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <div className="order-status-container">
              <CustomDropdown
                options={["Food Processing", "Ready to Collect", "Rejected"]}
                value={order.status}
                onChange={(newStatus) => statusHandler({ target: { value: newStatus } }, order._id)}
              />
              {(order.status === 'Ready to Collect' || order.status === 'Rejected') && getCountdown(order) > 0 && (
                <p className="disappearing-msg" style={{ color: 'tomato', fontWeight: 'bold', marginLeft: 8 }}>
                  Disappearing in {getCountdown(order)}s
                </p>
              )}
            </div>
            <button className='order-clear-btn' onClick={() => deleteOrder(order._id)}>{t('remove')}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
