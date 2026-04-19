const router = require('express').Router();
const Book = require('../models/book');
// const order = require('../models/order');
const Order = require('../models/order');
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');


// place order
// router.post('/place-order', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.headers;
//         // const { order} = req.body;
//         const { order: items } = req.body; // ✅ renamed

//         for (const item of order) {
//             const newOrder = new Order({
//                 userId: id,
//                 bookId: item.bookId,
//                 quantity: item.quantity
//             });
//             const savedOrder = await newOrder.save();

//             //save order in user order history
//             await User.findByIdAndUpdate(id, {
//                 $push: { orders: savedOrder._id }
//             }, { new: true });

//             // remove the book from cart
//             await User.findByIdAndUpdate(id, {
//                 $pull: { cart: item.bookId }
//             }, { new: true });

//         }
//         return res.status(200).json({ status: 'success', message: 'Order placed successfully' });
//     }
//     catch (error) {
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });

router.post('/place-order', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order: items } = req.body;

        console.log("BODY:", req.body);
        console.log("ITEMS:", items);
        console.log("USER ID:", id);

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items provided" });
        }

        if (!id) {
            return res.status(400).json({ message: "User ID missing" });
        }

        for (const item of items) {
            const newOrder = new Order({
                user: id,
                book: item.bookId,
                quantity: item.quantity,
                status: "order placed"   // 🔥 ADD THIS
            });
            const savedOrder = await newOrder.save();
            await User.findByIdAndUpdate(id, {
                $push: { orders: savedOrder._id }
            });
            await User.findByIdAndUpdate(id, {
                $pull: { cart: item.bookId }
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Order placed successfully'
        });

    } catch (error) {
        console.error("ERROR:", error); // 🔥 IMPORTANT
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});


// get order history of particular user
router.get('/get-order-history', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: 'orders',
            populate: {
                // path: 'book'
                path: 'book' // 🔥 IMPORTANT FIX

            }
        });
        const ordersData = userData.orders.reverse();
        return res.status(200).json({ status: 'success', data: ordersData });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


// get all orders (admin only)
// router.get('/get-all-orders', authenticateToken, async (req, res) => {
//     try {
//         const userData = await Order.find().populate('book').populate('user');
//         return res.status(200).json({ status: 'success', data: userData });
//     }
//     catch (error) {
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });

router.get('/get-all-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('book')   // ✅ THIS IS THE FIX
      .populate('user') // ✅ for user info
      .sort({ createdAt: -1 });  // 🔥 newest first
      console.log("ORDERS:", orders); // 👈 ADD THIS DEBUG

    res.status(200).json({
      status: "success",
      orders
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// update order status (admin only)

// router.put('/update-order-status/:orderid', authenticateToken, async (req, res) => {
//     try {
//         const { orderid } = req.params;
//         const { status } = req.body;

//         // 1. Validate ID
//         if (!orderid.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Invalid order ID"
//             });
//         }

//         // 2. Validate status
//         if (!status) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Status is required"
//             });
//         }

//         // 3. Update order
//         const updatedOrder = await Order.findByIdAndUpdate(
//             orderid,
//             { status },
//             { new: true }
//         );

//         // 4. Check if order exists
//         if (!updatedOrder) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Order not found"
//             });
//         }

//         return res.status(200).json({
//             status: "success",
//             message: "Order status updated successfully",
//             order: updatedOrder
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: "error",
//             message: "Internal server error"
//         });
//     }
// });

router.put('/update-order-status/:orderid', authenticateToken, async (req, res) => {
  try {
    const { orderid } = req.params;
    const { status } = req.body;

    // 1. Validate ID
    if (!orderid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid order ID"
      });
    }

    // 2. Validate status
    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "Status is required"
      });
    }

    // 3. Get existing order
    const order = await Order.findById(orderid);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    // 🔥 STATUS FLOW LOGIC
    const flow = ["order placed", "out for delivery", "Delivered"];

    const currentIndex = flow.indexOf(order.status);
    const newIndex = flow.indexOf(status);

    // ❌ Prevent backward movement
    if (newIndex !== -1 && newIndex < currentIndex) {
      return res.status(400).json({
        status: "error",
        message: "Cannot move status backward"
      });
    }

    // ❌ Prevent change after Delivered or Cancelled
    if (order.status === "Delivered" || order.status === "cancelled") {
      return res.status(400).json({
        status: "error",
        message: "Status is locked"
      });
    }

    // 4. Update
    order.status = status;
    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});


// delete order (admin only)
router.delete('/delete-order', authenticateToken, async (req, res) => {
    try {
        const { orderid } = req.headers;
        await Order.findByIdAndDelete(orderid);
        return res.status(200).json({ status: 'success', message: 'Order deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


// cancel order (user only)
router.put("/cancel-order", async (req, res) => {
  try {
    // const { orderId } = req.headers;
    const { orderId } = req.body; // ✅ from body

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ Prevent cancel after delivery
    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// delete order (user only)
router.delete('/delete-user-order', authenticateToken, async (req, res) => {
    try {
        const { orderid } = req.headers;
        await Order.findByIdAndDelete(orderid);
        return res.status(200).json({ status: 'success', message: 'Order deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// get order details by order id
router.get('/get-order-details', authenticateToken, async (req, res) => {
    try {
        const { orderid } = req.headers;
        const orderData = await Order.findById(orderid).populate('book').populate('user');
        return res.status(200).json({ status: 'success', data: orderData });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});




module.exports = router;