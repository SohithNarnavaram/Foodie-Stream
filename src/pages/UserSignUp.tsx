import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Phone, ChefHat, ArrowLeft, Store, MapPin } from "lucide-react";
import { toast } from "sonner";

const UserSignUp = () => {
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isVendor) {
      // Vendor validation
      if (!formData.businessName || !formData.ownerName || !formData.email || !formData.phone || !formData.address || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
    } else {
      // User validation
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isVendor) {
        // Store vendor session
        localStorage.setItem("userType", "vendor");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("vendorEmail", formData.email);
        localStorage.setItem("vendorName", formData.businessName);
        toast.success("Vendor account created successfully!");
        navigate("/vendor/home");
      } else {
        // Store user session
        localStorage.setItem("userType", "user");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userName", formData.name);
        toast.success("Account created successfully!");
        navigate("/home");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary/5 via-white to-orange-50 flex items-center justify-center px-4 py-2 overflow-hidden">
      <div className="w-full max-w-md space-y-3 h-full flex flex-col">
        {/* Header */}
        <div className="text-center space-y-1 flex-shrink-0">
          <Link
            to="/user/signin"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors mb-1"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back
          </Link>
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-orange-100 flex items-center justify-center shadow-lg">
            {isVendor ? <Store className="w-6 h-6 text-primary" /> : <ChefHat className="w-6 h-6 text-primary" />}
          </div>
          <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
          <p className="text-xs text-gray-600">{isVendor ? "Join us and start streaming" : "Join us and start ordering"}</p>
        </div>

        {/* Sign Up Card */}
        <Card className="p-4 shadow-lg border-0 rounded-2xl flex-1 overflow-hidden flex flex-col">
          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setIsVendor(false)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                !isVendor
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ChefHat className="w-4 h-4 mx-auto mb-1" />
              User / Foodie
            </button>
            <button
              type="button"
              onClick={() => setIsVendor(true)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                isVendor
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Store className="w-4 h-4 mx-auto mb-1" />
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 flex-1 overflow-y-auto scrollbar-hide pr-1">
            {isVendor ? (
              <>
                {/* Business Name Field */}
                <div className="space-y-1">
                  <Label htmlFor="businessName" className="text-xs font-semibold text-gray-700">
                    Business Name
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Owner Name Field */}
                <div className="space-y-1">
                  <Label htmlFor="ownerName" className="text-xs font-semibold text-gray-700">
                    Owner Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      placeholder="Enter owner's full name"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Address Field */}
                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                    Business Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter your business address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Name Field */}
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                {isVendor ? "Business Email" : "Email Address"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={isVendor ? "Enter your business email" : "Enter your email"}
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-9 pr-9 h-10 text-xs rounded-xl border-gray-200 focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg mt-2"
            >
              {isLoading ? "Creating Account..." : isVendor ? "Create Vendor Account" : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs rounded-xl border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs rounded-xl border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>
        </Card>

        {/* Sign In Link */}
        <div className="text-center space-y-1 flex-shrink-0">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              to={isVendor ? "/vendor/signin" : "/user/signin"}
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;

