import cron from "node-cron";
import Hearing from "../models/hearingModel.js";
import { sendEmail } from "./sendEmail.js";
import { logAction } from "../controllers/auditController.js";

const startHearingReminderScheduler = () => {
  console.log("Starting hearing reminder scheduler...");

  // Every minute (testing)
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Reminder scheduler running...");

      const now = new Date();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7);

      console.log("NOW:", now);
      console.log("TOMORROW:", tomorrow);

      const allHearings = await Hearing.find();

      console.log(
        "ALL HEARINGS:",
        allHearings.map((h) => ({
          title: h.title,
          hearingDate: h.hearingDate,
          status: h.status,
        }))
      );

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

      console.log(`Found ${hearings.length} upcoming hearings`);

      for (const hearing of hearings) {
        const lawyer = hearing.case?.assignedLawyer;

        if (!lawyer) {
          console.log(
            `No assigned lawyer found for hearing: ${hearing.title}`
          );
          continue;
        }

        console.log(`Sending reminder for ${hearing.title}`);

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
            hearingTitle: hearing.title,
          },
          "success"
        );

        console.log(`Reminder sent for ${hearing.title}`);
      }
    } catch (error) {
      console.error("Hearing reminder scheduler error:", error);
    }
  });
};

export default startHearingReminderScheduler;