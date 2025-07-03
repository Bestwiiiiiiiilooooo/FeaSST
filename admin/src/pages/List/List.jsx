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

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  useEffect(() => {
    localStorage.setItem('admin_selectedStore', selectedStore);
  }, [selectedStore]);

  return (
    <div className='list add flex-col'>
      <p>{t('listItems')}</p>
      <div style={{ marginBottom: 20 }}>
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
      <div className='list-table'>
        <div className="list-table-format title">
          <b>{t('image') || 'Image'}</b>
          <b>{t('productName') || 'Name'}</b>
          <b>{t('storeNumber') || 'Category'}</b>
          <b>{t('price') || 'Price'}</b>
          <b>{t('action') || 'Action'}</b>
        </div>
        {list
          .filter(item => !selectedStore || item.category === selectedStore)
          .map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency}{item.price}</p>
                <p className='cursor' onClick={() => removeFood(item._id)}>{t('remove')}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default List
