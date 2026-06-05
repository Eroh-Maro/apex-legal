import Case from "../models/caseModel.js";
import Client from "../models/clientModel.js";
import User from "../models/userModel.js";
import Hearing from "../models/hearingModel.js";

// DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();

    const pendingCases = await Case.countDocuments({
      status: "pending",
    });

    const activeCases = await Case.countDocuments({
      status: "active",
    });

    const completedCases = await Case.countDocuments({
      status: "completed",
    });

    const totalClients = await Client.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalLawyers = await User.countDocuments({
      role: "lawyer",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalSecretaries = await User.countDocuments({
      role: "secretary",
    });

    const totalParalegals = await User.countDocuments({
      role: "paralegal",
    });

    const totalPracticeManagers = await User.countDocuments({
      role: "practice manager",
    });

    const totalHearings = await Hearing.countDocuments();

    const upcomingHearings = await Hearing.countDocuments({
      status: "scheduled",
      hearingDate: {
        $gte: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCases,
        pendingCases,
        activeCases,
        completedCases,

        totalClients,

        totalUsers,
        totalLawyers,
        totalAdmins,
        totalSecretaries,
        totalParalegals,
        totalPracticeManagers,

        totalHearings,
        upcomingHearings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPCOMING HEARINGS
export const getUpcomingHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find({
      status: "scheduled",
      hearingDate: {
        $gte: new Date(),
      },
    })
      .populate("case")
      .sort({ hearingDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      hearings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RECENT CASES
export const getRecentCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("client")
      .populate("assignedLawyer", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
