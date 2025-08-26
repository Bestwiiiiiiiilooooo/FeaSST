import './Header.css'

const Header = () => {
    const scrollToMenu = () => {
        const menuSection = document.getElementById('explore-menu');
        if (menuSection) {
            menuSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Simple cache busting - just use timestamp to prevent browser caching
    const timestamp = Date.now();
    const primaryBanner = `/Feasst_banner2.png?t=${timestamp}`;
    const fallbackBanner = `/Feasst_banner.png?t=${timestamp}`;

    return (
        <div className='header'>
            {/* Banner image with simple cache busting */}
            <img 
                src={primaryBanner}
                alt="FeaSST Banner" 
                className="header-background"
                onError={(e) => {
                    console.error('❌ Primary banner failed:', e.target.src);
                    console.log('🔄 Trying fallback banner...');
                    e.target.src = fallbackBanner;
                }}
                onLoad={(e) => {
                    console.log('✅ Primary banner loaded successfully:', e.target.src);
                }}

            />
            
            <div className='header-contents'>
                <h1>FeaSST - Order Your Favourite Food Here</h1>
                <p>Welcome to FeaSST, your premier food delivery service. Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. FeaSST&apos;s mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time. Experience the fastest food delivery with FeaSST.</p>
                <button onClick={scrollToMenu}>View FeaSST Menu</button>
            </div>
        </div>
    )
}

export default Header
