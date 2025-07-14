import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import './Collection.css';
import { useLanguage } from '../../LanguageContext';

const Collection = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);

  const fetchCollectionOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if (response.data.success) {
      setOrders(response.data.data.filter(order => order.status === 'Ready to Collect').reverse());
    }
  };

  const deleteOrder = async (orderId) => {
    const response = await axios.post(`${url}/api/order/delete`, { orderId });
    if (response.data.success) {
      fetchCollectionOrders();
    }
  };

  useEffect(() => {
    fetchCollectionOrders();
    const interval = setInterval(fetchCollectionOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='collection add'>
      <h3>{t('collection')}</h3>
      <div className="order-list">
        {orders.length === 0 && <p>{t('noOrdersReady') || 'No orders ready to collect.'}</p>}
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-number'>{t('orderNo')} {order.orderNumber}</p>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.name}</p>
              <div className='order-item-address'>
                <p>Class: {order.address.class}</p>
                <p>Secondary level: {order.address.secondaryLevel}</p>
                <p>Email: {order.address.email}</p>
                <p><b>Collection:</b> {order.collectedDate ? order.collectedDate.slice(0, 10) : 'N/A'}
                  {order.collectionTime && <span> at {order.collectionTime}</span>}
                </p>
              </div>
            </div>
            <p>{t('items')}: {order.items.length}</p>
            <p>{currency}{order.amount}</p>
            <button className='order-clear-btn' onClick={() => deleteOrder(order._id)}>{t('remove')}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection; 