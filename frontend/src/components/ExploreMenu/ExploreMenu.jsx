import React, { useEffect, useState } from 'react'
import './ExploreMenu.css'
import { assets } from '../../assets/assets'

const imageMap = {
  'menu_1.png': assets.menu_1,
  'menu_2.png': assets.menu_2,
  'menu_3.png': assets.menu_3,
  'menu_4.png': assets.menu_4,
  'menu_5.png': assets.menu_5,
  'menu_6.png': assets.menu_6,
  'menu_7.png': assets.menu_7,
  'menu_8.png': assets.menu_8,
}

const ExploreMenu = ({category,setCategory}) => {
  const [menuList, setMenuList] = useState([]);

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/menu/list');
      const data = await response.json();
      setMenuList(data.data || []);
    } catch (error) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchMenu();
    const interval = setInterval(fetchMenu, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className="explore-menu-list">
        {menuList.map((item,index)=>{
            return (
                <div onClick={() => {
                  setCategory(prev => prev === item.menu_name ? "All" : item.menu_name);
                  fetchMenu();
                }} key={index} className='explore-menu-list-item'>
                    <img src={imageMap[item.menu_image]} className={category===item.menu_name?"active":""} alt={item.menu_name} />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
