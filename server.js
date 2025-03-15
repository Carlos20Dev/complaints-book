// Dependencias
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

// Configuración de express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite peticiones de cualquier origen (Frontend)
app.use(express.json()); // Permite parsear un JSON

// Configurar NodeMailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', //Usar Gmail como servicio
    auth: {
        user: process.env.EMAIL_USER, // Correo electrónico
        pass: process.env.email_PASS, // Contraseña
    },
});

// Rutas para enviar el formulario
app.post('/enviar-reclamo', (req, res) => {
    const { nombres, dni, direccion, telefono, email, descripcion, fecha, producto, monto } = req.body;
  
    // Validar campos obligatorios
    if (!nombres || !dni || !descripcion) {
      return res.status(400).json({ error: 'Por favor, complete todos los campos obligatorios.' });
    }

    // Configuración del email
    const mailOptions = {
        from: process.env.EMAIL_USER, // Remitente
        to: process.env.EMAIL_USER, // Destinatario
        subject: 'Nuevo reclamo', // Asunto del correo
        text: `
            Nombre: ${nombres}
            DNI: ${dni}
            Dirección: ${direccion}
            Teléfono: ${telefono}
            Email: ${email}
            Descripción: ${descripcion}
            Fecha: ${fecha}
            Producto: ${producto}
            Monto: ${monto}
        `,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo', error);
            return res.status(500).json({ error: 'Ocurrió un error al enviar el correo.' });
        } else {
            console.log('Email enviado: ' + info.response);
            return res.status(200).json({ message: 'Correo enviado correctamente.' });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});