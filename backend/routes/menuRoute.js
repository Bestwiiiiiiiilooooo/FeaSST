import { Router } from 'express';

const router = Router();

const menu_list = [
  { menu_name: 'Store 1', menu_image: 'menu_1.png' },
  { menu_name: 'Store 2', menu_image: 'menu_2.png' },
  { menu_name: 'Store 3', menu_image: 'menu_3.png' },
  { menu_name: 'Store 4', menu_image: 'menu_4.png' },
  { menu_name: 'Store 5', menu_image: 'menu_5.png' },
  { menu_name: 'Store 6', menu_image: 'menu_6.png' },
  { menu_name: 'Store 7', menu_image: 'menu_7.png' },
  { menu_name: 'Store 8', menu_image: 'menu_8.png' },
];

router.get('/list', (req, res) => {
  console.log('🚨 Menu route hit: /api/menu/list');
  console.log('🚨 Request URL:', req.originalUrl);
  console.log('🚨 Request method:', req.method);
  res.json({ 
    success: true,
    data: menu_list,
    message: 'Menu data retrieved successfully'
  });
});

export default router; 