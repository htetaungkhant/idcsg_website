import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, signIn } from "@/lib/auth";
import { executeAction } from "@/lib/execute-action";

export default async function Page() {
  const session = await auth();
  if (session) redirect("/admin/home-page-management");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      {/* Email/Password Sign In */}
      <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          await executeAction({
            actionFn: async () => {
              await signIn("credentials", formData);
            },
          });
        }}
      >
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="current-password"
        />
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>
    </div>
  );
}
