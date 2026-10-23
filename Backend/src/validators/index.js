import { body } from "express-validator";
import { AvailableUserRole, AvailableTaskStatues } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower case")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};

// Task validators
const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("description").optional().trim(),
    body("assignedTo")
      .optional({ values: "falsy" })
      .isMongoId()
      .withMessage("Invalid user ID"),
    body("status")
      .optional()
      .isIn(AvailableTaskStatues)
      .withMessage("Invalid task status"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("description").optional().trim(),
    body("assignedTo")
      .optional({ values: "falsy" })
      .isMongoId()
      .withMessage("Invalid user ID"),
    body("status")
      .optional()
      .isIn(AvailableTaskStatues)
      .withMessage("Invalid task status"),
  ];
};

// Subtask validators
const createSubTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Subtask title is required"),
  ];
};

const updateSubTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean"),
  ];
};

// Note validators
const createNoteValidator = () => {
  return [
    body("content").trim().notEmpty().withMessage("Note content is required"),
  ];
};

const updateNoteValidator = () => {
  return [
    body("content").trim().notEmpty().withMessage("Note content is required"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
  createNoteValidator,
  updateNoteValidator,
};
