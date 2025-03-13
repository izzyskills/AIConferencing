import z from "zod";
const login_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signup_schema = z
  .object({
    firstname: z.string().min(2, "Name must be at least 2 characters"),
    lastname: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["password_confirmation"],
      });
    }
  });

const meeting_schema = z.object({
  name: z.string().min(2, "Title must be at least 2 characters"),
  opens_at: z.string().transform((data) => {
    if (new Date(data) < new Date()) {
      data = new Date().toISOString();
    }
    return new Date(data).toISOString();
  }),
  public: z.boolean().transform((data) => {
    return !data;
  }),
});

export { login_schema, signup_schema, meeting_schema };
