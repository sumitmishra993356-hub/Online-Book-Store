const router = require('express').Router();
const book = require('../models/book');
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');


// add book to favourite
router.put('/add-book-to-favourite', authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        // const isBookFavourite = await userData.favourites.includes(bookid);
        const isBookFavourite = userData.favourites.some(
  (fav) => fav.toString() === bookid
);
        if (isBookFavourite) {
            return res.status(400).json({ message: 'Book already in favourite' });
        }
        await User.findByIdAndUpdate(id, {
            $push: { favourites: bookid }
        }, { new: true });
        return res.status(200).json({ message: 'Book added to favourite successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// remove book from favourite
router.put('/remove-book-from-favourite', authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        // const isBookFavourite = await userData.favourites.includes(bookid);
        const isBookFavourite = userData.favourites.some(
  (fav) => fav.toString() === bookid
);
        if (isBookFavourite) {
            await User.findByIdAndUpdate(id, {
                $pull: { favourites: bookid } 
            }, { new: true });
            return res.status(200).json({ message: 'Book removed from favourite successfully' });
        }
        return res.status(400).json({ message: 'Book not in favourite' });

    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// get all favourite books
router.get('/get-all-favourite-books', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate('favourites');
        const favouriteBooks = userData.favourites;
        return res.status(200).json({ status: 'success', favourites: favouriteBooks });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// clear all favourite books
router.delete('/clear-all-favourite-books', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        await User.findByIdAndUpdate(id, {
            $set: { favourites: [] }
        }, { new: true });
        return res.status(200).json({ message: 'All favourite books cleared successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;