import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

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
  // Main service image (mandatory)
  image: z
    .instanceof(File, {
      message: "Service image is required.",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Image size must be less than 10MB.",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }
    ),
  name: z
    .string()
    .min(2, {
      message: "Service name must be at least 2 characters.",
    })
    .max(300, {
      message: "Service name must be less than 300 characters.",
    }),
  overview: z
    .string()
    .min(10, {
      message: "Service overview must be at least 10 characters.",
    })
    .max(3000, {
      message: "Service overview must be less than 3000 characters.",
    }),
  // Gradient colors for overview section background
  overviewBgStartingColor: z.string().regex(hexColorRegex, {
    message:
      "Overview background starting color must be a valid hex color (e.g., #CA4E48 or #CA4E48FF).",
  }),
  overviewBgEndingColor: z.string().regex(hexColorRegex, {
    message:
      "Overview background ending color must be a valid hex color (e.g., #642724 or #642724FF).",
  }),
  // Gradient colors for details section background
  detailsBgStartingColor: z.string().regex(hexColorRegex, {
    message:
      "Details background starting color must be a valid hex color (e.g., #FFFFFF or #FFFFFFFF).",
  }),
  detailsBgEndingColor: z.string().regex(hexColorRegex, {
    message:
      "Details background ending color must be a valid hex color (e.g., #D2F7FF or #D2F7FFFF).",
  }),
  // Additional colors for details section
  detailsLinkBgColor: z.string().regex(hexColorRegex, {
    message:
      "Details link background color must be a valid hex color (e.g., #68211E or #68211EFF).",
  }),
  detailsTextColor: z.string().regex(hexColorRegex, {
    message:
      "Details text color must be a valid hex color (e.g., #233259 or #233259FF).",
  }),
  /* Lines 151-153 omitted */

  // Section 1 (Image, Title, Description)
  section1Image: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Image size must be less than 10MB.",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }
    )
    .optional(),
  section1Title: z
    .string()
    .max(300, {
      message: "Section 1 title must be less than 300 characters.",
    })
    .optional(),
  section1Description: z
    .string()
    .max(3000, {
      message: "Section 1 description must be less than 3000 characters.",
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
  section3Image: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Image size must be less than 10MB.",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }
    )
    .optional(),
  section3Title: z
    .string()
    .max(300, {
      message: "Section 3 title must be less than 300 characters.",
    })
    .optional(),
  section3Description: z
    .string()
    .max(3000, {
      message: "Section 3 description must be less than 3000 characters.",
    })
    .optional(),

  // Section 4 (Title and Cards)
  section4Title: z
    .string()
    .max(300, {
      message: "Section 4 title must be less than 300 characters.",
    })
    .optional(),
  section4Cards: z
    .array(
      z.object({
        id: z.string().optional(), // For existing cards during updates
        image: z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "Image size must be less than 5MB.",
          })
          .refine(
            (file) =>
              ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                file.type
              ),
            {
              message:
                "Only .jpg, .jpeg, .png and .webp formats are supported.",
            }
          )
          .optional(),
        title: z
          .string()
          .max(300, {
            message: "Card title must be less than 300 characters.",
          })
          .optional(),
        description: z
          .string()
          .min(1, {
            message: "Card description is required.",
          })
          .max(1000, {
            message: "Card description must be less than 1000 characters.",
          }),
      })
    )
    .optional(),

  // Section 5 (Image, Title, Price Ranges)
  section5Image: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Image size must be less than 10MB.",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }
    )
    .optional(),
  section5Title: z
    .string()
    .max(300, {
      message: "Section 5 title must be less than 300 characters.",
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
          .max(300, {
            message: "Price range title must be less than 300 characters.",
          }),
        startPrice: z
          .number()
          .min(0, {
            message: "Start price must be a positive number.",
          })
          .nullable()
          .optional(),
        endPrice: z
          .number()
          .min(0, {
            message: "End price must be a positive number.",
          })
          .nullable()
          .optional(),
      })
    )
    .optional(),
});

type ServiceFormSchema = z.infer<typeof serviceFormSchema>;

// Edit schema - making image optional for updates
const editServiceFormSchema = serviceFormSchema.extend({
  image: z.instanceof(File).optional(),
});

type EditServiceFormSchema = z.infer<typeof editServiceFormSchema>;

