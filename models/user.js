const mongoose= require('mongoose');
// modelo las base datos
// documents 
const userSchema =new mongoose.Schema({
    name: String,
    lastname: String,    
    phone: Number,        
    email:String,        
    password:String,
    address:String,
    cedula:Number,           
    role:{
        type:String,
        // enum:['representante','maestro','controDeEstudio','director']
        default:'representante'
    },       
    verificacion:{
        type:Boolean,
        default:false
    },
    degree:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Degree'
    }]
    
})

// funcion para transformar datos cuando se solicite 
// returnedObject= lo que estoy solicitendo
userSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password; 
    }
})

const User = mongoose.model('User',userSchema);   

module.exports = User;