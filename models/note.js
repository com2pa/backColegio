const mongoose = require('mongoose');

const NoteSchema =new mongoose.Schema({
    ponderacion : Number,
  
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentRegistration'
    }],
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    assignment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignments'
    },
    degree:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Degree'  
    }
})

NoteSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
