const degreesRouter=require('express').Router();
const User =require('../models/user')
const Degree =require('../models/degree')


//obtener todos los grados 

degreesRouter.get('/', async (request, response) => {
    // nos muestra el usuario logiado 
    const user = request.user;
    // muestra todos los grados
    const degrees = await Degree.find({});
    // console.log('mis grados', degrees)
    return response.status(200).json(degrees);
});

// ----------------- crear grado

degreesRouter.post('/', async (request, response) => {
    // nos muestra el usuario logiado 
    const user = request.user;
    console.log('usuario ',user)
    // verifico si el usuario es administrado
    if(user.role!=='admin'){
        return response.status(401).json('No estas autorizado para esta funcion')
    }
    // validamos los datos
    const { degree} = request.body;
    console.log('id',degree)
    if (!degree) {
        return response.status(400).json('Los datos son incorrectos');
    }
    // creamos un nuevo grado
    const newDegree = new Degree({ 
        degree,
        user:user._id,
     });
     console.log('nuevo grado', newDegree);
    // lo guardo en est variable
    const savedDegree = await newDegree.save();
    console.log('guardando' ,savedDegree)
    // agrego grado al usuario
    if(!user.degree){
        user.degree = [];  // Initialize the user's Degree array if it's empty  // If the user does not have a Degree array, initialize it to an empty array.  // This is necessary to avoid an error when trying to push the new degree's ID to the array.  // This condition is necessary because the user's Degree array is initially an empty array when the user is created.  // If the user already has a Degree array, this condition will not be met, and the user's Degree array will remain the same.  // If the user does not have a Degree array, this condition will ensure that the user's Degree array is not null when trying to push the new degree's ID to it.  // If the user does not have a Degree array, this condition will not be met, and the user's Degree array will remain the same.  // This condition is necessary because the user's Degree array is
    }
      user.degree.concat(savedDegree._id);
    //  User.degree.push(savedDegree._id); // Add the new degree's ID to the user's Degree array

    // guardamos los cambios en el usuario
    await user.save();

      // lo devuelvo
    return response.status(201).json(savedDegree);
});

// eliminar
degreesRouter.delete('/:id', async (request, response) => {
    // nos muestra el usuario logiado 
    const user = request.user;
    console.log('usuario ',user)
    // verifico si el usuario es administrado
    if(user.role!=='admin'){
        return response.status(401).json('No estas autorizado para esta funcion')
    }
    // busco el id
    const elimi =await Degree.findByIdAndDelete(request.params.id)
    console.log('eliminado', elimi)
    // elimino el id del usuario en la lista de grados
    user.degree = user.degree.filter(ser=>ser.id !== request.params.id)

    // guardamos los cambios en el usuario
    const guardando = await user.save();
    // lo devuelvo
    return response.status(200).json('Grado eliminado correctamente');

 
    
});

module.exports=degreesRouter;