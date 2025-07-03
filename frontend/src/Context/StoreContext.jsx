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

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token && userIdState) {
            await axios.post(
                url + "/api/cart/add",
                { itemId, userId: userIdState },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token && userIdState) {
            await axios.post(
                url + "/api/cart/remove",
                { itemId, userId: userIdState },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
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
        return () => unsubscribe();
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