import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Basic T-Shirt',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    type: 'clothing',
    sizes: {
      'S': 10, 'M': 15, 'L': 20, 'XL': 15, 'XXL': 10, 'XXXL': 5, '4XL': 0, '5XL': 0, '6XL': 0,
      '36': 0, '37': 0, '38': 0, '39': 0, '40': 0, '41': 0, '42': 0, '43': 0, '44': 0, '45': 0
    },
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Classic Sneakers',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    type: 'shoes',
    sizes: {
      'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0, '4XL': 0, '5XL': 0, '6XL': 0,
      '36': 5, '37': 8, '38': 10, '39': 12, '40': 15, '41': 15, '42': 12, '43': 10, '44': 8, '45': 5
    },
    createdAt: Date.now() - 1000,
  },
];