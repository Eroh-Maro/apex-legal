import cron from "node-cron";
import Hearing from "../models/hearingModel.js";
import { sendEmail } from "./sendEmail.js";
import { logAction } from "../controllers/auditController.js";

const startHearingReminderScheduler = () => {
  console.log("Starting hearing reminder scheduler...");

  // Every morning at 8AM
  cron.schedule("0 8 * * *", async () => {
    try {
      console.log("Reminder scheduler running...");

      const now = new Date();

      const reminderWindow = new Date();
      reminderWindow.setDate(reminderWindow.getDate() + 30);

      const hearings = await Hearing.find({
        hearingDate: {
          $gte: now,
          $lte: reminderWindow,
        },
        status: "scheduled",
      }).populate({
        path: "case",
        populate: {
          path: "assignedLawyer",
        },
      });

      console.log(`Found ${hearings.length} upcoming hearings`);

      const DAY_IN_MS = 24 * 60 * 60 * 1000;

      for (const hearing of hearings) {
        const lawyer = hearing.case?.assignedLawyer;

        if (!lawyer) {
          console.log(
            `No assigned lawyer found for hearing: ${hearing.title}`
          );
          continue;
        }

        const daysUntilHearing = Math.ceil(
          (new Date(hearing.hearingDate) - now) / DAY_IN_MS
        );

        let reminderStage = null;

        if (
          daysUntilHearing <= 1 &&
          !hearing.remindersSent.oneDay
        ) {
          reminderStage = "24 Hour Reminder";
          hearing.remindersSent.oneDay = true;
        } else if (
          daysUntilHearing <= 3 &&
          !hearing.remindersSent.threeDays
        ) {
          reminderStage = "3 Day Reminder";
          hearing.remindersSent.threeDays = true;
        } else if (
          daysUntilHearing <= 7 &&
          !hearing.remindersSent.week
        ) {
          reminderStage = "7 Day Reminder";
          hearing.remindersSent.week = true;
        } else if (
          daysUntilHearing <= 30 &&
          !hearing.remindersSent.month
        ) {
          reminderStage = "30 Day Reminder";
          hearing.remindersSent.month = true;
        }

        if (!reminderStage) {
          continue;
        }

        await sendEmail(
          lawyer.email,
          reminderStage,
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
            <h2>${reminderStage}</h2>

            <p>Hello ${lawyer.fullName},</p>

            <p>
              This is your ${reminderStage.toLowerCase()}
              for an upcoming hearing.
            </p>

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

        await hearing.save();

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
            reminderStage,
            hearingTitle: hearing.title,
          },
          "success"
        );

        console.log(
          `${reminderStage} sent for ${hearing.title}`
        );
      }
    } catch (error) {
      console.error(
        "Hearing reminder scheduler error:",
        error
      );
    }
  });
};

export default startHearingReminderScheduler;