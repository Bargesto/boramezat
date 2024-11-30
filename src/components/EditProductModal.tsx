import { useState, useRef } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { Product, ProductSize, ShoeSize } from '../types';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onEdit: (productId: string, updatedProduct: Omit<Product, 'id'>) => void;
}

export function EditProductModal({ product, onClose, onEdit }: EditProductModalProps) {
  // ... all state declarations remain the same ...

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProduct = {
      name,
      price: parseFloat(price),
      image,
      type,
      sizes: type === 'clothing'
        ? {
            'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0, '4XL': 0, '5XL': 0, '6XL': 0,
            '36': 0, '37': 0, '38': 0, '39': 0, '40': 0, '41': 0, '42': 0, '43': 0, '44': 0, '45': 0,
            ...Object.fromEntries(currentSizes.map(size => [size, parseInt(sizes[size]?.toString() || '0')]))
          }
        : {
            'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0, '4XL': 0, '5XL': 0, '6XL': 0,
            '36': 0, '37': 0, '38': 0, '39': 0, '40': 0, '41': 0, '42': 0, '43': 0, '44': 0, '45': 0,
            ...Object.fromEntries(currentSizes.map(size => [size, parseInt(sizes[size]?.toString() || '0')]))
          },
      createdAt: product.createdAt
    };

    onEdit(product.id, updatedProduct);
    onClose();
  };

  // ... rest of the component remains exactly the same ...
}