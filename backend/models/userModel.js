const bycrypt = require('bcryptjs')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String, 
        required: true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    picture : {
        type: String,
        required : true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},
{
    timestamps:true
}
)

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bycrypt.compare(enteredPassword,this.password)
}

userSchema.pre('save', async function (next){
    if(!this.isModified){
        next()
    }

    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password , salt)
})

const User = mongoose.model("User", userSchema)

module.exports = User;