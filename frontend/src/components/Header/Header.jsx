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

    return (
        <div className='header'>
            <img 
                src="/header_banner.png" 
                alt="FeaSST Banner" 
                className="header-background"
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
