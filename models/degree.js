const mongoose = require('mongoose');
// grados de 1 a 6 grado
const degreeSchema= new mongoose.Schema({
    degree: Number,
    maestro:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subjects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]


})
degreeSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
 
})

const Degree = mongoose.model('Degree',degreeSchema);

module.exports = Degree;