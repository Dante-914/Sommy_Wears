'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function NewProduct() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    category: '',
    stock: '',
    is_active: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error('Failed to upload image: ' + uploadError.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  // ============================================
  // Auto-create category if it doesn't exist
  // ============================================
  const ensureCategoryExists = async (categoryName) => {
    if (!categoryName || !categoryName.trim()) return

    const slug = categoryName.toLowerCase().trim()

    // Check if category already exists
    const { data: existing, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking category:', checkError)
      return
    }

    // If category doesn't exist, create it
    if (!existing) {
      const { error: insertError } = await supabase
        .from('categories')
        .insert([{
          name: categoryName.trim(),
          slug: slug,
          icon: '📦',
          is_active: true,
        }])

      if (insertError) {
        console.error('Error creating category:', insertError)
        toast.error(`Failed to create category: ${categoryName}`)
      } else {
        console.log(`✅ Auto-created category: ${categoryName}`)
        toast.success(`Category "${categoryName}" created automatically!`)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    setLoading(true)
    let imageUrl = null

    // Upload image if selected
    if (imageFile) {
      setUploading(true)
      try {
        imageUrl = await uploadImage(imageFile)
      } catch (error) {
        toast.error(error.message)
        setUploading(false)
        setLoading(false)
        return
      }
      setUploading(false)
    }

    // Auto-create category if it doesn't exist
    if (formData.category) {
      await ensureCategoryExists(formData.category)
    }

    // Create the product
    const slug = generateSlug(formData.name)

    const productData = {
      name: formData.name,
      slug: slug,
      description: formData.description || null,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      category: formData.category ? formData.category.trim() : null,
      stock: parseInt(formData.stock) || 0,
      is_active: formData.is_active,
      images: imageUrl ? [imageUrl] : [],
    }

    const { error } = await supabase.from('products').insert([productData])

    if (error) {
      toast.error('Failed to create product: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Product created successfully! 🎉')
    router.push('/admin/dashboard')
  }

  return (
    <main className="container admin-product-form">
      <div className="form-header">
        <h1>Add New Product</h1>
        <Link href="/admin/dashboard" className="btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Image Upload Section */}
        <div className="form-section">
          <label className="section-label">Product Image</label>
          <div className="image-upload-area">
            {imagePreview ? (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Product preview" className="image-preview" />
                <button type="button" onClick={removeImage} className="remove-image-btn">
                  ✕
                </button>
              </div>
            ) : (
              <div 
                className="image-drop-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file) {
                    const event = { target: { files: [file] } }
                    handleImageChange(event)
                  }
                }}
              >
                <div className="drop-zone-content">
                  <span className="upload-icon">📷</span>
                  <p>Click or drag & drop to upload</p>
                  <span className="upload-hint">PNG, JPG, WebP (max 2MB)</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="form-section">
          <label className="section-label">Product Details</label>
          
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Classic White Polo"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₦) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="25000"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sale_price">Sale Price (₦)</label>
              <input
                type="number"
                id="sale_price"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                placeholder="20000 (optional)"
              />
              <small>Leave blank if not on sale</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product... materials, fit, care instructions..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Polos, Shorts, Sets"
              />
              <small>New categories will be created automatically!</small>
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active (visible on store)
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || uploading}
          >
            {uploading ? 'Uploading Image...' : loading ? 'Creating Product...' : 'Create Product'}
          </button>
          <Link href="/admin/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}