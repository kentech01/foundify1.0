import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { XIcon } from "lucide-react@0.487.0";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useApp, PitchData, Pitch } from "../context/AppContext";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "./signIn/SignInModal";
import { useApiService } from "../services/api";
import React from "react";

export function PitchBuilder() {
  const navigate = useNavigate();
  const { addPitch, setIsGenerating, setProgress } = useApp();
  const { user, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [formData, setFormData] = useState<PitchData>({
    startupName: "",
    problem: "",
    targetAudience: "",
    solution: "",
    uniqueValue: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#1f1147",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Auto-submit after successful sign-in when user is ready
  useEffect(() => {
    if (shouldAutoSubmit && user && !loading) {
      setShouldAutoSubmit(false);
      handleComplete(formData);
    }
  }, [shouldAutoSubmit, user, loading, formData]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "startupName":
        if (!value.trim()) return "Startup name is required";
        if (value.trim().length < 2)
          return "Startup name must be at least 2 characters long";
        if (value.trim().length > 100)
          return "Startup name cannot exceed 100 characters";
        break;

      case "problem":
        if (!value.trim()) return "Problem description is required";
        if (value.trim().length < 10)
          return "Problem description must be at least 10 characters long";
        if (value.trim().length > 1000)
          return "Problem description cannot exceed 1000 characters";
        break;

      case "targetAudience":
        if (!value.trim()) return "Target audience is required";
        if (value.trim().length < 5)
          return "Target audience must be at least 5 characters long";
        if (value.trim().length > 500)
          return "Target audience cannot exceed 500 characters";
        break;

      // Adapted 'product' -> our field 'solution'
      case "solution":
        if (!value.trim())
          return "Main product or service description is required";
        if (value.trim().length < 5)
          return "Product description must be at least 5 characters long";
        if (value.trim().length > 500)
          return "Product description cannot exceed 500 characters";
        break;

      // Adapted 'uniqueSellingPoint' -> our field 'uniqueValue'
      case "uniqueValue":
        if (!value.trim()) return "Unique selling point is required";
        if (value.trim().length < 5)
          return "Unique selling point must be at least 5 characters long";
        if (value.trim().length > 500)
          return "Unique selling point cannot exceed 500 characters";
        break;

      case "primaryColor":
        if (!value.trim()) return "Primary color is required";
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value))
          return "Please provide a valid hex color";
        break;

      case "secondaryColor":
        if (!value.trim()) return "Secondary color is required";
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value))
          return "Please provide a valid hex color";
        break;

      case "email": {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please provide a valid email address";
        break;
      }
    }
    return undefined;
  };

  const { generatePitch } = useApiService();

  const questions = [
    {
      id: "startupName",
      label: "What is your startup name?",
      placeholder: "Enter your startup name",
      type: "input",
    },
    {
      id: "problem",
      label: "What problem are you solving?",
      placeholder: "Describe the problem your startup addresses",
      type: "textarea",
    },
    {
      id: "targetAudience",
      label: "Who is your target audience?",
      placeholder: "Describe your ideal customers",
      type: "textarea",
    },
    {
      id: "solution",
      label: "What is your solution?",
      placeholder: "Explain how your product/service solves the problem",
      type: "textarea",
    },
    {
      id: "uniqueValue",
      label: "What makes you unique?",
      placeholder: "Describe your unique value proposition",
      type: "textarea",
    },
    {
      id: "colors",
      label: "Choose your brand colors",
      placeholder: "",
      type: "color-picker",
    },
    {
      id: "email",
      label: "Your email address",
      placeholder: "Enter your email",
      type: "input",
    },
  ];

  const currentQuestion = questions[currentStep];

  // Special handling for color picker step
  const currentValue = currentQuestion.id === "colors" 
    ? "" 
    : String(formData[currentQuestion.id as keyof PitchData] ?? "");
  
  const currentError = currentQuestion.id === "colors"
    ? (validateField("primaryColor", formData.primaryColor) || validateField("secondaryColor", formData.secondaryColor))
    : validateField(currentQuestion.id, currentValue);
  
  const isCurrentStepValid = !currentError;

  const handleChange = (value: string, colorType?: "primary" | "secondary") => {
    const fieldName = currentQuestion.id;
    
    // Handle color picker separately
    if (fieldName === "colors" && colorType) {
      const colorFieldName = colorType === "primary" ? "primaryColor" : "secondaryColor";
      setFormData({
        ...formData,
        [colorFieldName]: value,
      });
      const err = validateField(colorFieldName, value);
      setErrors((prev) => ({ ...prev, [colorFieldName]: err }));
    } else {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
      const err = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: err }));
    }
  };
  const handleNext = () => {
    const fieldName = currentQuestion.id;
    
    // Special validation for color picker step
    if (fieldName === "colors") {
      const primaryErr = validateField("primaryColor", formData.primaryColor);
      const secondaryErr = validateField("secondaryColor", formData.secondaryColor);
      setErrors((prev) => ({ 
        ...prev, 
        primaryColor: primaryErr,
        secondaryColor: secondaryErr 
      }));
      if (primaryErr || secondaryErr) return;
    } else {
      const value = String(formData[fieldName as keyof PitchData] ?? "");
      const err = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: err }));
      if (err) return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Changed: Check auth before completing
      handleCreatePitch();
    }
  };
  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      console.log("qitu jem");
      handleNext();
    }
  };

  const handleComplete = async (data: PitchData) => {
    // Validate all fields before submitting
    const allErrors: Record<string, string | undefined> = {};
    let firstInvalidIndex = -1;
    questions.forEach((q, idx) => {
      const v = String((data as any)[q.id] ?? "");
      const err = validateField(q.id, v);
      if (err) {
        allErrors[q.id] = err;
        if (firstInvalidIndex === -1) firstInvalidIndex = idx;
      }
    });
    if (firstInvalidIndex !== -1) {
      setErrors((prev) => ({ ...prev, ...allErrors }));
      setCurrentStep(firstInvalidIndex);
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      // Map UI fields -> API contract
      const payload = {
        startupName: data.startupName,
        problemSolved: data.problem,
        targetAudience: data.targetAudience,
        mainProduct: data.solution,
        uniqueSellingPoint: data.uniqueValue,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        email: data.email,
      };

      setProgress(30);
      const response = await generatePitch(payload as any);
      setProgress(80);

      // Try to extract backend-created pitch details; fall back if minimal response
      const generatedId =
        response?.data?.id || response?.id || Date.now().toString();

      const startupName =
        response?.data?.startupName ||
        response?.startupName ||
        data.startupName;

      const hasLanding = Boolean(
        response?.data?.landingPage || response?.landingPage
      );

      const newPitch: Pitch = {
        id: String(generatedId),
        name: startupName,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        views: 0,
        status: "draft",
        hasLanding,
        hasPDF: false,
      };

      addPitch(newPitch);
      setProgress(100);
      setIsGenerating(false);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Failed to generate pitch:", err);
      setIsGenerating(false);
      setProgress(0);
      const rawMessage = err?.message || "Failed to generate pitch";
      const normalized = rawMessage.toLowerCase();
      const limitMessage =
        "You have reached the pitch limit for the free plan. Upgrade to create more pitches.";
      setLimitModalMessage(
        normalized.includes("only create one pitch") ? limitMessage : rawMessage
      );
      setIsLimitModalOpen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to previous page in history (could be dashboard or landing page)
      navigate(-1);
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
    // Set flag to trigger auto-submit in useEffect when user is ready
    setShouldAutoSubmit(true);
  };

  const handleCreatePitch = () => {
    if (user) {
      handleComplete(formData);
    } else {
      setIsSignInModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-purple-50 via-white to-deep-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-gray-100">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create Your Pitch</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {questions.length}
                </CardDescription>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            >
              <XIcon />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <Label className="text-xl font-semibold text-gray-900">
              {currentQuestion.label}
            </Label>

            {currentQuestion.type === "color-picker" ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="primaryColor" className="text-base font-medium text-gray-700">
                    Primary Color
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange(e.target.value, "primary")}
                      className="h-14 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange(e.target.value, "primary")}
                      placeholder="#3b82f6"
                      className="text-lg py-6 border-2 border-gray-200 focus:border-premium-purple rounded-xl flex-1"
                      maxLength={7}
                    />
                  </div>
                  {errors.primaryColor && (
                    <p className="text-sm text-red-600">{errors.primaryColor}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="secondaryColor" className="text-base font-medium text-gray-700">
                    Secondary Color
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange(e.target.value, "secondary")}
                      className="h-14 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange(e.target.value, "secondary")}
                      placeholder="#1f1147"
                      className="text-lg py-6 border-2 border-gray-200 focus:border-premium-purple rounded-xl flex-1"
                      maxLength={7}
                    />
                  </div>
                  {errors.secondaryColor && (
                    <p className="text-sm text-red-600">{errors.secondaryColor}</p>
                  )}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-3">Preview:</p>
                  <div className="flex gap-3">
                    <div 
                      className="flex-1 h-16 rounded-lg shadow-sm border-2 border-gray-200"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <div 
                      className="flex-1 h-16 rounded-lg shadow-sm border-2 border-gray-200"
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                  </div>
                </div>
              </div>
            ) : currentQuestion.type === "input" ? (
              <Input
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-lg py-6 border-1 border-[#252952] focus:border-[#161930] rounded-xl placeholder:text-gray-300"
                onKeyDown={handleKeyDown}
                autoFocus
                aria-invalid={Boolean(errors[currentQuestion.id])}
              />
            ) : (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-base min-h-[150px] border-1 border-[#252952] focus:border-[#161930] rounded-xl resize-none placeholder:text-gray-300"
                onKeyDown={handleKeyDown}
                autoFocus
                aria-invalid={Boolean(errors[currentQuestion.id])}
              />
            )}

            {errors[currentQuestion.id] && currentQuestion.type !== "color-picker" && (
              <p className="text-sm text-red-600">
                {errors[currentQuestion.id]}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-6 py-6 rounded-xl border-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="px-8 py-6 rounded-xl bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)]  text-white shadow-lg"
            >
              {currentStep === questions.length - 1 ? "Generate Pitch" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => {
          setIsSignInModalOpen(false);
        }}
        onSignInSuccess={handleSignInSuccess}
      />

      <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
        <DialogContent className="sm:max-w-md w-full h-auto border-0 shadow-2xl p-8 space-y-6 text-center">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <DialogTitle className="text-2xl text-center font-semibold text-gray-900">
              Upgrade To Keep Creating
            </DialogTitle>
            <DialogDescription className="text-center text-base text-gray-600">
              {limitModalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              className="px-6 py-3 rounded-xl bg-blue-900 text-white shadow-lg"
              onClick={() => setIsLimitModalOpen(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
