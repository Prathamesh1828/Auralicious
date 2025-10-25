import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing user order from frontend
const placeOrder = async (req, res) => {
    try {
        console.log("=== ORDER CONTROLLER - PLACE ORDER ===");
        console.log("Request Body:", req.body);
        console.log("User ID from auth middleware:", req.userId);
        
        const paymentMethod = req.body.paymentMethod || "razorpay"; // Default to razorpay

        // Create new order in database
        const newOrder = new orderModel({
            userId: req.userId, // Fixed: Use req.userId from auth middleware
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: paymentMethod
        });
        
        console.log("New order object created:", newOrder);
        
        await newOrder.save();
        console.log("Order saved to database with ID:", newOrder._id);
        
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
        console.log("Cart cleared for user:", req.userId);

        if (paymentMethod === "cod") {
            // Cash on Delivery - no payment gateway needed
            console.log("COD order placed successfully");
            res.json({
                success: true,
                message: "Order placed successfully. Pay on delivery.",
                orderId: newOrder._id
            });
        } else {
            // Create Razorpay order
            const options = {
                amount: req.body.amount * 100, // Amount in paisa (smallest currency unit)
                currency: "INR",
                receipt: `order_${newOrder._id}`,
                notes: {
                    orderId: newOrder._id.toString(),
                    userId: req.userId
                }
            };

            console.log("Creating Razorpay order with options:", options);
            const razorpayOrder = await razorpay.orders.create(options);
            console.log("Razorpay order created:", razorpayOrder);
            
            // Save razorpay order ID to database
            await orderModel.findByIdAndUpdate(newOrder._id, {
                razorpayOrderId: razorpayOrder.id
            });
            console.log("Razorpay order ID saved to database");

            res.json({
                success: true,
                order_id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID,
                order: newOrder,
                orderId: newOrder._id
            });
        }

    } catch (error) {
        console.error("=== ERROR IN PLACE ORDER ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error:", error);
        res.json({ 
            success: false, 
            message: "Error creating order: " + error.message 
        });
    }
};

// Verify payment
const verifyOrder = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    try {
        // Generate signature for verification
        const crypto = await import('crypto');
        const generated_signature = crypto.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is successful - find order by razorpay order id
            const order = await orderModel.findOne({ razorpayOrderId: razorpay_order_id });
            
            if (!order) {
                // Try to find by searching in all orders
                const allOrders = await orderModel.find({ payment: false, paymentMethod: "razorpay" }).sort({ date: -1 }).limit(10);
                if (allOrders.length > 0) {
                    await orderModel.findByIdAndUpdate(allOrders[0]._id, {
                        payment: true,
                        paymentId: razorpay_payment_id,
                        razorpayOrderId: razorpay_order_id
                    });
                }
            } else {
                await orderModel.findByIdAndUpdate(order._id, {
                    payment: true,
                    paymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id
                });
            }

            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying payment" });
    }
};

// Get user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// List all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
