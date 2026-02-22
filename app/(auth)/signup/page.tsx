"use client";

import { LogoIcon } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

const SignUp = () => {
  const { signUpForm, handleSignUp, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signUpForm;

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create your account
            </h1>
            <p className="text-sm">Join Bareform today</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                {...register("name")}
                className={cn(errors.name ? "border-destructive" : "")}
              />
              {errors.name && (
                <span className="text-destructive text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                {...register("email")}
                className={cn(errors.email ? "border-destructive" : "")}
              />
              {errors.email && (
                <span className="text-destructive text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
                className={cn(errors.password ? "border-destructive" : "")}
              />
              {errors.password && (
                <span className="text-destructive text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {errors.root && (
              <span className="text-destructive text-center block text-sm">
                {errors.root.message}
              </span>
            )}

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or sign up with
            </span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              Google
            </Button>
            <Button type="button" variant="outline">
              Microsoft
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Already have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Sign in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
};

export default SignUp;
