import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSignIn = async (signInData: SignInData) => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: signInData.email,
        password: signInData.password,
        flow: "signIn",
      });
      toast.success("Sign in successful");
      router.push("/dashboard");
    } catch (error) {
      signInForm.setError("password", { message: "Invalid email or password" });
      toast.error("Error signing in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (signUpData: SignUpData) => {
    setIsLoading(true);
    try {
      // Use the "signUp" flow to create a new user account
      await signIn("password", {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        flow: "signUp",
      });
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      signUpForm.setError("email", { message: "Account already exists or invalid data" });
      toast.error("Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(); // Clears user session and tokens
      toast.success("Signed out successfully");
      router.push("/auth");
    } catch (error) {
      toast.error("Error signing out");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isLoading,
  };
};
