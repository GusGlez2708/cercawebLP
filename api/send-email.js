import nodemailer from 'nodemailer';

export default async function handler(req, res) {
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

    // Determine base URL for images
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'cercaglez.com';
    const baseUrl = `${protocol}://${host}`;

    const mailOptions = {
        from: `"COTIZACION SITIO WEB" <${process.env.SMTP_USER}>`,
        to: 'contacto@cercaglez.com',
        subject: `Nueva solicitud de cotización de ${safeName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
                .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e1e5eb; }
                .header { background-color: #0f1d43; padding: 30px 20px; text-align: center; color: #ffffff; }
                .header img { max-width: 150px; margin-bottom: 15px; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; color: #ffffff; }
                .content { padding: 30px; color: #333333; }
                .content p { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
                .info-box { background-color: #f8fafc; border-left: 4px solid #e87416; padding: 15px 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0; }
                .info-item { margin-bottom: 10px; font-size: 15px; }
                .info-item strong { color: #0f1d43; display: inline-block; width: 90px; }
                .message-box { background-color: #ffffff; border: 1px solid #e1e5eb; padding: 20px; border-radius: 8px; font-style: italic; color: #555555; line-height: 1.6; }
                .message-title { font-weight: bold; color: #0f1d43; margin-bottom: 10px; font-size: 16px; border-bottom: 2px solid #e87416; padding-bottom: 5px; display: inline-block; }
                .footer { background-color: #0f1d43; padding: 20px; text-align: center; color: #ffffff; font-size: 13px; }
                .footer-orange { color: #e87416; font-weight: bold; }
                .illustration { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cccccc; }
                .illustration img { max-width: 180px; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="${baseUrl}/assets/iclogo/icon.png" alt="CercaGlez Logo">
                    <h1>Nueva Solicitud de Cotización</h1>
                </div>
                <div class="content">
                    <p>Hola equipo,</p>
                    <p>Se ha recibido una nueva solicitud de contacto a través del sitio web. A continuación, los detalles del prospecto:</p>
                    
                    <div class="info-box">
                        <div class="info-item"><strong>Nombre:</strong> ${safeName}</div>
                        <div class="info-item"><strong>Teléfono:</strong> <a href="tel:${safePhone}" style="color: #e87416; text-decoration: none; font-weight: bold;">${safePhone}</a></div>
                        <div class="info-item"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #e87416; text-decoration: none; font-weight: bold;">${safeEmail}</a></div>
                        <div class="info-item"><strong>Servicio:</strong> <span style="color: #0f1d43; font-weight: bold;">${safeService}</span></div>
                    </div>

                    <div class="message-title">Mensaje del Cliente:</div>
                    <div class="message-box">
                        "${safeMessage}"
                    </div>

                    <div class="illustration">
                        <img src="${baseUrl}/assets/iclogo/HombreCC_Saludo_SF.png" alt="Saludo CercaGlez">
                        <p style="color: #0f1d43; font-weight: bold; margin-top: 10px; font-size: 18px;">¡A cerrar esa venta!</p>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} <span class="footer-orange">CercaGlez</span>. Sistema automatizado de cotizaciones.</p>
                </div>
            </div>
        </body>
        </html>
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
}
