import cron from "node-cron";
import Hearing from "../models/hearingModel.js";
import Case from "../models/caseModel.js";
import { sendEmail } from "./sendEmail.js";
import { logAction } from "../controllers/auditController.js";

const startHearingReminderScheduler = () => {
  // Every day at 8:00 AM
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const hearings = await Hearing.find({
        hearingDate: {
          $gte: now,
          $lte: tomorrow,
        },
        status: "scheduled",
      }).populate({
        path: "case",
        populate: {
          path: "assignedLawyer",
        },
      });

      for (const hearing of hearings) {
        const lawyer = hearing.case.assignedLawyer;

        await sendEmail(
          lawyer.email,
          "Upcoming Hearing Reminder",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
            <h2>Upcoming Hearing Reminder</h2>

            <p>Hello ${lawyer.fullName},</p>

            <p>You have a hearing scheduled within the next 24 hours.</p>

            <p><strong>Case:</strong> ${hearing.case.title}</p>
            <p><strong>Hearing:</strong> ${hearing.title}</p>
            <p><strong>Date:</strong> ${new Date(
              hearing.hearingDate
            ).toLocaleString()}</p>
            <p><strong>Court:</strong> ${hearing.courtName}</p>

            <p style="font-size:13px;color:#888;">
              Please ensure you are fully prepared.
            </p>
          </div>
          `
        );

        await logAction(
          lawyer._id,
          lawyer.email,
          lawyer.role,
          "REMINDER_SENT",
          "Notification",
          hearing._id,
          null,
          {
            reminderType: "hearing",
          },
          "success"
        );
      }
    } catch (error) {
      console.error("Hearing reminder scheduler error:", error);
    }
  });
};

export default startHearingReminderScheduler;