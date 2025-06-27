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
import { useState } from "react";

export function LoginForm({ className, ...props }) {
  const [userSignUp, setUserSignUp] = useState(false);

  const dispatch = useDispatch();
  const { email, password, error, loading, profilePictureUrl } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(email, password));
      if (result?.code == 200 && result?.data.role === "user") {
        localStorage.setItem("token", result.token);
        dispatch(setProfilePictureUrl(result.data.profilePictureUrl));
        dispatch(setIsLoggedIn(true));
        navigate("/beranda");
      } else if (result?.code == 200 && result?.data.role === "admin") {
        localStorage.setItem("token", result.token);
        dispatch(setProfilePictureUrl(result.data.profilePictureUrl));
        dispatch(setIsLoggedIn(true));
        navigate("/admin/home");
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
        <div onClick={() => navigate("/signup")} className="text-center text-sm text-[#939393] cursor-pointer">
          Don&apos;t have an account?{" "}
          <a className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </div>
    </form>

    
  );
}
