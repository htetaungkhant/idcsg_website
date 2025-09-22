import { z } from "zod";

const authSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z
    .string()
    .min(1, {
      message: "Password is required.",
    })
    .min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  role: z.enum(["USER", "ADMIN"]).default("USER").optional(),
});

type AuthSchema = z.infer<typeof authSchema>;

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

const paymentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  emailId: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mobileNumber: z.string().min(10, {
    message: "Please enter a valid mobile number.",
  }),
  serviceType: z.string().min(1, {
    message: "Please select a service type.",
  }),
  paymentMethod: z.enum(
    [
      "credit_debit_card",
      "paynow_upi",
      "internet_banking",
      "paypal",
      "mobile_wallet",
    ],
    {
      message: "Please select a payment method.",
    }
  ),
  amount: z.number().min(1, {
    message: "Please enter a valid amount.",
  }),
});

type PaymentFormSchema = z.infer<typeof paymentFormSchema>;

const backgroundSettingsSchema = z
  .object({
    backgroundMedia: z.instanceof(File).optional(),
    backgroundColor: z.string().optional(),
    backgroundOpacity: z.number().min(0).max(100),
  })
  .refine((data) => data.backgroundMedia || data.backgroundColor, {
    message: "Either background media or background color must be provided",
    path: ["backgroundMedia"], // This will show the error on the media field
  });

type BackgroundSettingsSchema = z.infer<typeof backgroundSettingsSchema>;

const memberFormSchema = z.object({
  memberImage: z.instanceof(File).optional(),
  memberName: z.string().min(2, {
    message: "Member name must be at least 2 characters.",
  }),
  memberDesignation: z
    .string()
    .min(2, {
      message: "Designation must be at least 2 characters.",
    })
    .optional()
    .or(z.literal("")),
  team: z.enum(
    ["DOCTORS", "CONSULTANT_SPECIALISTS", "ALLIED_HEALTH_SUPPORT_STAFF"],
    {
      message: "Please select a team.",
    }
  ),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type MemberFormSchema = z.infer<typeof memberFormSchema>;

export { authSchema, type AuthSchema };
export { contactFormSchema, type ContactFormSchema };
export { paymentFormSchema, type PaymentFormSchema };
export { backgroundSettingsSchema, type BackgroundSettingsSchema };
export { memberFormSchema, type MemberFormSchema };
