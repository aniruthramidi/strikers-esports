import React, { useState, useContext } from 'react';
import { AdminContext } from '../admin/AdminContext';
import { ShoppingBag, X, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const products = [
  {
    id: 'strikers-jersey-2026',
    name: 'Strikers Pro Jersey 2026',
    price: 999,
    desc: 'Official team jersey designed for the BGIS 2026 campaign. Made with ultra-breathable, moisture-wicking polyester with sharp sublimated monochrome team graphics.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'Official Gear',
  },
  {
    id: 'strikers-hoodie-mono',
    name: 'Strikers Premium Hoodie',
    price: 1499,
    desc: 'Heavyweight oversized cotton fleece hoodie in pure black with embossed white branding on chest and sleeves. Perfect for offline tournaments and daily casual wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Popular',
  },
  {
    id: 'strikers-cap-emb',
    name: 'Strikers Esports Snapback',
    price: 499,
    desc: 'Classic structured snapback cap with flat visor. Front features thick 3D embroidery of the Strikers "S" logo in high contrast white thread.',
    sizes: ['Free Size'],
    badge: 'Accessory',
  },
  {
    id: 'strikers-mousepad-xl',
    name: 'Strikers Control Mousepad XL',
    price: 799,
    desc: 'Extra-large desktop mousepad (900mm x 400mm x 4mm). Low-friction textured cloth surface optimizes tracking accuracy for both optical and laser mouse sensors.',
    sizes: ['One Size'],
    badge: 'Hardware',
  }
];

export default function Merch() {
  const { categories, recordNewOrder } = useContext(AdminContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('shop'); // 'shop', 'shipping', 'payment', 'success'
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  // Filter categories and products
  const activeCategories = (categories?.merch || []).filter(c => c.visible);
  const visibleCategoryNames = activeCategories.map(c => c.name);

  // Get visible products
  let visibleProducts = products.filter(p => visibleCategoryNames.includes(p.badge));

  // If a custom category is visible and has no hardcoded products, we mock a custom product so they can interact with it
  activeCategories.forEach(cat => {
    const hasItems = visibleProducts.some(p => p.badge === cat.name);
    if (!hasItems) {
      visibleProducts.push({
        id: `mock-custom-${cat.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: `Strikers ${cat.name} Special Merchandise`,
        price: 699,
        desc: cat.desc || `Exclusive limited edition release under our custom ${cat.name} range. High quality print and design.`,
        sizes: ['S', 'M', 'L', 'XL'],
        badge: cat.name,
      });
    }
  });

  // Apply filter bar selection
  const filteredProducts = selectedCategory === 'All'
    ? visibleProducts
    : visibleProducts.filter(p => p.badge === selectedCategory);

  const handleAddToCart = (product, size) => {
    if (!size && product.sizes.length > 1) {
      alert('Please select a size first.');
      return;
    }
    const finalSize = size || product.sizes[0];
    const cartItem = {
      ...product,
      selectedSize: finalSize,
      cartId: `${product.id}-${finalSize}`,
    };

    setCart((prev) => {
      const exists = prev.find((item) => item.cartId === cartItem.cartId);
      if (exists) {
        return prev.map((item) =>
          item.cartId === cartItem.cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...cartItem, quantity: 1 }];
    });

    setSelectedProduct(null);
    setSelectedSize('');
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const getCartTotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.phone) {
      alert('Please complete all required fields.');
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePaymentConfirm = () => {
    // Record order in Admin Context
    recordNewOrder({
      items: cart,
      total: getCartTotal(),
      shipping: shippingDetails,
    });
    setCheckoutStep('success');
    setCart([]);
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Strikers Shop</h1>
        <p className="text-sm text-strikers-muted max-w-xl mx-auto">
          Represent Strikers Esports with premium quality monochrome apparel and tournament grade accessories.
        </p>
      </div>

      {checkoutStep === 'shop' && (
        <>
          {/* Category Filter Bar */}
          <div className="flex flex-wrap gap-2.5 justify-center py-2 border-b border-strikers-border">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === 'All'
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-strikers-muted border-strikers-border hover:border-white'
              }`}
            >
              All Items
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat.name
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-strikers-muted border-strikers-border hover:border-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Main Store Catalog */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p, idx) => (
              <motion.div
                key={`${selectedCategory}-${p.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group border border-strikers-border bg-strikers-gray rounded-3xl overflow-hidden hover:border-white transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image placeholder box */}
                <div className="h-56 bg-neutral-900 border-b border-strikers-border flex items-center justify-center p-8 relative">
                  <span className="absolute top-4 left-4 text-[9px] bg-white text-black px-2 py-0.5 rounded-full font-bold uppercase">
                    {p.badge}
                  </span>
                  <div className="text-center space-y-2">
                    <ShoppingBag className="w-10 h-10 text-white/20 group-hover:scale-110 transition-transform mx-auto" />
                    <span className="text-[10px] text-strikers-muted font-black tracking-widest uppercase">
                      STRIKERS CLOTHING
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase text-white tracking-tight leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs font-bold text-neutral-400">₹{p.price}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setSelectedSize(p.sizes[0]);
                    }}
                    className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider text-[10px] rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart trigger button */}
          {cart.length > 0 && (
            <div className="fixed bottom-8 right-8 z-40">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-4 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 transition-transform flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> View Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence mode="wait">
        {/* Checkout: Shipping Details Form */}
        {checkoutStep === 'shipping' && (
          <motion.div
            key="checkout-shipping"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase text-white">Shipping Details</h3>
              <p className="text-xs text-strikers-muted">Please provide your contact and delivery address.</p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.name}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-strikers-muted">Email Address *</label>
                <input
                  type="email"
                  required
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                  className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-strikers-muted">Street Address *</label>
                <textarea
                  required
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  rows="3"
                  className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-strikers-muted">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={shippingDetails.pincode}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                    className="w-full bg-black border border-strikers-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  Proceed to Payment
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('shop')}
                  className="w-full py-3 border border-strikers-border hover:border-white font-bold uppercase tracking-wider text-xs rounded-full transition-colors text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Checkout: Payment Form (UPI Scan Mock) */}
        {checkoutStep === 'payment' && (
          <motion.div
            key="checkout-payment"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6 text-center"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase text-white">Payment Verification</h3>
              <p className="text-xs text-strikers-muted">Scan the QR code or transfer the total via UPI to complete order.</p>
            </div>

            {/* Dummy QR Scanner Mock */}
            <div className="w-48 h-48 border border-strikers-border bg-black rounded-3xl mx-auto flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center text-strikers-muted text-[10px] uppercase font-bold tracking-widest">
                Mock QR Code
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-white">UPI ID: strikersesports@upi</p>
              <p className="text-lg font-black text-white">Total Amount: ₹{getCartTotal()}</p>
            </div>

            <div className="space-y-4 pt-4">
              <button
                onClick={handlePaymentConfirm}
                className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors"
              >
                Verify & Complete Order
              </button>
              <button
                onClick={() => setCheckoutStep('shipping')}
                className="w-full py-3 border border-strikers-border hover:border-white font-bold uppercase tracking-wider text-xs rounded-full transition-colors text-white"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Checkout: Success Notice */}
        {checkoutStep === 'success' && (
          <motion.div
            key="checkout-success"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto border border-strikers-border bg-strikers-gray p-8 rounded-3xl space-y-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black uppercase text-white">Order Placed!</h3>
              <p className="text-xs text-strikers-muted leading-relaxed">
                Thank you for supporting Strikers Esports. Our team will contact you at <strong>{shippingDetails.phone}</strong> or email <strong>{shippingDetails.email}</strong> within 24 hours to confirm payment verification and shipping details.
              </p>
            </div>
            <button
              onClick={() => setCheckoutStep('shop')}
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border border-strikers-border bg-strikers-gray rounded-3xl max-w-lg w-full overflow-hidden relative"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 text-strikers-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] bg-white text-black px-2 py-0.5 rounded-full font-bold uppercase">
                    {selectedProduct.badge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm font-bold text-white">₹{selectedProduct.price}</p>
                </div>

                <p className="text-xs text-strikers-muted leading-relaxed">{selectedProduct.desc}</p>

                {/* Size Selector */}
                {selectedProduct.sizes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-strikers-muted font-bold">Select Size</p>
                    <div className="flex gap-2.5">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 border rounded-xl flex items-center justify-center font-bold text-xs uppercase transition-all ${
                            selectedSize === size
                              ? 'bg-white border-white text-black'
                              : 'border-strikers-border text-strikers-muted hover:border-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(selectedProduct, selectedSize)}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Add To Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-strikers-gray border-l border-strikers-border h-full flex flex-col justify-between p-8 relative"
            >
              <button
                onClick={() => setIsCartOpen(false)}
                className="absolute top-4 right-4 p-2 text-strikers-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 flex-grow overflow-y-auto">
                <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Your Shopping Cart
                </h3>

                <div className="space-y-4">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item.cartId}
                        className="border border-strikers-border bg-black/40 rounded-2xl p-4 flex gap-4 items-center justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase text-white truncate max-w-[180px]">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-strikers-muted uppercase">Size: {item.selectedSize}</p>
                          <p className="text-xs font-bold text-white">
                            ₹{item.price} x {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.cartId)}
                          className="text-[10px] uppercase font-bold text-red-500 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-strikers-muted">Your cart is currently empty.</p>
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-strikers-border pt-6 space-y-4 shrink-0">
                  <div className="flex justify-between items-center text-xs font-bold text-white uppercase">
                    <span>Total Amount</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep('shipping');
                    }}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
