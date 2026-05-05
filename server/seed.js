const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Menu = require("./model/menu.model");

// Read data.json
const dataPath = path.join(__dirname, "../dashboard/src/MenuImages/data.json");
const rawData = fs.readFileSync(dataPath);
const menuItems = JSON.parse(rawData);

mongoose.connect("mongodb://127.0.0.1:27017/KistuneDB")
  .then(async () => {
    console.log("Connected to MongoDB for seeding.");
    await Menu.deleteMany({}); // Clear existing to prevent duplicates
    
    for (let item of menuItems) {
      await Menu.create(item);
    }
    
    console.log("Successfully seeded the database with the menu items!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
