'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { sendOrderStatusUpdate } from '@/lib/emailService'
import Spinner from '@/components/Spinner'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    await fetchOrders()
    await fetchProducts()
    await fetchReviews()
    setLoading(false)
  }

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } else {
      setOrders(data || [])
    }
  }

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
  }

  // ===== FETCH REVIEWS =====
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to fetch reviews')
    } else {
      setReviews(data || [])
    }
  }

  // ===== APPROVE REVIEW =====
  const approveReview = async (reviewId) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', reviewId)

    if (error) {
      toast.error('Failed to approve review')
      console.error('Approve error:', error)
      return
    }

    toast.success('✅ Review approved!')
    fetchReviews()
  }

  // ===== DELETE REVIEW =====
  const deleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      toast.error('Failed to delete review')
      console.error('Delete error:', error)
      return
    }

    toast.success('🗑️ Review deleted')
    fetchReviews()
  }

  const updateOrderStatus = async (orderId, newStatus) => {
  console.log('📦 Updating order:', orderId, 'to', newStatus)

  // Get order details
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (fetchError) {
    console.error('❌ Fetch error:', fetchError)
    toast.error('Failed to fetch order details')
    return
  }

  console.log('✅ Order fetched:', order)

  // Update status in Supabase
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (updateError) {
    console.error('❌ Update error:', updateError)
    toast.error('Failed to update order')
    return
  }

  console.log('✅ Order updated in Supabase')

  // Send email notification
  try {
    console.log('📧 Sending email for status:', newStatus)
    const emailResult = await sendOrderStatusUpdate(order, newStatus)
    console.log('📧 Email result:', emailResult)
    
    if (emailResult.success) {
      toast.success(`✅ Order marked as ${newStatus}. Email sent to customer!`)
    } else {
      console.error('❌ Email error:', emailResult.error)
      toast.success(`✅ Order marked as ${newStatus}. ⚠️ Email failed: ${emailResult.error || 'Unknown error'}`)
    }
  } catch (emailError) {
    console.error('❌ Email exception:', emailError)
    toast.success(`✅ Order marked as ${newStatus}. ⚠️ Email error`)
  }

  // Refresh orders
  fetchOrders()
}

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      toast.error('Failed to delete product')
      return
    }

    toast.success('Product deleted')
    fetchProducts()
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Helper to render stars
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (loading) {
    return (
      <main className="container admin-dashboard">
        <Spinner />
      </main>
    )
  }

  return (
    <main className="container admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <Link href="/admin/products/new" className="btn-primary">
            + Add Product
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'orders' ? 'tab-active' : 'tab-inactive'}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          className={activeTab === 'products' ? 'tab-active' : 'tab-inactive'}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={activeTab === 'reviews' ? 'tab-active' : 'tab-inactive'}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {/* ===== ORDERS TAB ===== */}
      {activeTab === 'orders' && (
        <div className="admin-orders">
          {orders.length === 0 ? (
            <p>No orders yet. Check back soon!</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.order_number}</strong></td>
                    <td>{order.customer_name}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'paid')}
                          className="btn-small btn-paid"
                        >
                          Mark Paid
                        </button>
                      )}
                      {order.status === 'paid' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="btn-small btn-shipped"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="btn-small btn-delivered"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== PRODUCTS TAB ===== */}
      {activeTab === 'products' && (
        <div className="admin-products">
          {products.length === 0 ? (
            <p>
              No products yet.{' '}
              <Link href="/admin/products/new">Add your first product</Link>
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.images?.[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="admin-product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock || 0}</td>
                    <td>
                      <span
                        className={`status-badge ${product.is_active ? 'status-active' : 'status-inactive'}`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="btn-small btn-edit"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="btn-small btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== REVIEWS TAB ===== */}
      {activeTab === 'reviews' && (
        <div className="admin-reviews">
          {reviews.length === 0 ? (
            <p>No reviews yet. Customers will leave feedback after their orders are delivered.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td><strong>{review.order_number}</strong></td>
                    <td>{review.customer_name}</td>
                    <td>{renderStars(review.rating)}</td>
                    <td className="review-comment-cell">
                      {review.comment || <span className="no-comment">No comment</span>}
                    </td>
                    <td>{new Date(review.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${review.is_approved ? 'status-active' : 'status-pending'}`}>
                        {review.is_approved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      {!review.is_approved && (
                        <button
                          onClick={() => approveReview(review.id)}
                          className="btn-small btn-paid"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="btn-small btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  )
}