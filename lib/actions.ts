"use server";

import { signIn } from "@/lib/auth";
import { authSchema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/execute-action";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = authSchema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

const authenticate = async (formData: FormData) => {
  try {
    // const credentials = {
    //   email: formData.get("email") as string,
    //   password: formData.get("password") as string,
    // };

    // Validate the credentials
    // const validatedCredentials = authSchema.parse(credentials);

    await signIn("credentials", formData);

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
