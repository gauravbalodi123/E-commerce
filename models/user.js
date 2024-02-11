
const mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({

    email:{
        type:String,
        trim:true,
        required:true
    },

    // username and passport willbe added automatically by passport mongoose
    // username:{

    // }
    // ,
    // password:{

    // }

    role:{
        type:String,
        default:'buyer'
    },
    
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],

    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]

    
})

// now the user schema is ready to use the passport local mongoose power
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User' , userSchema);

module.exports = User;



