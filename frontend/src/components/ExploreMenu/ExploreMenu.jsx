import { useEffect, useState, useCallback, useContext } from 'react'
import './ExploreMenu.css'
import { assets } from '../../assets/assets'
import PropTypes from 'prop-types'
import { StoreContext } from '../../Context/StoreContext'

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
  const { url } = useContext(StoreContext);

  const fetchMenu = useCallback(async () => {
    try {
      const apiUrl = url + "/api/menu/list";
      console.log('ExploreMenu - Fetching menu from:', apiUrl);
      const response = await fetch(apiUrl);
      console.log('ExploreMenu - Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }
      
      const data = await response.json();
      console.log('ExploreMenu - Menu response:', data);
      setMenuList(data.data || []);
    } catch (error) {
      console.error('ExploreMenu - Error fetching menu:', error);
      // Fallback to static menu if API fails
      setMenuList([
        { menu_name: 'Store 1', menu_image: 'menu_1.png' },
        { menu_name: 'Store 2', menu_image: 'menu_2.png' },
        { menu_name: 'Store 3', menu_image: 'menu_3.png' },
        { menu_name: 'Store 4', menu_image: 'menu_4.png' },
        { menu_name: 'Store 5', menu_image: 'menu_5.png' },
        { menu_name: 'Store 6', menu_image: 'menu_6.png' },
        { menu_name: 'Store 7', menu_image: 'menu_7.png' },
        { menu_name: 'Store 8', menu_image: 'menu_8.png' },
      ]);
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
