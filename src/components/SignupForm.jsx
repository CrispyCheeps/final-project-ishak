import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "@/helpers/axios";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const signupUser = async (userData) => {
    // Determine role based on email domain
    const role = userData.email.includes('@admin') ? 'admin' : 'user';
    const requestBody = {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      passwordRepeat: userData.passwordRepeat,
      role: role,
      profilePictureUrl: userData.profilePictureUrl,
      phoneNumber: userData.phoneNumber
    };

    try {
      const response = await axiosInstance.post('/api/v1/register', requestBody, {
        headers: {
          'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Validate password confirmation
      if (password !== passwordRepeat) {
        setError("Passwords do not match");
        return;
      }
      
      const result = await signupUser({ 
        email, 
        password, 
        passwordRepeat,
        name, 
        phoneNumber,
        profilePictureUrl 
      });
      
      if (result?.code === "200") {
        setError("");
        alert("Registration successful! Please login to continue.");
        navigate("/login");
      } else {
        setError(result?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <p className="text-center text-[#939393]">Hola!</p>
      <div className="grid border border-[#2BAE91] p-12 rounded-3xl gap-6 ">
        <div className="grid gap-3">
          <Label className="text-[#939393]" htmlFor="name">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            onChange={(e) => setName(e.target.value)}
            required
            value={name}
          />
        </div>
        <div className="grid gap-3">
          <Label className="text-[#939393]" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
          />
        </div>
        <div className="grid gap-3">
          <Label className="text-[#939393]" htmlFor="phoneNumber">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            value={phoneNumber}
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
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label className="text-[#939393]" htmlFor="passwordRepeat">
            Confirm Password
          </Label>
          <Input
            id="passwordRepeat"
            type="password"
            placeholder="Confirm your password"
            onChange={(e) => setPasswordRepeat(e.target.value)}
            value={passwordRepeat}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label className="text-[#939393]" htmlFor="profilePictureUrl">
            Profile Picture URL
          </Label>
          <Input
            id="profilePictureUrl"
            type="url"
            placeholder="https://example.com/profile.jpg"
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            value={profilePictureUrl}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2CAB98] to-[#329AC0] hover:bg-sky-900"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
        <div className="text-center text-sm text-[#939393]">
          Already have an account?{" "}
          <a onClick={() => navigate("/login")} className="underline underline-offset-4 cursor-pointer">
            Login
          </a>
        </div>
      </div>
    </form>
  );
}