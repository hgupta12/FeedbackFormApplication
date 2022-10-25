const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    shareLink:{
        type:String
    }
})

module.exports = mongoose.model('Form',formSchema)