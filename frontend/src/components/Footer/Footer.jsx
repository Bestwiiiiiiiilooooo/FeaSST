import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="FeaSST Logo" />
            <p>FeaSST is your trusted food delivery partner, bringing the fastest and most reliable food delivery service to your doorstep. With FeaSST, you can order delicious meals online and enjoy quick, safe delivery. FeaSST makes food ordering simple, fast, and convenient for everyone.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="FeaSST Facebook" />
                <img src={assets.twitter_icon} alt="FeaSST Twitter" />
                <img src={assets.linkedin_icon} alt="FeaSST LinkedIn" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>FEASST COMPANY</h2>
            <ul>
                <li>FeaSST Home</li>
                <li>About FeaSST</li>
                <li>FeaSST Privacy Policy</li>
                <li>FeaSST Terms of Service</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>CONTACT FEASST</h2>
            <ul>
                <li>+1-212-456-7890</li>
                <li>contact@feasst.com</li>
                <li>support@feasst.com</li>
            </ul>
        </div>
      </div>
      <hr />
                  <p className="footer-copyright">Copyright 2024 © FeaSST.com - All Right Reserved. FeaSST - Fast Food Delivery Service.</p>
    </div>
  )
}

export default Footer
