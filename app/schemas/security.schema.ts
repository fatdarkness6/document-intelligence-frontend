import * as yup from "yup";

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Current password is required")
    .label("Current password")
    .meta({
      type: "password",
      icon: "lock_outline",
      autocomplete: "current-password",
    }),

  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must be different from your current password",
    )
    .required("New password is required")
    .label("New password")
    .meta({
      type: "password",
      icon: "password",
      autocomplete: "new-password",
    }),

  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "New passwords must match")
    .required("Confirm your new password")
    .label("Confirm new password")
    .meta({
      type: "password",
      icon: "verified_user",
      autocomplete: "new-password",
    }),
});
