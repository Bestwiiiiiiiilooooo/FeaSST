import { useEffect, useState, useCallback } from 'react'
import './ExploreMenu.css'
import { assets } from '../../assets/assets'
import PropTypes from 'prop-types'

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

  // Environment-based URL configuration
  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // Default to localhost for development
    return "http://localhost:4000";
  };

  const url = getApiUrl();

  const fetchMenu = useCallback(async () => {
    try {
      console.log('ExploreMenu - Fetching menu from:', url + "/api/menu/list");
      const response = await fetch(url + "/api/menu/list");
      const data = await response.json();
      console.log('ExploreMenu - Menu response:', data);
      setMenuList(data.data || []);
    } catch (error) {
      console.error('ExploreMenu - Error fetching menu:', error);
    }
  }, [url]);

  useEffect(() => {
    fetchMenu();
    const interval = setInterval(fetchMenu, 5000);
    return () => clearInterval(interval);
  }, [fetchMenu]);

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

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default ExploreMenu
