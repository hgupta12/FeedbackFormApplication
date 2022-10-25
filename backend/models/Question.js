const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    form:{
        type:mongoose.Types.ObjectId,
        ref:'Form',
        required:true
    },
    text:{
        type:String,
        required:true
    },
    required:{
        type: Boolean,
        default:false
    }
})

module.exports = mongoose.model('Question',questionSchema);