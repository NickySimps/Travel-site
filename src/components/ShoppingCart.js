import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

// Sample travel packages data
const TRAVEL_PACKAGES = [
    {
        id: 'friends-pkg',
        name: 'Friends Package',
        description: 'Perfect for group getaways',
        price: 599.99,
        image: 'Pictures/beaches/beach 1.jpg'
    },
    {
        id: 'sun-pkg',
        name: 'Sun Package',
        description: 'Ultimate relaxation',
        price: 499.99,
        image: 'Pictures/beaches/beach 2.jpg'
    },
    {
        id: 'fun-pkg',
        name: 'Fun Package',
        description: 'Adventure awaits',
        price: 649.99,
        image: 'Pictures/beaches/beach 3.jpg'
    }
];

const ShoppingCartComponent = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Calculate total cart value
    const cartTotal = cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0);

    // Add item to cart
    const addToCart = (package) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === package.id);
            if (existingItem) {
                return prevItems.map(item => 
                    item.id === package.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
            }
            return [...prevItems, { ...package, quantity: 1 }];
        });
    };

    // Remove item from cart
    const removeFromCart = (packageId) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== packageId)
        );
    };

    // Update item quantity
    const updateQuantity = (packageId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(packageId);
            return;
        }
        
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === packageId 
                ? { ...item, quantity: newQuantity }
                : item
            )
        );
    };

    // Checkout function (placeholder)
    const handleCheckout = () => {
        alert(`Checkout Total: $${cartTotal.toFixed(2)}`);
        // In a real app, this would integrate with payment processing
        setCartItems([]);
        setIsCartOpen(false);
    };

    return (
        <div className="shopping-cart-container">
            {/* Cart Toggle Button */}
            <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="cart-toggle-btn"
            >
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                )}
            </button>

            {isCartOpen && (
                <div className="cart-modal">
                    <div className="cart-header">
                        <h2>Your Travel Cart</h2>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="close-btn"
                        >
                            &times;
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <h3>{item.name}</h3>
                                            <p>${item.price.toFixed(2)}</p>
                                            <div className="quantity-controls">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="remove-item-btn"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <div className="cart-total">
                                    <strong>Total:</strong> 
                                    ${cartTotal.toFixed(2)}
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    className="checkout-btn"
                                >
                                    Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Add to Cart Buttons for Packages */}
            <div className="package-cart-actions">
                {TRAVEL_PACKAGES.map(pkg => (
                    <button 
                        key={pkg.id}
                        onClick={() => addToCart(pkg)}
                        className="add-to-cart-btn"
                    >
                        Add {pkg.name} to Cart
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ShoppingCartComponent;