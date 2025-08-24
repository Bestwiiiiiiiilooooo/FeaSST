import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../LanguageContext'

const Sidebar = () => {
  const { t } = useLanguage();
  
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>{t('addItem')}</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>{t('listItems')}</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>{t('orders')}</p>
        </NavLink>
        <NavLink to='/collection' className="sidebar-option">
            <img src={assets.parcel_icon} alt="" />
            <p>{t('collection')}</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
