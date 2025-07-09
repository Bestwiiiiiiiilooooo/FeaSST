import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [userIdState, setUserIdState] = useState(() => localStorage.getItem('userId') || "");
    const currency = "$";
    const deliveryCharge = 5;
    const [userEmail, setUserEmail] = useState("");

    const addToCart = async (itemId, sideDishes = []) => {
        // Create a more robust cart key using base64 encoding to avoid JSON parsing issues
        let cartKey = itemId;
        if (sideDishes.length > 0) {
            const sideDishesString = JSON.stringify(sideDishes);
            const encodedSideDishes = btoa(sideDishesString); // Base64 encode to avoid special characters
            cartKey = `${itemId}_${encodedSideDishes}`;
        }
        
        if (!cartItems[cartKey]) {
            setCartItems((prev) => ({ ...prev, [cartKey]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [cartKey]: prev[cartKey] + 1 }));
        }
        if (token && userIdState) {
            await axios.post(
                url + "/api/cart/add",
                { itemId, userId: userIdState, sideDishes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    }

    const removeFromCart = async (cartKey) => {
        setCartItems((prev) => ({ ...prev, [cartKey]: prev[cartKey] - 1 }))
        if (token && userIdState) {
            // Extract itemId from cartKey (remove side dishes part if present)
            const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
            await axios.post(
                url + "/api/cart/remove",
                { itemId, userId: userIdState },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        console.log('Calculating cart total...');
        console.log('Cart items:', cartItems);
        console.log('Food list:', food_list);
        
        for (const cartKey in cartItems) {
            try {
              if (cartItems[cartKey] > 0) {
                // Extract itemId from cartKey (remove side dishes part if present)
                const itemId = cartKey.includes('_') ? cartKey.split('_')[0] : cartKey;
                let itemInfo = food_list.find((product) => product._id === itemId);
                
                console.log(`Processing cartKey: ${cartKey}, itemId: ${itemId}, quantity: ${cartItems[cartKey]}`);
                console.log('Found item:', itemInfo);
                
                if (itemInfo) {
                    let itemTotal = itemInfo.price;
                    console.log(`Base price: ${itemTotal}`);
                    
                    // Add side dishes price if present
                    if (cartKey.includes('_')) {
                        try {
                            // Find the first underscore and get everything after it
                            const underscoreIndex = cartKey.indexOf('_');
                            const encodedSideDishes = cartKey.substring(underscoreIndex + 1);
                            const sideDishesJson = atob(encodedSideDishes); // Base64 decode
                            const sideDishes = JSON.parse(sideDishesJson);
                            console.log('Side dishes:', sideDishes);
                            const sideDishesTotal = sideDishes.reduce((sum, sd) => sum + sd.price, 0);
                            console.log('Side dishes total:', sideDishesTotal);
                            itemTotal += sideDishesTotal;
                        } catch (e) {
                            console.error('Error parsing side dishes:', e);
                            console.error('CartKey:', cartKey);
                            console.error('Attempted to parse:', cartKey.split('_')[1]);
                        }
                    }
                    
                    const entryTotal = itemTotal * cartItems[cartKey];
                    console.log(`Entry total: ${entryTotal}`);
                    totalAmount += entryTotal;
                }
            }  
            } catch (error) {
                console.error('Error calculating total:', error);
            }
            
        }
        console.log('Final total amount:', totalAmount);
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async ({ token, userId }) => {
        if (!userId) return setCartItems({});
        const response = await axios.post(
            url + "/api/cart/get",
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data.cartData || {});
    }

    const clearCart = async () => {
        setCartItems({});
        if (token && userIdState) {
            await axios.post(
                url + "/api/cart/clear",
                { userId: userIdState },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    }

    const setUserId = (id) => {
        setUserIdState(id);
        if (id) {
            localStorage.setItem('userId', id);
        } else {
            localStorage.removeItem('userId');
        }
    };

    useEffect(() => {
        fetchFoodList();
        
        // Set up auto-refresh every 10 seconds
        const refreshInterval = setInterval(fetchFoodList, 10000);
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (user) {
                const idToken = await user.getIdToken();
                setToken(idToken);
                // Fetch userId from backend for Firebase user
                try {
                    const userRes = await axios.post(
                        url + "/api/user/findOrCreate",
                        {
                            firebaseUid: user.uid,
                            email: user.email,
                            name: user.displayName || ""
                        }
                    );
                    if (userRes.data.success) {
                        setUserId(userRes.data.userId);
                        await loadCartData({ token: idToken, userId: userRes.data.userId });
                    } else {
                        setUserId("");
                        setCartItems({});
                    }
                } catch (err) {
                    setUserId("");
                    setCartItems({});
                }
            } else {
                setToken("");
                setCartItems({});
                setUserId("");
            }
        });
        
        // Cleanup function to clear the interval and unsubscribe
        return () => {
            clearInterval(refreshInterval);
            unsubscribe();
        };
    }, []);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        clearCart,
        currency,
        deliveryCharge,
        firebaseUser,
        setFirebaseUser,
        userId: userIdState,
        setUserId,
        userEmail,
        setUserEmail
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;