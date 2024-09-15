const assignmentsRouter = require('express').Router()
const User =require('../models/user')
const Degree =require('../models/degree')
const Subject =require('../models/subject')
const Assignment = require('../models/assignment')

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
        selecetedSubject,
    }=request.body;
    // validar los datos
    if(!name ||!tipo ||!lapso || !selecetedSubject || !selectedDegree ){
        return response.status(400).json('Los datos son incorrectos')
    }

    // creo la asignacion 
    const degree = await Degree.findById(selectedDegree)
    if(!degree){
        return response.status(400).json('Grado no encontrado')
    }
    const subject = await Subject.findById(selecetedSubject)
    if(!subject){
        return response.status(400).json('Asignatura no encontrada')
    }
    const newAssignment = new Assignment({
        name,
        tipo,
        lapso,
        degree: degree._id,
        subject: subject._id,
        user: user._id,
    })
    await newAssignment.save()
    return response.status(201).json(newAssignment)

}) 