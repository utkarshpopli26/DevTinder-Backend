const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://Utkarsh:xhGeV4mjXSn46kes@namastenodejs.zeda1sh.mongodb.net/DevTinder");
}

module.exports = connectDb;
