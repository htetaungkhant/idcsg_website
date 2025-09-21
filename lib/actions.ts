"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn } from "@/lib/auth";
import { authSchema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/execute-action";
import { hashPassword } from "@/lib/password";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = authSchema.parse({ email, password });

      const existingUser = await db.user.findUnique({
        where: { email: validatedData.email.trim().toLocaleLowerCase() },
      });

      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      // Hash the password before saving
      const hashedPassword = await hashPassword(validatedData.password);

      await db.user.create({
        data: {
          email: validatedData.email.trim().toLocaleLowerCase(),
          password: hashedPassword,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

const authenticate = async (
  formData: FormData,
  options?: { redirect?: boolean; redirectTo?: string }
) => {
  try {
    // const credentials = {
    //   email: formData.get("email") as string,
    //   password: formData.get("password") as string,
    // };

    // Validate the credentials
    // const validatedCredentials = authSchema.parse(credentials);

    await signIn("credentials", {
      ...options,
      ...Object.fromEntries(formData.entries()),
      role: "ADMIN",
    });

    return { success: true, message: "Sign in successful" };
  } catch (error) {
    console.error("Authentication error:", error);

    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid credentials. Please check your email and password.",
    };
  }
};

export { signUp, authenticate };
