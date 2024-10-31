const noteRouter = require('express').Router();
const students =require('../models/StudentRegistration')
const Degree= require('../models/degree')
const assignment = require('../models/assignments')
const Subject = require('../models/subject')
const Note = require('../models/note')

// mostrar toda las nota 
 noteRouter.get('/', async (request, response) => {
    // obtener todas las notas
    const notes = await Note.find({}).
    populate('students','lastname name').
    populate('subject','name').
    populate('assignment','name tipo').
    populate('degree','degree')
    // console.log('notas', notes)
    // mostrar las notas
    return response.status(200).json(notes);
});



// creando la nota para el estudiante
noteRouter.post('/', async (request, response) => {
     // nos muestra el usuario logiado
     const user = request.user;
     if(user.role !== 'maestro'){
         return response.status(401).json('No estas autorizado para esta función')
 
     }
    const { student, subject, assignment, ponderacion, degree } = request.body;
    
    console.log('nota del alumno',student ,request.body)

    // // verificar que todos existan
    if(!student || !subject || !assignment || !ponderacion){
        return response.status(400).json('Todos los campos son requeridos');
    } 
    // // // verifico que la ponderación sea un número positivo
    if (ponderacion <= 0) {
        return response.status(400).json('La ponderación debe ser un número positivo')
    }

    // // // creo la nota
    const newNote = new Note({
        students: student,
        subject: subject,
        assignment: assignment,
        ponderacion,
        degree: degree._id,
    });

    // busco el grado
    // const degreeFound = await degree.findById(degree._id);
    // if (!degreeFound) {
    //     return response.status(404).json('El grado no existe')
    // }
    // // busco la materia
    // const subjectFound = await subject.findById(subject);
    // if (!subjectFound) {
    //     return response.status(404).json('La materia no existe')
    // }
    // // busco la tarea
    // const assignmentFound = await assignment.findById(assignment);
    // if (!assignmentFound) {
    //     return response.status(404).json('La tarea no existe')
    // }
    // // verifico que el estudiante esté registrado en el grado
    // const studentFound = await Degree.students.findById(student);
    // if (!studentFound) {
    //     return response.status(404).json('El estudiante no se encuentra registrado en este grado')
    // }
    // // // verifico que el estudiante no tenga la misma tarea en el mismo grado
    const noteFound = await Note.findOne({ students: student, subject: subject, assignment: assignment });
    if (noteFound) {
        return response.status(400).json('El estudiante ya tiene una nota para esta tarea')
    }

    // guardo la nota
    const savedNote = await newNote.save();
    console.log('guardo la nota',savedNote)

    // // // // actualizo la materia
    // const totalNotas = subjectFound.notes.length;
    // const sumaNotas = subjectFound.notes.reduce((sum, note) => sum + note.ponderacion, 0);
    // const promedio = sumaNotas / totalNotas;
    // subjectFound.promedio = promedio;
    // await subjectFound.save();
    // // // // actualizo la tarea
    // totalNotas = assignmentFound.notes.length;
    // sumaNotas = assignmentFound.notes.reduce((sum, note) => sum + note.ponderacion, 0);
    // promedio = sumaNotas / totalNotas;
    // assignmentFound.promedio = promedio;
    // await assignmentFound.save();
    // // // actualizo el estudiante
    // studentFound.notes.push(newNote._id);
    //

    return response.status(200).json(savedNote)

   

})

module.exports = noteRouter;


