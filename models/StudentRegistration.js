const mongoose = require('mongoose');

const StudentRegistrationSchema =new mongoose.Schema({
    name: String, 
    lastname:String,
    age: Number,
    sex:[{
        type: String,
        enum:['niño','niña']
    }],
    degree:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Degree'
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
    
})

StudentRegistrationSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const StudentRegistration = mongoose.model('StudentRegistration',StudentRegistrationSchema);

module.exports = StudentRegistration;