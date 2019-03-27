import * as yup from "yup";

export const TraineeLoginSchema = yup.object({
  name: yup
    .string()
    .min(3)
    .required(),
  // .label("Name"),
  emailAddress: yup
    .string()
    .matches(
      /^[A-Za-z0-9._%+-]+@successive.tech$/,
      "EmailAddress must be a valid email."
    )
    .required("Email Address is required")
});
