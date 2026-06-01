// controllers/clientController.js

import Client from "../models/clientModel.js";


// CREATE CLIENT
export const createClient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      companyName,
      gender,
      dateOfBirth,
      notes,
    } = req.body;

    // CHECK PHONE
    const existingPhone = await Client.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // CHECK EMAIL
    if (email) {
      const existingEmail = await Client.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const client = await Client.create({
      fullName,
      email,
      phone,
      address,
      companyName,
      gender,
      dateOfBirth,
      notes,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL CLIENTS
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE CLIENT
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE CLIENT
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      updatedClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE CLIENT
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// SEARCH CLIENTS
export const searchClients = async (req, res) => {
  try {
    const keyword = req.query.q;

    const clients = await Client.find({
      $or: [
        {
          fullName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      results: clients.length,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};