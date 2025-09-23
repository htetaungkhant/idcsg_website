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

// Safe form schema for comprehensive Safe management
const safeFormSchema = z.object({
  // Dynamic sections array
  sections: z
    .array(
      z
        .object({
          id: z.string().optional(), // For existing sections during updates
          imageUrl: z.string().optional(), // Existing image URL
          imageFile: z.instanceof(File).optional(), // New image file to upload
          title: z
            .string()
            .max(100, {
              message: "Section title must be less than 100 characters.",
            })
            .optional()
            .or(z.literal("")),
          descriptionTitle: z
            .string()
            .max(100, {
              message: "Description title must be less than 100 characters.",
            })
            .optional()
            .or(z.literal("")),
          description: z
            .string()
            .max(2000, {
              message: "Section description must be less than 2000 characters.",
            })
            .optional()
            .or(z.literal("")),
          cardStyle: z.enum(["CARDSTYLE1", "CARDSTYLE2", "CARDSTYLE3"], {
            message: "Please select a card style.",
          }),
          sortOrder: z.number().min(0, {
            message: "Sort order must be a non-negative number.",
          }),
        })
        .refine(
          (section) => {
            // Check if at least one field is filled
            const hasImage = !!(section.imageFile || section.imageUrl);
            const hasTitle = !!(section.title && section.title.trim());
            const hasDescriptionTitle = !!(
              section.descriptionTitle && section.descriptionTitle.trim()
            );
            const hasDescription = !!(
              section.description && section.description.trim()
            );

            return (
              hasImage || hasTitle || hasDescriptionTitle || hasDescription
            );
          },
          {
            message:
              "At least one field (image, title, description title, or description) must be filled.",
          }
        )
    )
    .min(1, {
      message: "At least one section is required.",
    })
    .max(10, {
      message: "Maximum 10 sections allowed.",
    }),
});

type SafeFormSchema = z.infer<typeof safeFormSchema>;

// Precise form schema for comprehensive Precise management
const preciseFormSchema = z.object({
  // Dynamic sections array
  sections: z
    .array(
      z
        .object({
          id: z.string().optional(), // For existing sections during updates
          imageUrl: z.string().optional(), // Existing image URL
          imageFile: z.instanceof(File).optional(), // New image file to upload
          title: z
            .string()
            .max(100, {
              message: "Section title must be less than 100 characters.",
            })
            .optional()
            .or(z.literal("")),
          descriptionTitle: z
            .string()
            .max(100, {
              message: "Description title must be less than 100 characters.",
            })
            .optional()
            .or(z.literal("")),
          description: z
            .string()
            .max(2000, {
              message: "Section description must be less than 2000 characters.",
            })
            .optional()
            .or(z.literal("")),
          cardStyle: z.enum(["CARDSTYLE1", "CARDSTYLE2", "CARDSTYLE3"], {
            message: "Please select a card style.",
          }),
          sortOrder: z.number().min(0, {
            message: "Sort order must be a non-negative number.",
          }),
        })
        .refine(
          (section) => {
            // Check if at least one field is filled
            const hasImage = !!(section.imageFile || section.imageUrl);
            const hasTitle = !!(section.title && section.title.trim());
            const hasDescriptionTitle = !!(
              section.descriptionTitle && section.descriptionTitle.trim()
            );
            const hasDescription = !!(
              section.description && section.description.trim()
            );

            return (
              hasImage || hasTitle || hasDescriptionTitle || hasDescription
            );
          },
          {
            message:
              "At least one field (image, title, description title, or description) must be filled.",
            path: ["title"], // Show error on title field
          }
        )
    )
    .min(1, {
      message: "At least one section is required.",
    })
    .max(10, {
      message: "Maximum 10 sections allowed.",
    }),
});

type PreciseFormSchema = z.infer<typeof preciseFormSchema>;

// Personal form schema for comprehensive Personal management
const personalFormSchema = z.object({
  // Dynamic sections array
  sections: z
    .array(
      z
        .object({
          id: z.string().optional(), // For existing sections during updates
          imageUrl: z.string().optional(), // Existing image URL
          imageFile: z.instanceof(File).optional(), // New image file to upload
          title: z
            .string()
            .max(100, {
              message: "Section title must be less than 100 characters.",
            })
            .optional()
            .or(z.literal("")),
          descriptionTitle: z
            .string()
            .max(100, {
              message: "Description title must be less than 100 characters.",
            })
            .optional()
            .or(z.literal("")),
          description: z
            .string()
            .max(2000, {
              message: "Section description must be less than 2000 characters.",
            })
            .optional()
            .or(z.literal("")),
          cardStyle: z.enum(["CARDSTYLE1", "CARDSTYLE2", "CARDSTYLE3"], {
            message: "Please select a card style.",
          }),
          sortOrder: z.number().min(0, {
            message: "Sort order must be a non-negative number.",
          }),
        })
        .refine(
          (section) => {
            // Check if at least one field is filled
            const hasImage = !!(section.imageFile || section.imageUrl);
            const hasTitle = !!(section.title && section.title.trim());
            const hasDescriptionTitle = !!(
              section.descriptionTitle && section.descriptionTitle.trim()
            );
            const hasDescription = !!(
              section.description && section.description.trim()
            );

            return (
              hasImage || hasTitle || hasDescriptionTitle || hasDescription
            );
          },
          {
            message:
              "At least one field (image, title, description title, or description) must be filled.",
            path: ["title"], // Show error on title field
          }
        )
    )
    .min(1, {
      message: "At least one section is required.",
    })
    .max(10, {
      message: "Maximum 10 sections allowed.",
    }),
});

type PersonalFormSchema = z.infer<typeof personalFormSchema>;

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
export { safeFormSchema, type SafeFormSchema };
export { preciseFormSchema, type PreciseFormSchema };
export { personalFormSchema, type PersonalFormSchema };
