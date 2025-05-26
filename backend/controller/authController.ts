import { Request, Response } from "express";
import authModel from "../model/authModel";
import jwt from "jsonwebtoken";

// register type
interface RegisterType {
  username: string;
  phone: string;
}

interface AdminRequest extends Request {
  veparId?: string;
}

// register controller
export const registerController = async (rq: AdminRequest, rs: Response) => {
  try {
    const { username, phone }: RegisterType = rq.body;
    const vepariId = rq.veparId;

    console.log("vepari id", vepariId);

    // Check Required Fields
    if (!username) {
      rs.status(400).json({ success: false, message: "Username is required" });
      return;
    }
    if (!phone) {
      rs.status(400).json({ success: false, message: "Phone is required" });
      return;
    }

    if (phone.length !== 10) {
      rs.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
      return;
    }
    let user = await authModel.findOne({ phone });

    if (!user) {
      user = await new authModel({
        username,
        phone,
      }).save();
    }

    // user token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY as string, {
      expiresIn: "7d",
    });

    rs.status(201).json({
      success: true,
      message: "register success",
      user,
      token,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "error in register",
      error,
    });
    return;
  }
};

//logout controller
export const logoutController = async (rq: Request, rs: Response) => {
  try {
    rs.status(200).json({
      success: true,
      message: "success logout",
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "logout error",
      error,
    });
    return;
  }
};

// getAllUsersController
export const getAllUsersController = async (rq: Request, rs: Response) => {
  try {
    const getAllUsers = await authModel.find({});

    if (!getAllUsers) {
      rs.status(404).json({
        success: false,
        message: "users not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "all users fetched",
      total_users: getAllUsers.length,
      getAllUsers,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "error in getting users",
      error,
    });
    return;
  }
};

// getSingleUserController
export const getSingleUserController = async (rq: Request, rs: Response) => {
  try {
    const { id } = rq.params;

    const getSingleUser = await authModel.findById(id);

    if (!getSingleUser) {
      rs.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "user fetched",
      getSingleUser,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
    return;
  }
};

// updateUserController
export const updateUserController = async (rq: Request, rs: Response) => {
  try {
    const { id } = rq.params;
    const { username } = rq.body;

    if (!username) {
      rs.status(400).json({
        success: false,
        message: "username required",
      });
      return;
    }

    const updateUser = await authModel.findByIdAndUpdate(
      id,
      { username },
      { new: true }
    );

    if (!updateUser) {
      rs.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "user update success",
      updateUser,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
    return;
  }
};

// deleteUserController
export const deleteUserController = async (rq: Request, rs: Response) => {
  try {
    const { id } = rq.params;

    const deleteUser = await authModel.findByIdAndDelete(id);

    if (!deleteUser) {
      rs.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "user delete success",
      deleteUser,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
    return;
  }
};

export const getUserProfile = async (rq: Request, rs: Response) => {
  try {
    const user = await (rq as any).user;
    if (!user) {
      rs.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
    return;
  }
};