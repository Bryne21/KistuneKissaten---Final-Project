const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String }
});

module.exports = mongoose.model("Menu", menuSchema);
