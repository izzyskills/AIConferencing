import z from "zod";
const login_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signup_schema = z
  .object({
    first_name: z.string().min(2, "Name must be at least 2 characters"),
    last_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["password_confirmation"],
      });
    }
  });

// a schema to create a meeting with a title capacacity greater than 1 and less than 11 and a date either now or in the future using zod
// also there is a make private checkbox that is not included in the schema and in the api its called public so when submitting it meant to be the opposite of what the user selected
const meeting_schema = z.object({
  name: z.string().min(2, "Title must be at least 2 characters"),
  capacity: z
    .number()
    .min(2, "Capacity must be at least 2")
    .max(10, "Capacity must be at most 10"),
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