// Dental Technology form schema for comprehensive technology management
const dentalTechnologyFormSchema = z.object({
  cardStyle: z.enum(["CARDSTYLE1", "CARDSTYLE2"], {
    message: "Please select a card style.",
  }),
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

  // Optional title and main description
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

  // Dynamic Cards Array - All optional
  cards: z
    .array(
      z.object({
        id: z.string().optional(), // For existing cards during updates
        image: z.instanceof(File).optional(),
        title: z
          .string()
          .max(100, {
            message: "Card title must be less than 100 characters.",
          })
          .optional()
          .or(z.literal("")),
        description: z
          .string()
          .max(1000, {
            message: "Card description must be less than 1000 characters.",
          })
          .optional()
          .or(z.literal("")),
      })
    )
    .optional(),
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

// First Visit form schema for comprehensive First Visit management
const firstVisitFormSchema = z.object({
  // General sections array (one-to-many relationship)
  sections: z
    .array(
      z.object({
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
          .min(1, {
            message: "Description is required for each section.",
          })
          .max(2000, {
            message: "Section description must be less than 2000 characters.",
          }),
        sortOrder: z.number().min(0, {
          message: "Sort order must be a non-negative number.",
        }),
      })
    )
    .min(1, {
      message: "At least one section is required.",
    })
    .max(10, {
      message: "Maximum 10 sections allowed.",
    }),

  // Video section (one-to-one, optional)
  videoSection: z
    .object({
      id: z.string().optional(), // For existing video section during updates
      videoUrl: z
        .string()
        .url({
          message: "Please enter a valid video URL.",
        })
        .min(1, {
          message: "Video URL is required when video section is provided.",
        }),
    })
    .optional(),

  // Information section (one-to-one, optional)
  informationSection: z
    .object({
      id: z.string().optional(), // For existing information section during updates
      imageUrl: z.string().optional(), // Existing image URL
      imageFile: z.instanceof(File).optional(), // New image file to upload
      descriptionTitle: z
        .string()
        .max(100, {
          message: "Description title must be less than 100 characters.",
        })
        .optional()
        .or(z.literal("")),
      description: z
        .string()
        .min(1, {
          message: "Description is required for information section.",
        })
        .max(2000, {
          message: "Information description must be less than 2000 characters.",
        }),
    })
    .optional(),
});

type FirstVisitFormSchema = z.infer<typeof firstVisitFormSchema>;

// Patient Instructions form schema for comprehensive Patient Instructions management
const patientInstructionsFormSchema = z.object({
  // Banner image (optional)
  bannerImage: z.string().optional(), // Existing banner image URL
  bannerImageFile: z.instanceof(File).optional(), // New banner image file to upload

  // Cards array (at least one required)
  cards: z
    .array(
      z
        .object({
          id: z.string().optional(), // For existing cards during updates

          // Background image (required)
          backgroundImage: z.string().optional(), // Existing background image URL
          backgroundImageFile: z.instanceof(File).optional(), // New background image file to upload

          // Content title (required)
          contentTitle: z
            .string()
            .min(1, {
              message: "Content title is required for each card.",
            })
            .max(100, {
              message: "Content title must be less than 100 characters.",
            }),

          // Content image (optional)
          contentImage: z.string().optional(), // Existing content image URL
          contentImageFile: z.instanceof(File).optional(), // New content image file to upload

          // Content description (required)
          contentDescription: z
            .string()
            .min(1, {
              message: "Content description is required for each card.",
            })
            .max(5000, {
              message: "Content description must be less than 5000 characters.",
            }),

          // Downloadable file (optional)
          downloadableFile: z.string().optional(), // Existing downloadable file URL
          downloadableFileFile: z.instanceof(File).optional(), // New downloadable file to upload
        })
        .refine(
          (card) => {
            // Background image is required (either existing URL or new file)
            return !!(card.backgroundImage || card.backgroundImageFile);
          },
          {
            message: "Background image is required for each card.",
            path: ["backgroundImageFile"], // Show error on background image field
          }
        )
    )
    .min(1, {
      message: "At least one card is required.",
    })
    .max(20, {
      message: "Maximum 20 cards allowed.",
    }),
});

type PatientInstructionsFormSchema = z.infer<
  typeof patientInstructionsFormSchema
>;

export { authSchema, type AuthSchema };
export { contactFormSchema, type ContactFormSchema };
export { paymentFormSchema, type PaymentFormSchema };
export { backgroundSettingsSchema, type BackgroundSettingsSchema };
export { memberFormSchema, type MemberFormSchema };
export { serviceFormSchema, type ServiceFormSchema };
export { editServiceFormSchema, type EditServiceFormSchema };
export { dentalTechnologyFormSchema, type DentalTechnologyFormSchema };
export { editDentalTechnologyFormSchema, type EditDentalTechnologyFormSchema };
export { termsOfServiceFormSchema, type TermsOfServiceFormSchema };
export { privacyPolicyFormSchema, type PrivacyPolicyFormSchema };
export { officePolicyFormSchema, type OfficePolicyFormSchema };
export { safeFormSchema, type SafeFormSchema };
export { preciseFormSchema, type PreciseFormSchema };
export { personalFormSchema, type PersonalFormSchema };
export { firstVisitFormSchema, type FirstVisitFormSchema };
export { patientInstructionsFormSchema, type PatientInstructionsFormSchema };
