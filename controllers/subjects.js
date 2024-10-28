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
        
    });


    // validar los datos
    if (!newSubject.name) {
        return response.status(400).json({ error: 'El nombre de la asignatura es obligatorio' });
    }
   
    // verificar que no exista una asignatura con el mismo nombre en el mismo grado
    const subjectExists = await Subject.findOne({name:newSubject.name})
    if (subjectExists) {
        return response.status(400).json({ error: 'Ya existe una asignatura con el mismo nombre' });
    }

    // guardar la nueva asignatura
    const savedSubject = await newSubject.save();
    console.log('asignatura guardada!', savedSubject)
// agregando la asignatura al grado
    // Degree.subjects.push('agregado la asignatura al grado',savedSubject);
    // await Degree.save();
   
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


    // const{id}=request.params.id
    // console.log(id)  

    // // obtener la asignatura
    const subject = await Subject.findByIdAndDelete(request.params.id);
    console.log('asignatura a eliminar ',subject)
    
    
    // // // eliminar la materia de los grados
    if(subject.degree) {
        const degree = await Degree.findById(subject.degree);
        if (degree) {
            degree.subjects = degree.subjects.filter(subjectId => subjectId.toString() !== request.params.id);
            await degree.save();
            console.log('materias modificadas', degree.subjects)
        }
    }
    // // // mostrar mensaje de exito
    return response.status(200).json('materia eliminada');
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
    const updatedSubject = await Subject.findByIdAndUpdate(request.params.id,{degree},{new:true})
    console.log('asignatura modificada', updatedSubject)

    // añado la materia en los grado seleccionado
    // Verifica si la propiedad 'degree' existe
if (degree) {
    // Si 'degree' es un array, se almacena en la variable 'degrees'.
    // De lo contrario, se convierte en un array con un solo elemento, que es 'degree'.
    const degrees = Array.isArray(degree) ? degree : [degree];

    // Itera sobre cada elemento 'degId' del array 'degrees'
    for (const degId of degrees) {
        // Busca el grado correspondiente utilizando 'Degree.findByIdAndUpdate()'
        const degreeFound = await Degree.findByIdAndUpdate(
            degId,
            // Utiliza el operador '$addToSet' para añadir el ID de la materia ('updatedSubject._id')
            // al array 'subjects' del grado
            { $addToSet: { subjects: updatedSubject._id } },
            // La opción '{ new: true }' se utiliza para devolver el grado actualizado después de la actualización
            { new: true }
        );

        // Si el grado se actualiza correctamente (es decir, si 'degreeFound' no es 'null'),
        // imprime un mensaje de confirmación con el grado actualizado
        if (degreeFound) {
            console.log('materia añadida al grado', degreeFound);
        }
    }
}
  
    
    // mostrar la nueva asignatura
    return response.status(200).json(updatedSubject)

   


    
    
   

})

module.exports = subjectRouter;

