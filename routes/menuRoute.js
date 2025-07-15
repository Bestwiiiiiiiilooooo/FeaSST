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
  res.json({ data: menu_list });
});

export default router; 