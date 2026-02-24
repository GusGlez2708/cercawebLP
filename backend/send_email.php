<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/PHPMailer/src/Exception.php';
require '../vendor/PHPMailer/src/PHPMailer.php';
require '../vendor/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Basic validation
    if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['phone']) || empty($_POST['service']) || empty($_POST['message'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Por favor, complete todos los campos.']);
        exit;
    }

    $name = strip_tags(htmlspecialchars($_POST['name']));
    $phone = strip_tags(htmlspecialchars($_POST['phone']));
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $service = strip_tags(htmlspecialchars($_POST['service']));
    $message = strip_tags(htmlspecialchars($_POST['message']));

    if (!$email) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Dirección de correo electrónico no válida.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'gonzalezrosasgustavo27@gmail.com'; // TODO: Reemplazar con tu correo de Gmail
        $mail->Password   = 'jillrvvfcpukzpaj'; // TODO: Reemplazar con tu contraseña de aplicación de Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet = 'UTF-8';


        //Recipients
        $mail->setFrom('gonzalezrosasgustavo27@gmail.com', 'COTIZACION SITIO WEB');
        $mail->addAddress('atencioncercaglez@gmail.com', 'Atencion CercaGlez');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Nueva solicitud de cotizacion de ' . $name;
        $mail->Body    = "<b>Nombre:</b> {$name}<br><b>Teléfono:</b> {$phone}<br><b>Email:</b> {$email}<br><b>Servicio:</b> {$service}<br><b>Mensaje:</b><br>{$message}";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => '¡Gracias! Tu cotización ha sido enviada con éxito.']);
    } catch (Exception $e) {
        http_response_code(500);
        $errorInfo = $mail->ErrorInfo;
        $userMessage = 'Hubo un error al enviar la solicitud. Por favor, inténtelo más tarde.';

        // Check for common network-related errors from PHPMailer
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