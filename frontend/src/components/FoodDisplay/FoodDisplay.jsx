import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'
import PropTypes from 'prop-types'
import { useContext } from 'react'

const FoodDisplay = ({category}) => {

  const {food_list} = useContext(StoreContext);

  console.log('FoodDisplay - category:', category);
  console.log('FoodDisplay - food_list:', food_list);
  console.log('FoodDisplay - food_list length:', food_list.length);

  return (
    <div className='food-display' id='food-display'>
      {category === 'All' && <h2>Top dishes near you</h2>}
      <div className='food-display-list'>

        {food_list.map((item)=>{
          console.log('Processing item:', item);
          console.log('Item category:', item.category, 'Selected category:', category);
          console.log('Item isAvailable:', item.isAvailable);
          if ((category==="All" || category===item.category) && item.isAvailable !== false) {
            console.log('Item will be displayed:', item.name);
            return <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} sideDishes={item.sideDishes} isAvailable={item.isAvailable}/>
          } else {
            console.log('Item filtered out:', item.name);
            return null;
          }
        })}
      </div>
    </div>
  )
}

FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay
