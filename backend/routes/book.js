const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const { authenticateToken } = require('./userAuth');

// add book admin only
// router.post('/add-book', authenticateToken, async (req, res) => {
//     try {
//         console.log("HEADERS:", req.headers);
//         console.log("BODY:", req.body);
//         console.log("USER:", user);

//         const { id } = req.headers;

//         if (!id) {
//             return res.status(400).json({ message: "User ID missing" });
//         }

//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (user.role !== 'admin') {
//             return res.status(403).json({ message: 'Access denied' });
//         }

//         const { url, title, author, price, desc, language } = req.body;

//         // if (!url || !title || !author || !price)
//         if (!url || !title || !author || price === undefined)
//              {
//             return res.status(400).json({ message: "Missing fields" });
//         }

//         const book = new Book({
//             url,
//             title,
//             author,
//             price: Number(price), // 🔥 fix
//             desc,
//             language,
//         });

//         await book.save();

//         res.status(201).json({ message: 'Book added successfully' });

//     } catch (error) {
//         console.error("🔥 ADD BOOK ERROR:", error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

router.post('/add-book', authenticateToken, async (req, res) => {
  try {
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    const { id } = req.headers;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { url, title, author, price, desc, language } = req.body;

    if (!url || !title || !author || price === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const parsedPrice = Number(price);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const book = new Book({
      url,
      title,
      author,
      price: parsedPrice,
      desc,
      language,
    });

    await book.save();

    res.status(201).json({ message: 'Book added successfully' });

  } catch (error) {
    console.error("🔥 ADD BOOK ERROR FULL:", error.message, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// update book admin only
// router.put('/update-book', authenticateToken, async (req, res) => {
//     try {
//         const {bookid} = req.headers;
//         await Book.findByIdAndUpdate(bookid, {
//             url: req.body.url,
//             title: req.body.title,
//             author: req.body.author,
//             price: req.body.price,
//             desc: req.body.desc,
//             language: req.body.language
//         }, { new: true });

//         return res.status(200).json({ message: 'Book updated successfully' });

//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

router.put('/update-book/:bookid', authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;

        const updatedBook = await Book.findByIdAndUpdate(
            bookid,
            {
                url: req.body.url,
                title: req.body.title,
                author: req.body.author,
                price: req.body.price,
                desc: req.body.desc,
                language: req.body.language
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({
            message: 'Book updated successfully',
            book: updatedBook
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// delete book admin only
router.delete('/delete-book/:bookid', authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;

        // 1. Validate ID format
        if (!bookid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        // 2. Find book first
        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // 3. (Optional but IMPORTANT) Check ownership
        // if (book.user.toString() !== req.user.id) {
        //     return res.status(403).json({ message: "Unauthorized" });
        // }

        // 4. Delete book
        await Book.findByIdAndDelete(bookid);

        return res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        console.error(error); // log error
        return res.status(500).json({ message: "Internal server error" });
    }
});



// get all books
router.get('/get-all-books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// search book by title, author, language
router.get('/search-books', async (req, res) => {
    try {   
        const {query} = req.headers;
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { language: { $regex: query, $options: 'i' } }
            ]
        });
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// get books by language
router.get('/get-books-by-language', async (req, res) => {
    try {
        const {language} = req.headers;
        const books = await Book.find({ language: { $regex: language, $options: 'i' } });
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get books by author
router.get('/get-books-by-author', async (req, res) => {
    try {
        const {author} = req.headers;   
        const books = await Book.find({ author: { $regex: author, $options: 'i' } });
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get books by price range
router.get('/get-books-by-price-range', async (req, res) => {
    try {   
        const {minPrice, maxPrice} = req.headers;
        const books = await Book.find({ price: { $gte: minPrice, $lte: maxPrice } });
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get books by title
router.get('/get-books-by-title', async (req, res) => {
    try {
        const {title} = req.headers;
        const books = await Book.find({ title: { $regex: title, $options: 'i' } });
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get recent books
router.get('/get-recent-books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.status(200).json({ status: 'success', books: books });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }   
});

// get book by id
// router.get('/get-book-by-id/:bookid', async (req, res) => {
//     try {
//         const {bookid} = req.headers;
//         const book = await Book.findById(req.params.bookid);
//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }
//         return res.status(200).json({ status: 'success', book: book });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

router.get('/get-book-by-id/:bookid', async (req, res) => {
    try {
        const { bookid } = req.params; // ✅ FIXED

        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({
            status: 'success',
            book: book
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
