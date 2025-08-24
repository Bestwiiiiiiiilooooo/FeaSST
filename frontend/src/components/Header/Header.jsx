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

    // Multiple image sources with fallbacks
    const imageSources = [
        '/header_banner.png',
        '/Feasst_banner.png', 
        '/header_img.png'
    ];

    const handleImageError = (e) => {
        const currentSrc = e.target.src;
        const currentIndex = imageSources.findIndex(src => currentSrc.includes(src.split('/').pop()));
        
        if (currentIndex < imageSources.length - 1) {
            const nextImage = imageSources[currentIndex + 1];
            console.log(`Trying next image: ${nextImage}`);
            e.target.src = nextImage;
        } else {
            console.error('All banner images failed to load');
            // Show a colored background as last resort
            e.target.style.display = 'none';
            e.target.parentElement.style.backgroundColor = '#4CAF50';
        }
    };

    return (
        <div className='header'>
            <img 
                src={imageSources[0]}
                alt="FeaSST Banner" 
                className="header-background"
                onError={handleImageError}
                onLoad={(e) => {
                    console.log('Banner image loaded successfully:', e.target.src);
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
