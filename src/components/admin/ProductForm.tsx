'use client'
import { useState, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Save, X, Plus, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react'

declare global {
  interface Window {
    cloudinary: any
  }
}


interface Category {
  id: string
  name: string
  gender: string
}

interface Variant {
  size: string
  color: string
  stock: number
  price: number
}

interface ProductFormProps {
  product?: any
  categories: Category[]
}


export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDesc: product?.shortDesc || '',
    price: product?.price !== null && product?.price !== undefined ? String(product.price) : '',
    comparePrice: product?.comparePrice !== null && product?.comparePrice !== undefined ? String(product.comparePrice) : '',
    sku: product?.sku || '',
    brand: product?.brand || '',
    tags: product?.tags || '',
    stockQuantity: product?.stockQuantity !== null && product?.stockQuantity !== undefined ? String(product.stockQuantity) : '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  })
  
  // Multi-category selection - Initialize with existing categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const multi = product?.categories?.map((c: any) => c.id) || []
    if (multi.length > 0) return multi
    const single = product?.categoryId || product?.category?.id
    return single ? [single] : []
  })
  
  const [images, setImages] = useState<string[]>(() => product?.images?.map((img: any) => img.url) || [])
  
  const [variants, setVariants] = useState<Variant[]>(() =>
    product?.variants?.map((v: any) => ({
      size: v.size || '',
      color: v.color || '',
      stock: v.stock || 0,
      price: v.price || 0,
    })) || []
  )
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove category
        return prev.filter(id => id !== categoryId)
      } else {
        // Add category
        return [...prev, categoryId]
      }
    })
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  
  const handleImageUpload = () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      toast.error('Cloudinary is not configured. Missing env vars.')
      return
    }

    if (!window.cloudinary) {
      toast.error('Upload widget not loaded yet. Please wait a moment and try again.')
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: 'epitome-elegance/products',
        sources: ['local', 'camera'],
        multiple: true,
        maxFileSize: 5_000_000,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Upload error:', error)
          toast.error('Upload failed')
          setUploading(false)
          return
        }

        if (result?.event === 'queues-start') {
          setUploading(true)
        }

        if (result?.event === 'success') {
          const url = result?.info?.secure_url
          if (typeof url === 'string' && url.trim()) {
            setImages(prev => [...prev, url])
          }
        }

        if (result?.event === 'queues-end' || result?.event === 'close') {
          setUploading(false)
        }
      }
    )

    widget.open()
  }

  
  const removeImage = (url: string) => {
    setImages(prev => prev.filter((img) => img !== url))
    toast.success('Image removed')
  }
  
  const addVariant = () =>
    setVariants(prev => [...prev, { size: '', color: '', stock: 0, price: parseFloat(formData.price as any) || 0 }])
  const removeVariant = (index: number) => setVariants(prev => prev.filter((_, i) => i !== index))
  
  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants]
    
    if (field === 'stock') {
      newVariants[index] = { 
        ...newVariants[index], 
        [field]: value === '' ? 0 : parseInt(value) || 0 
      }
    } else if (field === 'price') {
      newVariants[index] = { 
        ...newVariants[index], 
        [field]: value === '' ? 0 : parseFloat(value) || 0 
      }
    } else {
      newVariants[index] = { ...newVariants[index], [field]: value }
    }
    
    setVariants(newVariants)
  }
  
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    console.log('Selected categories:', selectedCategories) // Debug log
    
    if (images.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category')
      return
    }
    
    setLoading(true)

    const cleanedVariants = variants.filter(v => v.size || v.color)
    
    try {
     
      const payload = {
        ...formData,
        price: parseFloat(formData.price as any) || 0,
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice as any) : null,
        stockQuantity: parseInt(formData.stockQuantity as any) || 0,
        categoryIds: selectedCategories, // Send array of category IDs
        images: images.filter(img => img.trim()),
        variants: cleanedVariants
      }

      console.log('Submitting payload:', payload) // Debug log
      
      const url = product 
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      
      const res = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const responseData = await res.json()
      
      if (res.ok) {
        toast.success(product ? 'Product updated!' : 'Product created!')
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error(responseData.error || 'Failed to save product')
        console.error('Server error:', responseData)
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Group categories by gender
  const groupedCategories = categories.reduce((acc, cat) => {
    const gender = cat.gender || 'UNISEX'
    if (!acc[gender]) acc[gender] = []
    acc[gender].push(cat)
    return acc
  }, {} as Record<string, Category[]>)
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold text-lg">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={!product ? generateSlug : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <input
            type="text"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
            placeholder="Brief product summary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
            required
          />
        </div>
      </div>
      
      {/* Pricing & Inventory */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="font-display font-semibold text-lg">Pricing & Inventory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (KSh) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compare Price (KSh)
            </label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              required
              placeholder="e.g., SHIRT-001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="casual, summer, trending"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Categories - Multi-select with Checkboxes */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <div>
          <h3 className="font-display font-semibold text-lg mb-1">Categories *</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select one or more categories ({selectedCategories.length} selected)
          </p>
        </div>

        {Object.keys(groupedCategories).length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No categories available. Please create categories first.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedCategories).map(([gender, cats]) => (
            <div key={gender} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3 text-base">
                {gender === 'MALE' ? "Men's Categories" : gender === 'FEMALE' ? "Women's Categories" : 'Unisex Categories'}
              </h4>
              <div className="space-y-2">
                {cats.map(cat => (
                  <label
                    key={cat.id}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition ${
                      selectedCategories.includes(cat.id) 
                        ? 'bg-gold-100 border-2 border-gold-500' 
                        : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-5 h-5 text-gold-500 rounded focus:ring-2 focus:ring-gold-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">{cat.name}</span>
                    {selectedCategories.includes(cat.id) && (
                      <span className="text-xs bg-gold-500 text-white px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedCategories.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              ✓ {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </p>
          </div>
        )}
      </div>
      
      {/* Images */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg">Product Images *</h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload one or more images. The first image will be used as the main image.
            </p>
          </div>

          <button
  type="button"
  onClick={handleImageUpload}
  disabled={uploading}
  className="inline-flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-700 cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  <UploadCloud className="w-4 h-4" />
  <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
</button>
        </div>

        {images.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-1">No images uploaded yet</p>
            <p className="text-sm text-gray-500">
              Click &quot;Upload Images&quot; to add product photos (max 5MB each)
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={url}
                className="relative group border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-gray-400 transition"
              >
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
                {index === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-md bg-yellow-500 text-white shadow">
                    Main Image
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Variants */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg">Variants (Optional)</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add size and color variations
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center space-x-1 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            <span>Add Variant</span>
          </button>
        </div>
        
        {variants.length > 0 && (
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    placeholder="S, M, L, 38, 40"
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    placeholder="Red, Blue, Black"
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                    min="0"
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Settings */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="font-display font-semibold text-lg">Settings</h3>
        
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-gray-900 rounded focus:ring-2 focus:ring-gray-900"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-gray-900 rounded focus:ring-2 focus:ring-gray-900"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center space-x-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}</span>
        </button>
      </div>
    </form>
  )
}
