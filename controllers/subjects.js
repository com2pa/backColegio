const subjectRouter =require('express').Router();
const Degree =require('../models/degree')
const Subject = require('../models/subject')

// obtengo todas las materias
subjectRouter.get('/', async (request, response) => {
    // obtener todas las materias
    const subjects = await Subject.find({})
    // console.log('materias', subjects)
    // mostrar las materias
    return response.status(200).json(subjects);
});

// crear una nueva asignatura
subjectRouter.post('/', async (request, response) => {
    const user = request.user
    if(user.role!=='admin'){
        return response.status(401).json('No estas autorizado para esta función')
    }
    // // obtener la asignacion 
    const{name}=request.body.name
        // const {degreeId} = await Degree.findById(request.params.id);
    // console.log(degreeId)
    // if (!degreeId) {
    //     return response.status(404).json({ error: 'El grado no existe' });
    // }
    // crear una nueva asignatura
    const newSubject = new Subject({
        name: request.body.name,
        // degree: request.params.id
        
    });
    // degree: degreeId

    // validar los datos
    if (!newSubject.name) {
        return response.status(400).json({ error: 'El nombre de la asignatura es obligatorio' });
    }
   
    // verificar que no exista una asignatura con el mismo nombre en el mismo grado
    // const subjectExists = await Subject.findOne({ name: newSubject.name, degree: degreeId });
    // if (subjectExists) {
    //     return response.status(400).json({ error: 'Ya existe una asignatura con el mismo nombre en este grado' });
    // }

    // verificar que no exista una asignatura con el mismo nombre en el mismo grado
    const subjectExists = await Subject.findOne({name:newSubject.name})
    if (subjectExists) {
        return response.status(400).json({ error: 'Ya existe una asignatura con el mismo nombre' });
    }

    // guardar la nueva asignatura
    const savedSubject = await newSubject.save();
    console.log('asignatura guardada!', savedSubject)

    // // // // agregar la nueva asignatura al grado
    // if (Degree) {
    //     Degree.subjects.push(savedSubject._id);
    //     await Degree.save();
    // } else {
    //     return response.status(404).json({ error: 'El grado no existe' });
    // }
    // mostrar la nueva asignatura
    return response.status(200).json(savedSubject);

});

// editar la asignatura

subjectRouter.put('/:id', async (request, response) => {
    const user = request.user
    if(user.role!=='admin'){
        return response.status(401).json('No estas autorizado para esta función')
    }
    //    lo que envia el frontEnd
    const{name}=request.body
    console.log('se envia asignatura a cambiar', name)
    // busco la asignatura
    const subject = await Subject.findByIdAndUpdate(request.params.id, {name}, {new: true});
    console.log('asignatura actualizada', subject)
    // verificar que la asignatura exista
    if (!subject) {
        return response.status(404).json({ error: 'La asignatura no existe' });
    }
    // guardo asignatura modificada
    const updateSubject = await subject.save()
    console.log('asignatura modificada', updateSubject)
    // mostrar la nueva asignatura
    return response.status(200).json(updateSubject);
  
 });


 
// eliminar asignatura

subjectRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if(user.role!=='admin'){
        return response.status(401).json('No estas autorizado para esta función')
    }
    // obtener la asignatura
    const subject = await Subject.findByIdAndDelete(request.params.id);
    console.log('asignatura a eliminar',subject)
    // verificar que la asignatura no exista
    if (!subject) {
        return response.status(404).json({ error: 'La asignatura no existe' });
    }
     

//     // mostrar mensaje de exito
    return response.status(200).json('asignatura eliminada');
});

// actualizar 
subjectRouter.patch('/:id', async(request, response)=>{
    const { degree } = request.body;

    // busco la asignatura
    const subject =await Subject.findById(request.params.id)
    if(!subject){
        return response.status(400).json('asignatura no encontrada');
    }

    // actualizo la materia en la base de datos
    const updatedSubject = await Subject.findByIdAndUpdate(request.params.id, {degree}, {new: true})
    console.log('asignatura modificada', updatedSubject);
    // muestro la materia modificada
    return response.status(200).json(updatedSubject)

})

module.exports = subjectRouter;

