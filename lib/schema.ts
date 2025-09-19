import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type AuthSchema = z.infer<typeof authSchema>;

export { authSchema, type AuthSchema };

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  emailId: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mobileNumber: z.string().min(10, {
    message: "Please enter a valid mobile number.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

export { contactFormSchema, type ContactFormSchema };
