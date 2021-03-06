const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

delete mongoose.connection.models['User'];

//define Schema
const UserSchema = new Schema({
    first_name: { 
        type: String, 
        required: true 
    },
    last_name: { 
        type: String, 
        required: true 
    },
    user_name: { 
        type: String, 
        required: true, 
        unique: true
    },
    role: { 
        type: String, 
        default: "user" 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        min: 6 
    },
    password: { 
        type: String, 
        required: true, 
        min: 6, 
        max: 32 
    },
    user_img_url: {
        type: String,
        default: "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
    },
    reg_date: { 
        type: Date, 
        default: Date.now() 
    },
    phone: String,
    street: String,
    house_nr: String,
    city_code: String,
    city_name: String,
    country: String,
    company: String,
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Video' 
    }],
})

UserSchema.plugin(uniqueValidator);

//create Model
const User = mongoose.models.User || mongoose.model('User', UserSchema)

module.exports = {
    UserSchema: UserSchema,
    User: User
};