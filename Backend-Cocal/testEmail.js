import { sendEmail } from "./services/emailService.js";

(async () => {
  await sendEmail({
    to: "raquel.osorio@ucb.edu.bo",
    subject: "Prueba de COCAL Backend",
    html: "<h2>Hola desde el backend 👋</h2><p>Si ves esto, todo funciona.</p>",
  });
})();
