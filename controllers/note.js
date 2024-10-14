const noteRouter = require('express').Router();
const students =require('../models/StudentRegistration')
const degree= require('../models/degree')
const assignment = require('../models/assignments')
const subject = require('../models/subject')


// creando la nota para el estudiante
// studentId/:subjectId/:assignmentId
noteRouter.post('/:id', async (request, response) => {
    const { studentId, subjectId, assignmentId, ponderacion, } = request.body;

    // verifico que el estudiante exista
    const studentFound = await students.findById(studentId);
    if (!studentFound) {
        return response.status(404).json('El estudiante no existe')
    }

    // verifico que la materia exista
    const subjectFound = await subject.findById(subjectId);
    if (!subjectFound) {
        return response.status(404).json('La materia no existe')
    }

    // verifico que la tarea exista
    const assignmentFound = await assignment.findById(assignmentId);
    if (!assignmentFound) {
        return response.status(404).json('La tarea no existe')
    }
    // verifico que la ponderación sea un número positivo
    if (ponderacion <= 0) {
        return response.status(400).json('La ponderación debe ser un número positivo')
    }
    // creo la nota
    const newNote = {
        student: studentId,
        subject: subjectId,
        assignment: assignmentId,
        ponderacion,
    }
    const savedNote = await newNote.save();
    return response.status(201).json(savedNote)

    // // // actualizo el promedio del estudiante
    // const totalNotas = studentFound.notes.length;
    // const sumaNotas = studentFound.notes.reduce((sum, note) => sum + note.ponderacion, 0);
    // const promedio = sumaNotas / totalNotas;
    // studentFound.promedio = promedio;
    // await studentFound.save();
    // // actualizo el promedio de la materia
    // const totalNotasMateria = subjectFound.notes.length;
    // const sumaNotasMateria = subjectFound.notes.reduce((sum, note) => sum + note.ponderacion, 0);
    // const promedioMateria = sumaNotasMateria / totalNotasMateria;
    // subjectFound.promedio = promedioMateria;
    // await subjectFound.save();
    // // actualizo el promedio del grado
    // const totalNotasGrado = degreeFound.students.reduce((sum, student) => sum + student.promedio, 0);
    // const promedioGrado = totalNotasGrado / degreeFound.students.length;
    // degreeFound.promedio = promedioGrado;
    // await degreeFound.save();
    // // actualizo el promedio de la tarea
    // const totalNotasTarea = assignmentFound.notes.length;
    // const sumaNotasTarea = assignmentFound.notes.reduce((sum, note) => sum + note.ponderacion, 0);
    // const promedioTarea = sumaNotasTarea / totalNotasTarea;
    // assignmentFound.promedio = promedioTarea;
    // await assignmentFound.save();


})

module.exports = noteRouter;


