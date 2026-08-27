import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { useProduct, useUpdateProduct } from '../../hooks/useProducts';
import type { ProductAvailability } from '../../types/product';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  availability: z.enum(['in-stock', 'low-stock', 'out-of-stock', 'made-to-order']),
});

type ProductFormData = z.infer<typeof productSchema>;

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading: isProductLoading } = useProduct(id);
  const updateProductMutation = useUpdateProduct();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        availability: product.availability,
      });
      setImagePreview(product.image);
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isProductLoading) {
    return (
      <div className="p-8 text-center text-warmbrown-600 dark:text-darkbg-muted">
        Loading product data...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <button onClick={() => navigate('/admin/products')} className="py-2 px-4 bg-sage-400 text-white rounded-xl text-xs font-bold">
          Back to Products
        </button>
      </div>
    );
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      /**
       * TODO: FIRESTORE & FIREBASE STORAGE INTEGRATION
       * If selectedFile exists:
       * 1. uploadBytes(ref(storage, `products/${selectedFile.name}`), selectedFile)
       * 2. getDownloadURL()
       * Update Firestore doc with download URL.
       */
      await updateProductMutation.mutateAsync({
        id: product.id,
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          availability: data.availability as ProductAvailability,
          image: imagePreview || product.image,
        },
      });

      navigate('/admin/products');
    } catch (e) {
      console.error('Failed to update product', e);
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
          Edit Product: {product.name}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Fields */}
        <div className="lg:col-span-8 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-cozy space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Product Title *
            </label>
            <input
              type="text"
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

          {/* File Upload Box */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Update Product Image Upload
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
                  Click or drag new image file here to update
                </p>
                {selectedFile && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 dark:bg-sage-900/60 text-sage-800 dark:text-sage-300 rounded-full text-xs font-bold mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || updateProductMutation.isPending}
            className="w-full py-4 px-6 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isSubmitting || updateProductMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating Product...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Live Image Preview Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-5 shadow-cozy space-y-3">
            <span className="text-xs font-bold text-warmbrown-600 dark:text-darkbg-muted block">Image Preview</span>
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-xs text-gray-400">No Image</div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
