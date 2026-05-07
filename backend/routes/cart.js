const mongoose = require('mongoose');
// const bookObjectId = mongoose.Types.ObjectId(bookid);
const router = require('express').Router();
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');


// put book to cart
router.put('/add-book-to-cart', authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    const user = await User.findById(id);

    // check already exists
    const exists = user.cart.includes(bookid);

    if (exists) {
      return res.status(400).json({
        message: "Already in cart"
      });
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid }
    });

    res.json({ message: "Added to cart" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// remove book from cart
router.put('/remove-book-from-cart/:bookid', authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const userId = req.headers.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { cart: bookid }
    });

    res.json({ message: "Removed from cart" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get user cart

router.get('/get-user-cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    const user = await User.findById(userId)
      .populate("cart"); // 🔥 THIS IS KEY

    res.json({
      cart: user.cart
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;