const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./userAuth');


// signup
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // check username length is more than 3
        if (username.length < 4) {
            return res.status(400).json({ message: 'Username length should be greater than 3' });
        }

        // check username is unique
        // const existingUser = await User.findOne({ username: username });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'Username already exists' });
        // }

        // check email is unique
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // check password length is more than 6
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password length should be greater than 5' });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            address: address
        });

        // save user to database
        await newUser.save();
        return res.status(200).json({ message: 'Signup successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
            const authClaims =
                [
                    { email: existingUser.email },
                    { role: existingUser.role },
                    { _id: existingUser._id, }   // 🔥 MUST ADD THIS
                // { email: existingUser.email, 
                //  role: existingUser.role, 
                // _id: existingUser._id,}   // 🔥 MUST ADD THIS
                // {id: existingUser._id},

                ];


            const token = jwt.sign({ authClaims }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // //  Store in HTTP-only cookie
            // res.cookie("token", token, {
            //     httpOnly: true,
            //     secure: false, //  change to true in production (HTTPS)
            //     sameSite: "lax"
            // });

            return res.status(200).json({ message: 'Login successfully', id: existingUser._id, role: existingUser.role, token: token });
        }
        return res.status(400).json({ message: 'Invalid credentials' });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//Logout
// router.post('/logout', (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out" });
// });

// profile
// router.get('/profile', verifyUser, (req, res) => {
//   res.json({
//     user: req.user
//   });
// });

// get user information
router.get('/get-user-information', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        // const id = req.user.id; // ✅ USE THIS
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});






// update user address
// router.put('/update-user-address', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.headers;
//         const { address } = req.body;
//         const user = await User.findByIdAndUpdate(id, { address: address }, { new: true });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         return res.status(200).json({ message: 'Address updated successfully' });
//     }
//     catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });

//  update user profile (username, avatar, address)
router.put('/update-user', authenticateToken, async (req, res) => {
    try {
        // const userId = req.user.id;
        // const userId = req.user._id; // ✅ FIXED
         const userId = req.user?._id || req.headers.id; // 🔥 fallback

        console.log("REQ.USER:", req.user);
        console.log(req.user);

        const { username, avatar, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, avatar, address },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get all users (admin only)
router.get('/get-all-users', authenticateToken, async (req, res) => {
    try {
        const userRole = req.user?.role || req.headers.role; // 🔥 fallback

        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
