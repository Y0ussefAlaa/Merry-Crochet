import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { useCreateProduct } from '../../hooks/useProducts';
import type { ProductAvailability } from '../../types/product';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  availability: z.enum(['in-stock', 'low-stock', 'out-of-stock', 'made-to-order']),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      availability: 'in-stock',
      stock: 10,
      price: 250,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file (PNG, JPG, WEBP)');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!imagePreview && !selectedFile) {
      setImageError('Please upload a product image file');
      return;
    }

    try {
      /**
       * TODO: FIREBASE STORAGE INTEGRATION
       * Replace local base64/file preview with Firebase Storage file upload:
       * 1. const storageRef = ref(storage, `products/${Date.now()}_${selectedFile.name}`);
       * 2. await uploadBytes(storageRef, selectedFile);
       * 3. const downloadURL = await getDownloadURL(storageRef);
       * 4. Save downloadURL in Firestore product document.
       */
      const imageUrl = imagePreview || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80';

      await createProductMutation.mutateAsync({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        availability: data.availability as ProductAvailability,
        image: imageUrl,
      });

      navigate('/admin/products');
    } catch (e) {
      console.error('Failed to create product', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
        <h1 className="text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
          Add New Handmade Product
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields */}
        <div className="lg:col-span-8 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-cozy space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Product Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Handmade Crochet Flower Bouquet"
              {...register('name')}
              className="w-full px-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the yarn material, colors, dimensions, and craft details..."
              {...register('description')}
              className="w-full px-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Price (EGP) *
              </label>
              <input
                type="number"
                step="5"
                {...register('price')}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price.message}</p>}
            </div>

            {/* Stock Count */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Stock Quantity *
              </label>
              <input
                type="number"
                {...register('stock')}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
              />
              {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock.message}</p>}
            </div>

            {/* Availability */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Availability *
              </label>
              <select
                {...register('availability')}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
              >
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="made-to-order">Made to Order</option>
              </select>
            </div>
          </div>

          {/* File Upload Box (Replacing Google / Plain URL input) */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Product Image Upload *
            </label>
            
            <div className="relative border-2 border-dashed border-cream-300 dark:border-darkbg-border hover:border-sage-400 dark:hover:border-sage-400 rounded-3xl p-6 text-center transition-colors bg-cream-50/50 dark:bg-darkbg-surface/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="p-3 bg-sage-100 dark:bg-sage-950/60 text-sage-600 rounded-full">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-warmbrown-800 dark:text-darkbg-cream">
                  Click or drag image file here to upload
                </p>
                <p className="text-xs text-warmbrown-500 dark:text-darkbg-muted">
                  Supports PNG, JPG, JPEG, WEBP
                </p>
                {selectedFile && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 dark:bg-sage-900/60 text-sage-800 dark:text-sage-300 rounded-full text-xs font-bold mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
            {imageError && <p className="text-xs text-rose-500 mt-1">{imageError}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createProductMutation.isPending}
            className="w-full py-4 px-6 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isSubmitting || createProductMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>

        {/* Live Image Preview Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-5 shadow-cozy space-y-3">
            <span className="text-xs font-bold text-warmbrown-600 dark:text-darkbg-muted block">Image Upload Preview</span>
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Uploaded Product Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-warmbrown-500 dark:text-darkbg-muted text-xs">
                  No image selected yet
                </div>
              )}
            </div>
            <p className="text-[11px] text-warmbrown-500 dark:text-darkbg-muted leading-relaxed pt-1">
              // TODO: FIREBASE STORAGE
              <br />
              In Stage 2, selecting a file uploads it directly to Firebase Storage using <code className="bg-cream-100 dark:bg-darkbg-surface px-1 rounded">uploadBytes()</code> and saves its download URL.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
