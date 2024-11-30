import { useState, useRef } from 'react';
import { X, Upload, Camera, Link } from 'lucide-react';
import { Product, ProductSize, ShoeSize } from '../types';

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

type ProductType = 'clothing' | 'shoes';
type SizeRecord = Record<ProductSize | ShoeSize, number>;

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [type, setType] = useState<ProductType>('clothing');
  const [currentSizes, setCurrentSizes] = useState<Array<ProductSize | ShoeSize>>([]);
  const [sizes, setSizes] = useState<SizeRecord>({
    'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0, '4XL': 0, '5XL': 0, '6XL': 0,
    '36': 0, '37': 0, '38': 0, '39': 0, '40': 0, '41': 0, '42': 0, '43': 0, '44': 0, '45': 0
  });

  const clothingSizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL'];
  const shoeSizes: ShoeSize[] = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSizeToggle = (size: ProductSize | ShoeSize) => {
    setCurrentSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleStockChange = (size: ProductSize | ShoeSize, value: string) => {
    const stockValue = parseInt(value) || 0;
    setSizes(prev => ({
      ...prev,
      [size]: stockValue >= 0 ? stockValue : 0
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Kamera erişimi sağlanamadı.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg');
        setImage(base64Image);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim() || !price || !image) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert('Geçerli bir fiyat girin.');
      return;
    }

    const initialSizes: SizeRecord = {
      'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'XXXL': 0, '4XL': 0, '5XL': 0, '6XL': 0,
      '36': 0, '37': 0, '38': 0, '39': 0, '40': 0, '41': 0, '42': 0, '43': 0, '44': 0, '45': 0
    };

    const product: Omit<Product, 'id'> = {
      name: name.trim(),
      price: numericPrice,
      image,
      type,
      sizes: {
        ...initialSizes,
        ...Object.fromEntries(
          currentSizes.map(size => [size, sizes[size] || 0])
        )
      },
      createdAt: Date.now()
    };

    onAdd(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Yeni Ürün Ekle</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ürün adını girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Tipi
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as ProductType);
                  setCurrentSizes([]);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="clothing">Kıyafet</option>
                <option value="shoes">Ayakkabı</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedenler ve Stok
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Mevcut Bedenler:</p>
                  <div className="flex flex-wrap gap-2">
                    {(type === 'clothing' ? clothingSizes : shoeSizes).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 rounded border ${
                          currentSizes.includes(size)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Stok Miktarları:</p>
                  <div className="space-y-2">
                    {currentSizes.map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <span className="w-12">{size}:</span>
                        <input
                          type="number"
                          value={sizes[size]}
                          onChange={(e) => handleStockChange(size, e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Görseli
              </label>
              {image ? (
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <Upload size={20} />
                    Dosya Yükle
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <Camera size={20} />
                    Fotoğraf Çek
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Ürün Ekle
              </button>
            </div>
          </form>
        </div>
      </div>

      {videoRef.current && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-lg"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Fotoğraf Çek
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}