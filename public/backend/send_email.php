<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/PHPMailer/src/Exception.php';
require '../vendor/PHPMailer/src/PHPMailer.php';
require '../vendor/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Leer el input en formato JSON ya que el frontend envía application/json
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        // Fallback a $_POST por si acaso
        $data = $_POST;
    }

    // Validación básica
    if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['service']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Por favor, complete todos los campos.']);
        exit;
    }

    $name = strip_tags(htmlspecialchars($data['name']));
    $phone = preg_replace('/[^0-9]/', '', $data['phone']);
    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    $service = strip_tags(htmlspecialchars($data['service']));
    $message = strip_tags(htmlspecialchars($data['message']));

    if (strlen($phone) !== 10) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'El número de teléfono debe tener exactamente 10 dígitos.']);
        exit;
    }

    if (!$email) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Dirección de correo electrónico no válida.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Cargar configuración de manera segura (fuera de GitHub)
        $configFile = dirname(__DIR__, 2) . '/config.php';
        if (file_exists($configFile)) {
            $config = require $configFile;
        } else {
            $config = [
                'SMTP_USER' => getenv('SMTP_USER') ?: '',
                'SMTP_PASS' => getenv('SMTP_PASS') ?: ''
            ];
        }

        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['SMTP_USER']; 
        $mail->Password   = $config['SMTP_PASS']; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';

        // Destinatarios
        $mail->setFrom('gonzalezrosasgustavo27@gmail.com', 'COTIZACION SITIO WEB');
        $mail->addAddress('contacto@cercaglez.com', 'Contacto CercaGlez'); // De api/send-email.js

        // Determinar URL base dinámicamente para las imágenes (soporta subcarpetas como localhost/cercaglez/)
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        
        // Obtenemos la ruta del script (ej. /cercaglez/backend o /backend)
        $scriptPath = dirname($_SERVER['SCRIPT_NAME']); 
        // Subimos un nivel para llegar a la raíz donde está 'assets' (ej. /cercaglez o /)
        $rootPath = dirname($scriptPath); 
        // Normalizamos las barras y quitamos la barra final si es la raíz
        $rootPath = str_replace('\\', '/', $rootPath);
        if ($rootPath === '/') {
            $rootPath = '';
        }
        
        $baseUrl = $protocol . $host . $rootPath;
        $currentYear = date("Y");

        // Contenido
        $mail->isHTML(true);
        $mail->Subject = "Nueva solicitud de cotización de {$name}";
        
        $htmlBody = <<<HTML
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
                    <img src="{$baseUrl}/assets/iclogo/icon.png" alt="CercaGlez Logo">
                    <h1>Nueva Solicitud de Cotización</h1>
                </div>
                <div class="content">
                    <p>Hola equipo,</p>
                    <p>Se ha recibido una nueva solicitud de contacto a través del sitio web. A continuación, los detalles del prospecto:</p>
                    
                    <div class="info-box">
                        <div class="info-item"><strong>Nombre:</strong> {$name}</div>
                        <div class="info-item"><strong>Teléfono:</strong> <a href="tel:{$phone}" style="color: #e87416; text-decoration: none; font-weight: bold;">{$phone}</a></div>
                        <div class="info-item"><strong>Email:</strong> <a href="mailto:{$email}" style="color: #e87416; text-decoration: none; font-weight: bold;">{$email}</a></div>
                        <div class="info-item"><strong>Servicio:</strong> <span style="color: #0f1d43; font-weight: bold;">{$service}</span></div>
                    </div>

                    <div class="message-title">Mensaje del Cliente:</div>
                    <div class="message-box">
                        "{$message}"
                    </div>

                    <div class="illustration">
                        <img src="{$baseUrl}/assets/iclogo/HombreCC_Saludo_SF.png" alt="Saludo CercaGlez">
                        <p style="color: #0f1d43; font-weight: bold; margin-top: 10px; font-size: 18px;">¡A cerrar esa venta!</p>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; {$currentYear} <span class="footer-orange">CercaGlez</span>. Sistema automatizado de cotizaciones.</p>
                </div>
            </div>
        </body>
        </html>
HTML;

        $mail->Body = $htmlBody;

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => '¡Gracias! Tu cotización ha sido enviada con éxito.']);
    } catch (Exception $e) {
        http_response_code(500);
        $errorInfo = $mail->ErrorInfo;
        $userMessage = 'Hubo un error al enviar la solicitud. Por favor, inténtelo más tarde.';

        // Detectar errores comunes de red o conexión
        if (strpos($errorInfo, 'Could not connect to SMTP host') !== false || strpos($errorInfo, 'getaddrinfo') !== false) {
            $userMessage = 'No se pudo enviar. Compruebe su conexión a internet.';
        }

        echo json_encode(['status' => 'error', 'message' => $userMessage]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no válido.']);
}
?>