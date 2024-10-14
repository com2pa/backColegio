const mongoose = require('mongoose');

const AssignmentsSchema = new  mongoose.Schema({
    name: String,
    tipo:{
        type: String,
        enum:[
            'individual',
            'grupal',
            'exposicion',
            'examen', 
            'trabajo escrito',
            'dibujo',
            'maqueta',
            'ejercicio',

        ]
    },
    lapso:{
        type:String,
        enum:[
            '1er lapso',
            '2do lapso',
            '3er lapso',
            'Recuperacion Vacional',
        ]
    },
    subjects:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    degree:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Degree'
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }
})
AssignmentsSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Assignments = mongoose.model('Assignments', AssignmentsSchema);

module.exports = Assignments;