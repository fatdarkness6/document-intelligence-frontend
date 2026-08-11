import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required")
    .label("Email")
    .meta({ type: "email" }),

  password: yup
    .string()
    .required("Password is required")
    .label("Password")
    .meta({ type: "password" }),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required")
    .label("Email")
    .meta({ type: "email" }),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .label("Password")
    .meta({ type: "password" }),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password")
    .label("Confirm password")
    .meta({ type: "password" }),
});
