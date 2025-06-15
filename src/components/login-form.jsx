import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  setEmail,
  setIsLoggedIn,
  setPassword,
  setProfilePictureUrl,
} from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const { email, password, error, loading, profilePictureUrl } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("handleSubmit called");
    e.preventDefault();
    try {
      console.log(
        "Submitting login with email:",
        email,
        "and password:",
        password
      );
      const result = await dispatch(loginUser(email, password));
      if (result?.code == 200) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("profilePicture", result.data.profilePictureUrl);
        localStorage.setItem("userName", result.data.name);
        console.log(result.data.profilePictureUrl);
        dispatch(setProfilePictureUrl(result.data.profilePictureUrl));
        console.log("Login successful, navigating to final project");
        dispatch(setIsLoggedIn(true));
        navigate("/beranda");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form
      className={cn("flex flex-col", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      {/* <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div> */}
      <p className="text-center text-[#939393]">Hola!</p>
      <div className="grid border border-[#2BAE91] p-12 rounded-3xl gap-6 ">
        <div className="grid gap-3">
          <Label className="text-[#939393]" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => dispatch(setEmail(e.target.value))}
            required
            value={email}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label className="text-[#939393]" htmlFor="password">
              Password
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            onChange={(e) => dispatch(setPassword(e.target.value))}
            value={password}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2CAB98] to-[#329AC0] hover:bg-sky-900"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm text-[#939393]">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </div>
    </form>
  );
}
