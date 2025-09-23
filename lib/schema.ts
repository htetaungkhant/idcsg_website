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

// Service form schema for comprehensive service management
const serviceFormSchema = z.object({
  // Basic service information
  categoryId: z.string().min(1, {
    message: "Category selection is required.",
  }),
  name: z
    .string()
    .min(2, {
      message: "Service name must be at least 2 characters.",
    })
    .max(100, {
      message: "Service name must be less than 100 characters.",
    }),
  overview: z
    .string()
    .min(10, {
      message: "Service overview must be at least 10 characters.",
    })
    .max(1000, {
      message: "Service overview must be less than 1000 characters.",
    }),

  // Section 1 (Image, Title, Description)
  section1Image: z.instanceof(File).optional(),
  section1Title: z
    .string()
    .max(100, {
      message: "Section 1 title must be less than 100 characters.",
    })
    .optional(),
  section1Description: z
    .string()
    .max(1000, {
      message: "Section 1 description must be less than 1000 characters.",
    })
    .optional(),

  // Section 2 (Video URL)
  section2VideoUrl: z
    .string()
    .url({
      message: "Please enter a valid video URL.",
    })
    .optional()
    .or(z.literal("")),

  // Section 3 (Image, Title, Description)
  section3Image: z.instanceof(File).optional(),
  section3Title: z
    .string()
    .max(100, {
      message: "Section 3 title must be less than 100 characters.",
    })
    .optional(),
  section3Description: z
    .string()
    .max(1000, {
      message: "Section 3 description must be less than 1000 characters.",
    })
    .optional(),

  // Section 4 (Title and Cards)
  section4Title: z
    .string()
    .max(100, {
      message: "Section 4 title must be less than 100 characters.",
    })
    .optional(),
  section4Cards: z
    .array(
      z.object({
        id: z.string().optional(), // For existing cards during updates
        image: z.instanceof(File).optional(),
        title: z
          .string()
          .max(100, {
            message: "Card title must be less than 100 characters.",
          })
          .optional(),
        description: z
          .string()
          .min(1, {
            message: "Card description is required.",
          })
          .max(500, {
            message: "Card description must be less than 500 characters.",
          }),
      })
    )
    .optional(),

  // Section 5 (Image, Title, Price Ranges)
  section5Image: z.instanceof(File).optional(),
  section5Title: z
    .string()
    .max(100, {
      message: "Section 5 title must be less than 100 characters.",
    })
    .optional(),
  section5PriceRanges: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, {
            message: "Price range title is required.",
          })
          .max(100, {
            message: "Price range title must be less than 100 characters.",
          }),
        startPrice: z
          .number()
          .min(0, {
            message: "Start price must be a positive number.",
          })
          .optional(),
        endPrice: z
          .number()
          .min(0, {
            message: "End price must be a positive number.",
          })
          .optional(),
      })
    )
    .optional(),
});

type ServiceFormSchema = z.infer<typeof serviceFormSchema>;

// Dental Technology form schema for comprehensive technology management
const dentalTechnologyFormSchema = z.object({
  // Required fields
  mainImage: z.instanceof(File, {
    message: "Main technology image is required.",
  }),
  title: z
    .string()
    .min(2, {
      message: "Technology title must be at least 2 characters.",
    })
    .max(100, {
      message: "Technology title must be less than 100 characters.",
    }),
  overview: z
    .string()
    .min(10, {
      message: "Technology overview must be at least 10 characters.",
    })
    .max(1000, {
      message: "Technology overview must be less than 1000 characters.",
    }),

  // Optional main description
  description: z
    .string()
    .max(2000, {
      message: "Description must be less than 2000 characters.",
    })
    .optional()
    .or(z.literal("")),

  // Section 1 (Image, Title, Description) - All optional
  section1Image: z.instanceof(File).optional(),
  section1Title: z
    .string()
    .max(100, {
      message: "Section 1 title must be less than 100 characters.",
    })
    .optional()
    .or(z.literal("")),
  section1Description: z
    .string()
    .max(1000, {
      message: "Section 1 description must be less than 1000 characters.",
    })
    .optional()
    .or(z.literal("")),

  // Card 1 (Image, Title, Description) - All optional
  card1Image: z.instanceof(File).optional(),
  card1Title: z
    .string()
    .max(100, {
      message: "Card 1 title must be less than 100 characters.",
    })
    .optional()
    .or(z.literal("")),
  card1Description: z
    .string()
    .max(1000, {
      message: "Card 1 description must be less than 1000 characters.",
    })
    .optional()
    .or(z.literal("")),

  // Card 2 (Image, Title, Description) - All optional
  card2Image: z.instanceof(File).optional(),
  card2Title: z
    .string()
    .max(100, {
      message: "Card 2 title must be less than 100 characters.",
    })
    .optional()
    .or(z.literal("")),
  card2Description: z
    .string()
    .max(1000, {
      message: "Card 2 description must be less than 1000 characters.",
    })
    .optional()
    .or(z.literal("")),
});

type DentalTechnologyFormSchema = z.infer<typeof dentalTechnologyFormSchema>;

// Edit schema - making mainImage optional for updates
const editDentalTechnologyFormSchema = dentalTechnologyFormSchema.extend({
  mainImage: z
    .instanceof(File, {
      message: "Main technology image is required.",
    })
    .optional(),
});

type EditDentalTechnologyFormSchema = z.infer<
  typeof editDentalTechnologyFormSchema
>;

const termsOfServiceFormSchema = z.object({
  hostingDate: z.string().min(1, {
    message: "Hosting date is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type TermsOfServiceFormSchema = z.infer<typeof termsOfServiceFormSchema>;

const privacyPolicyFormSchema = z.object({
  hostingDate: z.string().min(1, {
    message: "Hosting date is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type PrivacyPolicyFormSchema = z.infer<typeof privacyPolicyFormSchema>;

const officePolicyFormSchema = z.object({
  hostingDate: z.string().min(1, {
    message: "Hosting date is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type OfficePolicyFormSchema = z.infer<typeof officePolicyFormSchema>;

export { authSchema, type AuthSchema };
export { contactFormSchema, type ContactFormSchema };
export { paymentFormSchema, type PaymentFormSchema };
export { backgroundSettingsSchema, type BackgroundSettingsSchema };
export { memberFormSchema, type MemberFormSchema };
export { serviceFormSchema, type ServiceFormSchema };
export { dentalTechnologyFormSchema, type DentalTechnologyFormSchema };
export { editDentalTechnologyFormSchema, type EditDentalTechnologyFormSchema };
export { termsOfServiceFormSchema, type TermsOfServiceFormSchema };
export { privacyPolicyFormSchema, type PrivacyPolicyFormSchema };
export { officePolicyFormSchema, type OfficePolicyFormSchema };
