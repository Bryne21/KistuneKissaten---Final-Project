const express = require('express');
const cors = require("cors");
const fs = require("fs");
const path = require('path');
const multer = require('multer'); // Import multer
const mongoose = require("mongoose");
const app = express();

// --- MODELS ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

const menuSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    photo: { type: String },
    category: { type: String },
    subcategory: { type: String }
});

const Menu = mongoose.model("Menu", menuSchema);

app.use(cors());
app.use(express.json());

// dc connection
mongoose
    .connect("mongodb://127.0.0.1:27017/KistuneDB")
    .then(() => {
        console.log("Connected to MongoDB (KistuneDB)");
    })
    .catch((err) => console.error("Connection error:", err));

// 1. Serve the 'uploads' folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// --- MENU ROUTES ---

// Add Menu Item
app.post("/add-menu", upload.single('photo'), async (req, res) => {
    try {
        const menuData = JSON.parse(req.body.menuData);

        let photoUrl = null;
        if (req.file) {
            photoUrl = `http://localhost:1337/uploads/${req.file.filename}`;
        }

        const existing = await Menu.findOne({ id: menuData.id });
        if (existing) return res.status(400).send("Menu ID already exists");

        const newMenu = new Menu({
            id: menuData.id,
            name: menuData.name,
            description: menuData.description,
            price: menuData.price,
            photo: photoUrl,
            category: menuData.category,
            subcategory: menuData.subcategory
        });

        await newMenu.save();
        res.send("Menu item added successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Invalid data format or server error");
    }
});

app.get("/menu", async (req, res) => {
    try {
        const menuList = await Menu.find();
        res.json(menuList);
    } catch (error) {
        res.status(500).send("Error reading from database");
    }
});

app.put("/edit-menu/:id", upload.single('photo'), async (req, res) => {
    const customId = req.params.id;

    try {
        let updatedFields = req.body.menuData ? JSON.parse(req.body.menuData) : req.body;

        if (req.file) {
            updatedFields.photo = `http://localhost:1337/uploads/${req.file.filename}`;
        }

        const menu = await Menu.findOneAndUpdate({ id: customId }, updatedFields, { new: true });

        if (!menu) return res.status(404).send("Menu item not found");

        res.send("Menu item updated successfully!");
    } catch (error) {
        res.status(500).send("Error updating database");
    }
});

app.delete("/delete-menu/:id", async (req, res) => {
    const customId = req.params.id;

    try {
        const menuToDelete = await Menu.findOne({ id: customId });

        if (!menuToDelete) {
            return res.status(404).send("Menu item not found");
        }

        if (menuToDelete.photo) {
            const filename = menuToDelete.photo.split('/').pop();
            const filePath = path.join(__dirname, 'uploads', filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete local file:", err);
                } else {
                    console.log(`Successfully deleted image: ${filename}`);
                }
            });
        }

        await Menu.findOneAndDelete({ id: customId });
        res.send("Menu item and their image deleted successfully!");
    } catch (error) {
        res.status(500).send("Error deleting from database");
    }
});

// --- USER ROUTES ---

app.post("/add-user-db", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User added to database successfully!" });

    } catch (error) {
        console.error("Error adding user to database:", error);
        res.status(500).json({ message: "Error adding user to database" });
    }
});

app.get("/users-db", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users from database: ", error);
        res.status(500).json({ message: "Error fetching users from database" })
    }
});

app.put("/edit-user-db/:id", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, password }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

app.delete("/delete-user-db/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// --- LOGIN ROUTE ---

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});

const port = 1337;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
