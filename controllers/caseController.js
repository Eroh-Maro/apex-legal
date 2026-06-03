// controllers/caseController.js

import Case from "../models/caseModel.js";
import { logAction } from "./auditController.js";
import Client from "../models/clientModel.js";
import User from "../models/userModel.js";


// CREATE CASE
export const createCase = async (req, res) => {
  try {
    const {
      title,
      caseNumber,
      client,
      assignedLawyer,
      caseType,
      description,
      hearingDate,
      courtName,
    } = req.body;

    // CHECK CLIENT
    const existingClient = await Client.findById(client);

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // CHECK LAWYER
    const lawyer = await User.findById(assignedLawyer);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Assigned lawyer not found",
      });
    }

    // CHECK DUPLICATE CASE NUMBER
    const existingCase = await Case.findOne({ caseNumber });

    if (existingCase) {
      return res.status(400).json({
        success: false,
        message: "Case number already exists",
      });
    }

    const legalCase = await Case.create({
      title,
      caseNumber,
      client,
      assignedLawyer,
      caseType,
      description,
      hearingDate,
      courtName,
      createdBy: req.user.id,
    });

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "CREATE_CASE",
      "Case",
      legalCase._id,
      req.ip,
      {
        caseTitle: legalCase.title,
        caseNumber: legalCase.caseNumber,
      },
      "success"
    );

    res.status(201).json({
      success: true,
      message: "Case created successfully",
      legalCase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CASES
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("client", "fullName phone")
      .populate("assignedLawyer", "name email role")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE CASE
export const getCaseById = async (req, res) => {
  try {
    const legalCase = await Case.findById(req.params.id)
      .populate("client")
      .populate("assignedLawyer", "name email role")
      .populate("createdBy", "name role");

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      legalCase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// PATCH CASE
export const updateCase = async (req, res) => {
  try {
    const legalCase = await Case.findById(req.params.id);

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "UPDATE_CASE",
      "Case",
      updatedCase._id,
      req.ip,
      {
        updatedFields: Object.keys(req.body),
      },
      "success"
    );

    res.status(200).json({
      success: true,
      message: "Case updated successfully",
      updatedCase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE CASE
export const deleteCase = async (req, res) => {
  try {
    const legalCase = await Case.findById(req.params.id);

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "DELETE_CASE",
      "Case",
      legalCase._id,
      req.ip,
      {
        caseTitle: legalCase.title,
        caseNumber: legalCase.caseNumber,
      },
      "success"
    );

    await legalCase.deleteOne();

    res.status(200).json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE CASE STATUS
export const updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const legalCase = await Case.findById(req.params.id);

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    legalCase.status = status;

    await legalCase.save();

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "UPDATE_CASE_STATUS",
      "Case",
      legalCase._id,
      req.ip,
      {
        newStatus: legalCase.status,
      },
      "success"
    );

    res.status(200).json({
      success: true,
      message: "Case status updated successfully",
      legalCase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ADD NOTE TO CASE
export const addCaseNote = async (req, res) => {
  try {
    const { body } = req.body;

    const legalCase = await Case.findById(req.params.id);

    if (!legalCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    legalCase.notes.push({
      body,
      addedBy: req.user.id,
    });

    await legalCase.save();

    // AUDIT LOG
    await logAction(
      req.user._id,
      req.user.email,
      req.user.role,
      "ADD_CASE_NOTE",
      "Case",
      legalCase._id,
      req.ip,
      {
        notePreview: body.substring(0, 50),
      },
      "success"
    );

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      notes: legalCase.notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchCases = async (req, res) => {
  try {
    const keyword = req.query.q;

    const cases = await Case.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          caseNumber: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .populate("client", "fullName")
      .populate("assignedLawyer", "name");

    res.status(200).json({
      success: true,
      results: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCasesByStatus = async (req, res) => {
  try {
    const cases = await Case.find({
      status: req.params.status,
    });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCasesByClient = async (req, res) => {
  try {
    const cases = await Case.find({
      client: req.params.clientId,
    })
      .populate("client", "fullName")
      .populate("assignedLawyer", "name");

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLawyerCases = async (req, res) => {
  try {
    const cases = await Case.find({
      assignedLawyer: req.params.lawyerId,
    })
      .populate("client", "fullName")
      .populate("assignedLawyer", "name");

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};