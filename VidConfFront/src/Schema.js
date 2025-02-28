import { last } from "lodash";
import { z } from "zod";
import { isInt, isMobilePhone } from "validator";

export const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: " must be a valid Email.",
    })
    .email("Please enter a valid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const SignUpForm = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z
      .string()
      .min(2, {
        message: "Email must be at least 2 characters.",
      })
      .email("Please enter a valid email"),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });
export const ResetPasswordForm = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

export const personalInformationSchema = z.object({
  date_of_birth: z
    .string()
    .date()
    .refine(
      (value) => {
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 15);
        // Return true if the date of birth is at least 15 years ago
        return new Date(value) <= minDate;
      },
      {
        message: "you have to be at least 15 years of age",
      }
    ),
  gender: z.enum(["female", "male"]),
  phone_number: z
    .string({
      required_error: "A phone number is required",
    })
    .refine((value) => isMobilePhone(value), {
      message: "Invalid phone number",
    }),
  state: z.string(),
  home_address: z.string(),
  NIN_number: z
    .string()
    .length(11, "Put in a valid NIN")
    .refine((value) => isInt(value), { message: "Put in a valid NIN" }),
});

export const academicInformationItSchema = z.object({
  school_name: z.string().min(2, { message: "must be more that 2 characters" }),
  course_of_study: z.string().min(2, {
    message: "must be more that 2 characters",
  }),
  graduation_year: z.string().max(4, { message: "incorrect date" }),
  matric_number: z.string().min(2, "Required"),
  grade: z.enum(["first_class", "second_class_upper", "second_class_lower"]),
});
export const academicInformationSiwesSchema = z.object({
  school_name: z.string().min(2, { message: "must be more that 2 characters" }),
  course_of_study: z.string().min(2, {
    message: "must be more that 2 characters",
  }),
  institution_email: z.string().email(),
  matric_number: z.string().min(2, "Required"),
  current_level: z.enum([
    "level_200",
    "level_300",
    "level_400",
    "level_500",
    "level_600",
  ]),
});
export const refereeInformation = z.object({
  first_name: z.string().min(2, "Required"),
  last_name: z.string().min(2, "Required"),
  // id_no_division_dept: z.string(),
  relationship: z.string().min(2,"Required"),
  occupation: z.string().min(2, "Required"),
  place_of_work: z.string().min(2, "Required"),
  phone_number: z
    .string({
      required_error: "A phone number is required",
    })
    .refine((value) => isMobilePhone(value), {
      message: "Invalid phone number",
    }),
  home_address: z.string().min(2, "Required"),
});

export const NextOfKinSchema = z.object({
  first_name: z.string().min(2, { message: "Please fill out this field" }),
  last_name: z.string().min(2, "Required"),
  relationship: z.enum(["Mother", "Mentor", "Guardian", "Father", "Other"]),
  phone_number: z
    .string({
      required_error: "A phone number is required",
    })
    .refine((value) => isMobilePhone(value), {
      message: "Invalid phone number",
    }),
  contact_address: z.string().min(2, "Required"),
});
export const NDEschema = z.object({
  school_name: z.string().min(2, { message: "School name is required" }),
  course_of_study: z
    .string()
    .min(2, { message: "Course of study is required" }),
  graduation_year: z.string().max(4, { message: "incorrect date" }),
  graduating_class: z
    .string()
    .min(2, { message: "Class of degree is required" }),
  nyscCertificateNumber: z
    .string()
    .min(2, { message: "NYSC certificate number is required" }),
  nyscCallUpNumber: z
    .string()
    .min(2, { message: "NYSC call-up number is required" }),
});
