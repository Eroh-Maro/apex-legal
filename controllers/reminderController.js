import Reminder from "../models/reminderModel.js";
import Case from "../models/caseModel.js";
import Hearing from "../models/hearingModel.js";
import { logAction } from "./auditController.js";

// CREATE REMINDER
export const createReminder = async (req, res) => {
  try {
    const {
      caseId,
      hearingId,
      reminderType,
      title,
      description,
      recipientEmail,
      reminderDate,
    } = req.body;

    const legalCase = await Case.findById(caseId);

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    if (hearingId) {
      const hearing = await Hearing.findById(hearingId);

      if (!hearing) {
        return res.status(404).json({
          success: false,
          message: "Hearing not found",
        });
      }
    }

    const reminder = await Reminder.create({
      case: caseId,
      hearing: hearingId || null,
      reminderType,
      title,
      description,
      recipientEmail,
      reminderDate,
      createdBy: req.user.id,
    });

    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "REMINDER_SENT",
      "Notification",
      reminder._id,
      req.ip,
      {
        reminderType,
        recipientEmail,
      },
      "success"
    );

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL REMINDERS
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate("case")
      .populate("hearing")
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE REMINDER
export const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id)
      .populate("case")
      .populate("hearing");

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      success: true,
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE REMINDER
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};