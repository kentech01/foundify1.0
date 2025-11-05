import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ArrowRight, ArrowLeft, Sparkles, LogIn } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [formData, setFormData] = useState<PitchData>({
    startupName: "",
    problem: "",
    targetAudience: "",
    solution: "",
    uniqueValue: "",
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
      id: "email",
      label: "Your email address",
      placeholder: "Enter your email",
      type: "input",
    },
  ];

  const currentQuestion = questions[currentStep];

  const currentValue = String(
    formData[currentQuestion.id as keyof PitchData] ?? ""
  );
  const currentError = validateField(currentQuestion.id, currentValue);
  const isCurrentStepValid = !currentError;

  const handleChange = (value: string) => {
    const fieldName = currentQuestion.id;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    const err = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };
  const handleNext = () => {
    const fieldName = currentQuestion.id;
    const value = String(formData[fieldName as keyof PitchData] ?? "");
    const err = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
    if (err) return;

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Changed: Check auth before completing
      handleCreatePitch();
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
      alert(err?.message || "Failed to generate pitch");
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create Your Pitch</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {questions.length}
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-premium-purple to-deep-blue h-2 rounded-full transition-all duration-300"
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

            {currentQuestion.type === "input" ? (
              <Input
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-lg py-6 border-2 border-gray-200 focus:border-premium-purple rounded-xl"
                autoFocus
                aria-invalid={Boolean(errors[currentQuestion.id])}
              />
            ) : (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-base min-h-[150px] border-2 border-gray-200 focus:border-premium-purple rounded-xl resize-none"
                autoFocus
                aria-invalid={Boolean(errors[currentQuestion.id])}
              />
            )}

            {errors[currentQuestion.id] && (
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
              className="px-8 py-6 rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white shadow-lg"
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
    </div>
  );
}
