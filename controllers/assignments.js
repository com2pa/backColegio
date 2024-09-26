const assignmentsRouter = require('express').Router()
const User =require('../models/user')
const Degree =require('../models/degree')
const Subject =require('../models/subject')
const Assignments = require('../models/assignments')



// obtener todas las asignaciones
assignmentsRouter.get('/', async (request, response) => {
    // obtener todas las asignaturas
    const user = request.user
    if(user.role !=='maestro' ){
        return response.status(401).json('No estas autorizado para esta función')
    }

    // populate('subjectSelected','name').populate('selectedDegree','name')
    const assignments = await Assignments.find({})
    // .populate('degree','degree')
    // .populate('subjects','name')
        // .populate({
    //     path: 'subjects',
    //     match: 'name'
    // })
    // .populate({
    //     path:'degree',
    //     match:'degree'
    // })
    // console.log(assignments)
    return response.status(200).json(assignments);
});

// crear assignaciones
assignmentsRouter.post('/', async (request,response)=>{
    // obtener el usuario loguiado
    const user = request.user;
    if(user.role !== 'maestro'){
        return response.status(401).json('No estas autorizado para esta función')
    }
    const{
        name,
        tipo,
        lapso,
        selectedDegree,
        subjectSelected,
    }=request.body;
    
    // console.log(
    //     name,
    //     tipo,
    //     lapso,
    //     selectedDegree,
    //     subjectSelected,
    // )

    // validar los datos 
    if(!name ||!tipo ||!lapso || !subjectSelected || !selectedDegree ){
        return response.status(400).json('Los datos son incorrectos')
    }

    
    const degree = await Degree.findById(selectedDegree)
    if(!degree){
        return response.status(400).json('Grado no encontrado')
    }

    const subject = await Subject.findById(subjectSelected)
    if(!subject){
        return response.status(400).json('Asignatura no encontrada')
    }

    // verificar numero de asignaciones
    let LimiteAsignaciones = await Assignments.find({name})
    if(LimiteAsignaciones.length > 3){
        return response.status(400).json('Solo puede crear 3 temas')
    }
    
    // verificar el numero de tipo por name
    // let LimiteTipoAsignaciones = await Assignments.find({tipo})
    // if(LimiteTipoAsignaciones.length > 3){
    //     return response.status(400).json('Solo puede crear 3 actividades por tema ')
    // }
        // creo la asignacion 
    const newAssignment = new Assignments({
        name,
        tipo,
        lapso,
        degree: degree._id,
        subjects: subject._id,
        // subject: subjectSelected,  // se cambia para que sea un array de ids
        user: user._id,
    })

    
    

    await newAssignment.save()
    // guardar las asignaciones en el grado
    degree.assignments.push(newAssignment);
    // guardar la asignaciones por asignatura
    subject.assignments.push(newAssignment);
    // guardo los cambios en el grado y la asignatura
    await subject.save();
    await degree.save();
    // retorno la nueva asignación
   
    return response.status(201).json(newAssignment)
        
       
        
    

}) ;

// eliminar la asignacion

assignmentsRouter.delete('/:id', async (request, response) => {
    // obtener el usuario logueado
    const user = request.user;
    console.log('usuario ',user);

    if(user.role!== 'maestro'){
        return response.status(401).json('No estas autorizado para esta función')
    }
    // obtener la asignacion 
    const assignment = await Assignments.findByIdAndDelete(request.params.id);
    console.log('asignacion a eliminar',assignment)
    
  
    // eliminar la asignacion de la lista del grado
    const degree = await Degree.findByIdAndUpdate(assignment.degree, {$pull: {assignments: assignment._id}})
    // eliminar la asignacion de la lista de la asignatura
    const subject = await Subject.findByIdAndUpdate(assignment.subjects, {$pull: {assignments: assignment._id}})
    const guardando = await user.save();
    
    // retorno un mensaje de confirmación
    return response.status(200).json('Asignación eliminada')
});

module.exports = assignmentsRouter;