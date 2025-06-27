import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/SignUpForm";
export default function SignupPage() {
  return (
    <div className="grid min-h-svh w-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 ">
          <img src="images/logo.png" alt="" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md mx-auto px-4">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden h-full w-full bg-muted lg:block">
        <img
          src="https://www.rmcad.edu/wp-content/uploads/2024/12/shutterstock_2176161815-scaled.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
