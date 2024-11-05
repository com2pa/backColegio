const studentsRegistrationsRouter = require('express').Router();
const User = require('../models/user');
const Degree =require('../models/degree')
const StudentRegistration = require('../models/StudentRegistration');
// correo envio
const nodemailer = require("nodemailer");
const { PAGE_URL } = require('../config');
const { usertExtractor } = require("../middleware/auth");
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');



// obtener todos los estudiantes registrados

studentsRegistrationsRouter.get('/', async (request, response) => {
    // nos muestra el usuario logiado 
    const user = request.user;
    if(user.role !== 'representante' && user.role !== 'admin' && user.role !== 'maestro'){
        return response.status(401).json('No estas autorizado para esta función')
    }
    // studentsRegistrations = await StudentRegistration.find({});
    
    // // muestra todos los estudiantes registrados
    let studentsRegistrations;
    if (user.role === 'representante') {
        studentsRegistrations = await StudentRegistration.find({ user: user._id });
    }else {
        studentsRegistrations = await StudentRegistration.find({});
    }

    // console.log('estudiantes registrados', studentsRegistrations)
    return response.status(200).json(studentsRegistrations);
 
});

// crear un nuevo estudiante registrado
studentsRegistrationsRouter.post('/',async(request,response)=>{
    // nos muestra el usuario logiado
    const user = request.user;
    if(user.role !== 'representante'){
        return response.status(401).json('No estas autorizado para esta función')

    }
    // obtener los datos del estudiante
    const{
        name,
        lastname,
        age,
        sex,
        selectedDegree,        
    }= request.body;
    // console.log(name,
    //     lastname,
    //     age,
    //     sex,
    //     selectedDegree)
    // verificar si todos los usuarios existen
    if(!name || !lastname  || !age || !sex || !selectedDegree ){
        return response.status(400).json('Todos los campos son requeridos');
    }

    // verifico si el alumno ya fue registrado por el nombre y apellido
    const studentExist = await StudentRegistration.findOne({name, lastname})
    if (studentExist){
        return response.status(400).json('YA FUE REGISTRADAS')
    }

    // añado el alumno al grado enviado
    const degreeFound = await Degree.findById(selectedDegree)
    if(!degreeFound){
        return response.status(404).json('El grado no existe')
    }
    // creo el nuevo estudiante
    const newStudent = new StudentRegistration({
        name,
        lastname,
        age,
        sex,
        degree: degreeFound._id,
        user: user._id,
    });
    // guardo el estudiante
    const savedStudent = await newStudent.save();
    // añado el estudiante al grado
    degreeFound.students.push(savedStudent);
    // guardo el grado
    await degreeFound.save();
    // retorno el estudiante guardado
    // return response.status(201).json(savedStudent);
    
    
    // // enviar correo como comprobante de estudiante inscrito
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });
    // const filePath = path.join(__dirname, '../templates/RegistroStudens.html');
    // let htmlTemplate = '';
    // try {
    //     htmlTemplate = fs.readFileSync(filePath, 'utf8');
    //   } catch (err) {
    //     console.error(`Error reading HTML template: ${err}`);
    //   }
    // //  como enviar el correo html: htmlTemplate 
    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to:  [process.env.EMAIL_USER, User.email],
        subject: "Inscripcion  ✔", // Subject line
        text: "Inscripcion  ✔  ",
        html:`ha inscrito las siguientes personas :
            <p>${savedStudent.name} </p>
            <p>${savedStudent.lastname} </p>
            <p>${savedStudent.age} </p>
           `  
       
      });

      return response.status(201).json(savedStudent);
    



})

module.exports = studentsRegistrationsRouter;