"use client";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp, signIn } from "@/lib/actions/auth.action";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential, 
} from "firebase/auth";
import { SignUpParams, SignInParams, AuthResponse } from "@/lib/types/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {FormField} from "@/components/FormField";
import { Loader2 } from "lucide-react";

const FORM_TYPES = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
} as const;

type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === FORM_TYPES.SIGN_UP ? z.string().min(3, {
      message: "Name must be at least 3 characters",
    }) : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  });
};

export const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const form = useForm<z.infer<ReturnType<typeof authFormSchema>>>({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleAuth = async (
    authFn: () => Promise<UserCredential>,
    successMessage: string,
    redirectPath: string
  ) => {
    try {
      const userCredential = await authFn();
      const idToken = await userCredential.user.getIdToken();
      
      const params = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        ...(type === FORM_TYPES.SIGN_UP && { name: form.getValues("name")! })
      } as SignUpParams | SignInParams;

      const result = type === FORM_TYPES.SIGN_UP 
        ? await signUp(params as SignUpParams)
        : await signIn(params as SignInParams);

      if (!result.success) throw new Error(result.message || "Authentication failed");
      
      toast.success(successMessage);
      router.push(redirectPath);
    } catch (error: any) {
      // Handle Firebase specific errors
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error('This email is already registered. Please sign in.');
            break;
          case 'auth/invalid-email':
            toast.error('Invalid email address.');
            break;
          case 'auth/user-disabled':
            toast.error('This account has been disabled.');
            break;
          case 'auth/user-not-found':
            toast.error('No account found with this email.');
            break;
          case 'auth/wrong-password':
            toast.error('Incorrect password.');
            break;
          default:
            toast.error(error.message || "Authentication failed");
        }
      } else {
        toast.error(error.message || "Authentication failed");
      }
      console.error("Auth error:", error);
    }
  };

  const onSubmit = async (data: z.infer<ReturnType<typeof authFormSchema>>) => {
    if (type === FORM_TYPES.SIGN_UP) {
      await handleAuth(
        () => createUserWithEmailAndPassword(auth, data.email, data.password),
        "Account created successfully!",
        "/sign-in"
      );
    } else {
      await handleAuth(
        () => signInWithEmailAndPassword(auth, data.email, data.password),
        "Signed in successfully!",
        "/"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded-lg shadow-sm p-8 mt-25">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <Image 
            src="./logo.svg" 
            alt="Hydrate Logo" 
            width={32} 
            height={32}
            priority
          />
          <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">
            Hydrate
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            {type === FORM_TYPES.SIGN_UP && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="John Doe"
                description="At least 3 characters"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="your@email.com"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              description="At least 6 characters"
            />

            <Button 
              type="submit" 
              className="w-full bg-green-400 font-bold"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : type === FORM_TYPES.SIGN_IN ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-muted-foreground">
          {type === FORM_TYPES.SIGN_IN ? "New user?" : "Already have an account?"}{" "}
          <Link
            href={type === FORM_TYPES.SIGN_IN ? "/sign-up" : "/sign-in"}
            className="font-medium text-primary hover:underline"
          >
            {type === FORM_TYPES.SIGN_IN ? "Create account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};