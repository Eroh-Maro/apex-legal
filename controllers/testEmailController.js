import { sendEmail } from "../utils/sendEmail.js";

export const sendTestEmail = async (req, res) => {
  try {
    await sendEmail(
      req.user.email,
      "Apex Legal Test Email",
      `
      <h2>Email System Working</h2>
      <p>This email confirms Apex Legal notifications are configured correctly.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};