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

const meeting_schema = z
  .object({
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
    members: z.array(z.string().email("Invalid email address")).isNullable(),
  })
  .superRefine((data, ctx) => {
    if (data.members && data.members.length > data.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Members cannot be greater than capacity",
        path: ["capacity"],
      });
    }
    if (!data.public && data.members.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "you have to have at least a participant if the meeting is private",
        path: ["public"],
      });
    }
  });

export { login_schema, signup_schema, meeting_schema };
