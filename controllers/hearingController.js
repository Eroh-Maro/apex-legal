import Hearing from "../models/hearingModel.js";
import Case from "../models/caseModel.js";
import { logAction } from "./auditController.js";
import { sendEmail } from "../utils/sendEmail.js";

// CREATE HEARING
export const createHearing = async (req, res) => {
  try {
    const {
      caseId,
      title,
      hearingDate,
      courtName,
      courtroom,
      judge,
    } = req.body;

    const legalCase = await Case.findById(caseId)
      .populate("assignedLawyer");

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const hearing = await Hearing.create({
      case: caseId,
      title,
      hearingDate,
      courtName,
      courtroom,
      judge,
      createdBy: req.user._id,
    });

    // EMAIL NOTIFICATION
await sendEmail(
  legalCase.assignedLawyer.email,
  "Hearing Scheduled",
  `
  <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
    <h2>Hearing Scheduled</h2>

    <p>
      Hello ${legalCase.assignedLawyer.fullName},
      a hearing has been scheduled for one of your cases.
    </p>

    <p><strong>Case:</strong> ${legalCase.title}</p>
    <p><strong>Hearing:</strong> ${title}</p>
    <p><strong>Date:</strong> ${new Date(
      hearingDate
    ).toLocaleString()}</p>
    <p><strong>Court:</strong> ${courtName}</p>

    <p style="font-size: 13px; color: #888; margin-top: 20px;">
      Please log in to Apex Legal to review the hearing details.
    </p>
  </div>
  `
);

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "CREATE_HEARING",
      "Hearing",
      hearing._id,
      req.ip,
      {
        title,
        hearingDate,
      },
      "success"
    );

    res.status(201).json({
      success: true,
      message: "Hearing created successfully",
      hearing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL HEARINGS
export const getHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find()
      .populate("case")
      .populate("createdBy", "fullName email role")
      .sort({ hearingDate: 1 });

    res.status(200).json({
      success: true,
      count: hearings.length,
      hearings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE HEARING
export const getHearingById = async (req, res) => {
  try {
    const hearing = await Hearing.findById(req.params.id)
      .populate("case")
      .populate("createdBy", "fullName email role")
      .populate("notes.addedBy", "fullName email role");

    if (!hearing) {
      return res.status(404).json({
        success: false,
        message: "Hearing not found",
      });
    }

    res.status(200).json({
      success: true,
      hearing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE HEARING
export const updateHearing = async (req, res) => {
  try {
    const hearing = await Hearing.findById(req.params.id);

    if (!hearing) {
      return res.status(404).json({
        success: false,
        message: "Hearing not found",
      });
    }

    const updatedHearing = await Hearing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "UPDATE_HEARING",
      "Hearing",
      updatedHearing._id,
      req.ip,
      {
        updatedFields: Object.keys(req.body),
      },
      "success"
    );

    res.status(200).json({
      success: true,
      message: "Hearing updated successfully",
      updatedHearing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE HEARING
export const deleteHearing = async (req, res) => {
  try {
    const hearing = await Hearing.findById(req.params.id);

    if (!hearing) {
      return res.status(404).json({
        success: false,
        message: "Hearing not found",
      });
    }

    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "DELETE_HEARING",
      "Hearing",
      hearing._id,
      req.ip,
      {
        title: hearing.title,
      },
      "success"
    );

    await hearing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Hearing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET HEARINGS BY CASE
export const getHearingsByCase = async (req, res) => {
  try {
    const hearings = await Hearing.find({
      case: req.params.caseId,
    })
      .populate("notes.addedBy", "fullName email role")
      .sort({ hearingDate: 1 });

    res.status(200).json({
      success: true,
      count: hearings.length,
      hearings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD NOTE TO HEARING
export const addHearingNote = async (req, res) => {
  try {
    const { body } = req.body;

    const hearing = await Hearing.findById(req.params.id);

    if (!hearing) {
      return res.status(404).json({
        success: false,
        message: "Hearing not found",
      });
    }

    hearing.notes.push({
      body,
      addedBy: req.user.id,
    });

    await hearing.save();

    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "UPDATE_HEARING",
      "Hearing",
      hearing._id,
      req.ip,
      {
        notePreview: body.substring(0, 50),
      },
      "success"
    );

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      notes: hearing.notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};