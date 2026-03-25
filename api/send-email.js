const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ status: 'error', message: 'Método de solicitud no válido.' });
        return;
    }

    const { name, email, phone, service, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !service || !message) {
        res.status(400).json({ status: 'error', message: 'Por favor, complete todos los campos.' });
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ status: 'error', message: 'Dirección de correo electrónico no válida.' });
        return;
    }

    // Sanitize inputs
    const sanitize = (str) => String(str).replace(/[<>]/g, '');
    const safeName = sanitize(name);
    const safePhone = sanitize(phone);
    const safeEmail = sanitize(email);
    const safeService = sanitize(service);
    const safeMessage = sanitize(message);

    // Configure transporter with environment variables
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"COTIZACION SITIO WEB" <${process.env.SMTP_USER}>`,
        to: 'atencioncercaglez@gmail.com',
        subject: `Nueva solicitud de cotización de ${safeName}`,
        html: `
            <b>Nombre:</b> ${safeName}<br>
            <b>Teléfono:</b> ${safePhone}<br>
            <b>Email:</b> ${safeEmail}<br>
            <b>Servicio:</b> ${safeService}<br>
            <b>Mensaje:</b><br>${safeMessage}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'success', message: '¡Gracias! Tu cotización ha sido enviada con éxito.' });
    } catch (error) {
        console.error('Email error:', error);
        let userMessage = 'Hubo un error al enviar la solicitud. Por favor, inténtelo más tarde.';
        if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('getaddrinfo'))) {
            userMessage = 'No se pudo enviar. Compruebe su conexión a internet.';
        }
        res.status(500).json({ status: 'error', message: userMessage });
    }
};
