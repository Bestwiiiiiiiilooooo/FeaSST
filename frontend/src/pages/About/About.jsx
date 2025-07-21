import './About.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const About = () => {
  return (
    <>
      <div className='app'>
        <Navbar />
        <div className='about-page'>
          <div className='about-hero'>
            <h1>About FeaSST - Your Fast Food Delivery Partner</h1>
            <p>FeaSST is revolutionizing the food delivery industry with our commitment to speed, quality, and customer satisfaction.</p>
          </div>
          
          <div className='about-content'>
            <section className='about-section'>
              <h2>What is FeaSST?</h2>
              <p>FeaSST is a premier food delivery service that connects you with the best restaurants and food providers in your area. Our name &quot;FeaSST&quot; represents our core promise: <strong>Fast, Efficient, Affordable, Safe, Simple, and Trustworthy</strong> food delivery.</p>
            </section>

            <section className='about-section'>
              <h2>Why Choose FeaSST?</h2>
              <div className='features-grid'>
                <div className='feature'>
                  <h3>🚀 Fastest Delivery</h3>
                  <p>FeaSST guarantees the fastest food delivery in your area. We optimize routes and partner with the best delivery professionals to ensure your food arrives quickly and fresh.</p>
                </div>
                <div className='feature'>
                  <h3>🍽️ Quality Food</h3>
                  <p>FeaSST partners only with top-rated restaurants and food providers. Every meal delivered through FeaSST meets our high quality standards.</p>
                </div>
                <div className='feature'>
                  <h3>💳 Easy Ordering</h3>
                  <p>FeaSST&apos;s user-friendly platform makes ordering food simple and convenient. Browse menus, customize orders, and track deliveries in real-time.</p>
                </div>
                <div className='feature'>
                  <h3>🛡️ Safe & Secure</h3>
                  <p>FeaSST prioritizes your safety with contactless delivery options, secure payment processing, and strict hygiene protocols.</p>
                </div>
              </div>
            </section>

            <section className='about-section'>
              <h2>FeaSST&apos;s Mission</h2>
              <p>At FeaSST, our mission is to make food delivery accessible, reliable, and enjoyable for everyone. We believe that great food should be just a click away, and FeaSST makes that possible with our innovative platform and dedicated service.</p>
            </section>

            <section className='about-section'>
              <h2>FeaSST&apos;s Values</h2>
              <ul>
                <li><strong>Speed:</strong> FeaSST delivers faster than anyone else</li>
                <li><strong>Quality:</strong> FeaSST never compromises on food quality</li>
                <li><strong>Reliability:</strong> FeaSST is your trusted delivery partner</li>
                <li><strong>Innovation:</strong> FeaSST continuously improves our service</li>
                <li><strong>Customer First:</strong> FeaSST puts our customers first in everything we do</li>
              </ul>
            </section>

            <section className='about-section'>
              <h2>Join the FeaSST Family</h2>
              <p>Experience the difference that FeaSST makes in food delivery. Whether you&apos;re ordering for yourself, your family, or your team, FeaSST is here to serve you with the fastest, most reliable food delivery service available.</p>
              <p>Start your FeaSST journey today and discover why thousands of customers choose FeaSST for their food delivery needs.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About 