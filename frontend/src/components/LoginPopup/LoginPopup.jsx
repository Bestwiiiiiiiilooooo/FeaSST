import { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { auth, googleProvider } from '../../firebase'
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth"
import PropTypes from 'prop-types'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url, loadCartData, setUserId, setFirebaseUser, setUserEmail } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");
    const [allowedDomains, setAllowedDomains] = useState([]);
    const [domainMessage, setDomainMessage] = useState("");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    // Fetch allowed domains on component mount
    useEffect(() => {
        const fetchAllowedDomains = async () => {
            try {
                const response = await axios.get(url + "/api/user/allowed-domains");
                if (response.data.success) {
                    setAllowedDomains(response.data.domains);
                    setDomainMessage(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching allowed domains:", error);
            }
        };
        fetchAllowedDomains();
    }, [url]);

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }
        const response = await axios.post(new_url, data);
        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            loadCartData({token:response.data.token})
            setUserEmail(data.email);
            // Fetch userId from backend (manual login)
            try {
                const userRes = await axios.post(url + "/api/user/findOrCreate", {
                    email: data.email,
                    name: data.name || "",
                    firebaseUid: null // Not a Firebase login
                });
                if (userRes.data.success) {
                    setUserId(userRes.data.userId);
                }
            } catch (err) { /* handle error if needed */ }
            setShowLogin(false)
        }
        else {
            toast.error(response.data.message)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            setFirebaseUser(user); // Immediately update context
            const idToken = await user.getIdToken();
            setToken(idToken);
            await loadCartData({ token: idToken });
            // Call backend to find or create user in MongoDB
            const userRes = await axios.post(url + "/api/user/findOrCreate", {
                firebaseUid: user.uid,
                email: user.email,
                name: user.displayName || ""
            });
            if (userRes.data.success) {
                setUserId(userRes.data.userId);
                setShowLogin(false);
            } else {
                toast.error("Failed to register user in database");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handlePasswordReset = async () => {
        if (!data.email) {
            toast.error("Please enter your email to reset password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, data.email);
            toast.success("Password reset email sent!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                {domainMessage && (
                    <div className="domain-info">
                        <p className="domain-message">{domainMessage}</p>
                        {allowedDomains.length > 0 && (
                            <div className="allowed-domains">
                                <small>Allowed domains: {allowedDomains.join(', ')}</small>
                            </div>
                        )}
                    </div>
                )}
                <button>{currState === "Login" ? "Login" : "Create account"}</button>
                <button type="button" onClick={handleGoogleSignIn} className="google-signin-btn">
                    Sign in with Google
                </button>
                {currState === "Login" && (
                    <p className="forgot-password" onClick={handlePasswordReset}>
                        Forgot password?
                    </p>
                )}
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

LoginPopup.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopup
