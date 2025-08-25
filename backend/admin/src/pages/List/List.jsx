import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLanguage } from '../../LanguageContext';

const STORES = [
  'Store 1', 'Store 2', 'Store 3', 'Store 4', 'Store 5', 'Store 6', 'Store 7', 'Store 8'
];

const List = () => {
  const { t } = useLanguage();
  const [list, setList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(() => {
    return localStorage.getItem('admin_selectedStore') || '';
  });
  const [showSoldOut, setShowSoldOut] = useState(true);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error(t('errorOccurred'))
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(t('itemRemovedSuccess'));
    }
    else {
      toast.error(t('errorOccurred'))
    }
  }

  const toggleAvailability = async (foodId) => {
    const response = await axios.post(`${url}/api/food/toggle-availability`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      // Translate the backend message
      let message = response.data.message;
      if (message.includes('Food marked as Available')) {
        message = t('foodMarkedAsAvailable');
      } else if (message.includes('Food marked as Sold Out')) {
        message = t('foodMarkedAsSoldOut');
      }
      toast.success(message);
    }
    else {
      toast.error(t('errorOccurred'))
    }
  }

  useEffect(() => {
    fetchList();
    const interval = setInterval(fetchList, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    localStorage.setItem('admin_selectedStore', selectedStore);
  }, [selectedStore]);

  return (
    <div className='list add flex-col'>
      <p>{t('listItems')}</p>
      <div style={{ marginBottom: 20, display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label htmlFor="store-select">{t('filterByStall') || 'Filter by Store:'} </label>
          <select
            id="store-select"
            value={selectedStore}
            onChange={e => setSelectedStore(e.target.value)}
          >
            <option value="">-- {t('allStores') || 'All Stores'} --</option>
            {STORES.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showSoldOut}
              onChange={e => setShowSoldOut(e.target.checked)}
            />
            {t('showSoldOut') || 'Show Sold Out Items'}
          </label>
        </div>
      </div>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>{t('image') || 'Image'}</b>
          <b>{t('productName') || 'Name'}</b>
          <b>{t('storeNumber') || 'Category'}</b>
          <b>{t('price') || 'Price'}</b>
          <b>{t('promoCode') || 'Promo Code'}</b>
          <b>{t('availability') || 'Availability'}</b>
          <b>{t('action') || 'Action'}</b>
        </div>
        {list
          .filter(item => !selectedStore || item.category === selectedStore)
          .filter(item => showSoldOut || item.isAvailable !== false)
          .map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency}{item.price}</p>
                <p>
                  {item.promoCode ? (
                    <span>
                      <strong>{item.promoCode}</strong>
                      {item.promoDiscount && (
                        <span style={{ color: '#28a745', fontSize: '0.9em' }}>
                          {' '}(-{item.promoDiscount}%)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
                      {t('noPromoCode') || 'No promo code'}
                    </span>
                  )}
                </p>
                <p>
                  <span 
                    className={`availability-status ${item.isAvailable ? 'available' : 'sold-out'}`}
                    onClick={() => toggleAvailability(item._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.isAvailable ? (t('available') || 'Available') : (t('soldOut') || 'Sold Out')}
                  </span>
                </p>
                <p className='cursor' onClick={() => removeFood(item._id)}>{t('remove')}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default List
