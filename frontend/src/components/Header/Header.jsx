import './Header.css'
import { useState, useEffect } from 'react';

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

    // Force image loading with immediate visual feedback
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('/header_banner.png');

    // Test image loading on component mount
    useEffect(() => {
        console.log('🔍 Header component mounted, testing image loading...');
        
        // Test if images are accessible
        const testImage = new Image();
        testImage.onload = () => {
            console.log('✅ Test image loaded successfully:', testImage.src);
        };
        testImage.onerror = () => {
            console.log('❌ Test image failed to load:', testImage.src);
        };
        
        // Test primary image
        testImage.src = '/header_banner.png';
    }, []);

    const handleImageLoad = (e) => {
        console.log('🎉 BANNER IMAGE LOADED SUCCESSFULLY:', e.target.src);
        setImageLoaded(true);
        setImageError(false);
        setCurrentImageSrc(e.target.src);
    };

    const handleImageError = (e) => {
        console.error('❌ BANNER IMAGE FAILED:', e.target.src);
        setImageError(true);
        
        // Try alternative images immediately
        if (e.target.src.includes('header_banner.png')) {
            console.log('🔄 Trying Feasst_banner.png...');
            setCurrentImageSrc('/Feasst_banner.png');
            e.target.src = '/Feasst_banner.png';
        } else if (e.target.src.includes('Feasst_banner.png')) {
            console.log('🔄 Trying header_img.png...');
            setCurrentImageSrc('/header_img.png');
            e.target.src = '/header_img.png';
        } else {
            console.log('🔄 Trying header_banner.png as last resort...');
            setCurrentImageSrc('/header_banner.png');
            e.target.src = '/header_banner.png';
        }
    };

    return (
        <div className='header'>
            {/* Debug info - remove after fixing */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 10,
                fontFamily: 'monospace'
            }}>
                🐛 Debug: {imageLoaded ? '✅ Loaded' : imageError ? '❌ Error' : '⏳ Loading'}<br/>
                📍 Image: {currentImageSrc}<br/>
                🎯 Status: {imageLoaded ? 'SUCCESS' : imageError ? 'FALLBACK' : 'LOADING'}
            </div>

            {/* Show loading state */}
            {!imageLoaded && !imageError && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    zIndex: 1
                }}>
                    🍕 Loading FeaSST Banner...
                </div>
            )}
            
            {/* Show error state */}
            {imageError && !imageLoaded && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#FF9800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    zIndex: 1
                }}>
                    🚨 Banner Loading Failed - Using Fallback
                </div>
            )}

            <img 
                src={currentImageSrc}
                alt="FeaSST Banner" 
                className="header-background"
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out'
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
