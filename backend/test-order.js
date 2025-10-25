// Quick test script to check if order creation works
// Run with: node test-order.js

import 'dotenv/config';

console.log("=== ENVIRONMENT VARIABLES CHECK ===");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Missing");
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "✓ Set" : "✗ Missing");
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "✓ Set" : "✗ Missing");

if (process.env.RAZORPAY_KEY_ID) {
    console.log("\nRazorpay Key ID:", process.env.RAZORPAY_KEY_ID);
}

console.log("\n=== RAZORPAY TEST ===");
import Razorpay from 'razorpay';

try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    console.log("✓ Razorpay instance created successfully");
    
    // Test creating an order
    const options = {
        amount: 50000, // 500 INR in paisa
        currency: "INR",
        receipt: "test_order_123",
    };
    
    console.log("\nTesting Razorpay order creation...");
    const order = await razorpay.orders.create(options);
    console.log("✓ Razorpay order created successfully!");
    console.log("Order ID:", order.id);
    console.log("Amount:", order.amount);
    console.log("Currency:", order.currency);
    
} catch (error) {
    console.error("✗ Error:", error.message);
    if (error.error) {
        console.error("Razorpay Error:", error.error);
    }
}
