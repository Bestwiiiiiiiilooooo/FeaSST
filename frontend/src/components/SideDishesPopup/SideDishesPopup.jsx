import React, { useState, useContext, useCallback, useEffect } from 'react';
import './SideDishesPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const SideDishesPopup = ({ food, onClose, onAddToCart }) => {
    const [selectedSideDishes, setSelectedSideDishes] = useState([]);
    const { currency } = useContext(StoreContext);

    const toggleSideDish = useCallback((sideDish) => {
        setSelectedSideDishes(prev => {
            const isSelected = prev.find(sd => sd.name === sideDish.name);
            if (isSelected) {
                return prev.filter(sd => sd.name !== sideDish.name);
            } else {
                return [...prev, sideDish];
            }
        });
    }, []);

    const handleAddToCart = useCallback(() => {
        onAddToCart(food, selectedSideDishes);
        onClose();
    }, [onAddToCart, food, selectedSideDishes, onClose]);

    const getTotalPrice = useCallback(() => {
        const sideDishesTotal = selectedSideDishes.reduce((sum, sd) => sum + sd.price, 0);
        return food.price + sideDishesTotal;
    }, [selectedSideDishes, food.price]);

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handlePopupClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    // Prevent body scroll when popup is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="side-dishes-overlay" onClick={handleOverlayClick}>
            <div className="side-dishes-popup" onClick={handlePopupClick}>
                <div className="popup-header">
                    <h2>{food.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="food-details">
                    <img src={`http://localhost:4000/images/${food.image}`} alt={food.name} />
                    <div className="food-info">
                        <p className="description">{food.description}</p>
                        <p className="base-price">Base Price: {currency}{food.price}</p>
                    </div>
                </div>

                {food.sideDishes && food.sideDishes.length > 0 ? (
                    <div className="side-dishes-section">
                        <h3>Add Side Dishes (Optional)</h3>
                        <div className="side-dishes-list">
                            {food.sideDishes.map((sideDish, index) => (
                                <div 
                                    key={index} 
                                    className={`side-dish-item ${selectedSideDishes.find(sd => sd.name === sideDish.name) ? 'selected' : ''}`}
                                    onClick={() => toggleSideDish(sideDish)}
                                >
                                    <div className="side-dish-info">
                                        <h4>{sideDish.name}</h4>
                                        {sideDish.description && <p>{sideDish.description}</p>}
                                        <span className="side-dish-price">{currency}{sideDish.price}</span>
                                    </div>
                                    <div className="checkbox">
                                        <img 
                                            src={selectedSideDishes.find(sd => sd.name === sideDish.name) ? assets.checked : assets.un_checked} 
                                            alt="" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="no-side-dishes">
                        <p>No side dishes available for this item</p>
                    </div>
                )}

                <div className="popup-footer">
                    <div className="total-price">
                        <span>Total: {currency}{getTotalPrice()}</span>
                    </div>
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideDishesPopup; 