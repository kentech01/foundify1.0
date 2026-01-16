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
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Target,
  TrendingUp,
  Palette,
  Upload,
  Check,
  X,
} from "lucide-react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const BRAND_COLORS = [
  {
    name: "Navy Blue",
    value: "#252952",
    gradient: "from-[#252952] to-[#1a1d3a]",
  },
  {
    name: "Ocean Blue",
    value: "#4A90E2",
    gradient: "from-[#4A90E2] to-[#357ABD]",
  },
  {
    name: "Purple",
    value: "#8B5CF6",
    gradient: "from-purple-600 to-purple-700",
  },
  {
    name: "Emerald",
    value: "#10B981",
    gradient: "from-emerald-500 to-emerald-600",
  },
  { name: "Rose", value: "#F43F5E", gradient: "from-rose-500 to-rose-600" },
  { name: "Amber", value: "#F59E0B", gradient: "from-amber-500 to-amber-600" },
  { name: "Slate", value: "#475569", gradient: "from-slate-600 to-slate-700" },
  { name: "Teal", value: "#14B8A6", gradient: "from-teal-500 to-teal-600" },
];

const INDUSTRIES = [
  "AI/ML",
  "Analytics",
  "B2B SaaS",
  "B2C Consumer",
  "Blockchain / Crypto",
  "Climate / CleanTech",
  "Construction / Real Estate",
  "Creator Economy",
  "Cybersecurity",
  "Developer Tools",
  "E-commerce / Marketplaces",
  "EdTech",
  "Energy",
  "Enterprise Software",
  "Fintech",
  "Gaming",
  "Government / Public Sector",
  "Hardware / IoT",
  "Healthcare",
  "HR / Future of Work",
  "LegalTech",
  "Logistics / Supply Chain",
  "Manufacturing",
  "Media / Entertainment",
  "Productivity",
  "PropTech",
  "Retail",
  "Sales / Marketing Tech",
  "Social / Community",
  "Travel / Hospitality",
  "Other",
];

interface BuilderFormData {
  companyName: string;
  industry: string;
  oneLiner: string;
  problem: string;
  value: string;
  status: string;
  brandColor: string;
  logo?: string;
}

export function PitchBuilder() {
  const navigate = useNavigate();
  const { addPitch, setIsGenerating, setProgress } = useApp();
  const { user, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [formData, setFormData] = useState<BuilderFormData>({
    companyName: "",
    industry: "",
    oneLiner: "",
    problem: "",
    value: "",
    status: "",
    brandColor: "#252952",
    logo: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Auto-submit after successful sign-in when user is ready
  useEffect(() => {
    if (shouldAutoSubmit && user && !loading) {
      setShouldAutoSubmit(false);
      handleComplete(formData);
    }
  }, [shouldAutoSubmit, user, loading, formData]);

  const { generatePitch } = useApiService();

  const steps = [
    {
      id: "snapshot",
      title: "Company Snapshot",
      subtitle: "Who you are, in one sentence",
      icon: Building2,
      fields: [
        {
          id: "companyName",
          label: "Company name",
          placeholder: "Enter your company name",
          type: "input" as const,
          required: true,
        },
        {
          id: "industry",
          label: "Industry",
          placeholder: "Select your industry",
          type: "select" as const,
          required: true,
        },
        {
          id: "oneLiner",
          label: "What does your company do?",
          placeholder:
            "We help teams generate investor-ready pitches and business documents using AI.",
          helperText: "One sentence that explains your company",
          type: "textarea" as const,
          required: true,
        },
      ],
    },
    {
      id: "problem-value",
      title: "Problem & Value",
      subtitle: "Why your company exists",
      icon: Target,
      fields: [
        {
          id: "problem",
          label: "What problem do you solve?",
          placeholder: "Describe the problem your company addresses...",
          helperText: "Write it as if you're explaining it to a smart friend.",
          type: "textarea" as const,
          required: true,
        },
        {
          id: "value",
          label: "How do you create value?",
          placeholder: "Explain how you help your customers...",
          helperText: "Focus on the benefits and outcomes you deliver.",
          type: "textarea" as const,
          required: true,
        },
      ],
    },
    {
      id: "status",
      title: "Status / Traction",
      subtitle: "Where you are today",
      icon: TrendingUp,
      optional: true,
      fields: [
        {
          id: "status",
          label: "Current status or traction",
          placeholder:
            'e.g., "Early stage", "500+ customers", "$50k ARR", "Used by internal teams"',
          helperText:
            "This is completely optional and never blocks your progress.",
          type: "textarea" as const,
          required: false,
        },
      ],
    },
    {
      id: "brand",
      title: "Brand Identity",
      subtitle: "How your company looks everywhere",
      icon: Palette,
      fields: [],
    },
  ];

  const currentStepData = steps[currentStep];

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "companyName":
        if (!value.trim()) return "Company name is required";
        if (value.trim().length < 2)
          return "Company name must be at least 2 characters long";
        if (value.trim().length > 100)
          return "Company name cannot exceed 100 characters";
        break;

      case "industry":
        if (!value.trim()) return "Industry is required";
        if (value.trim().length < 2)
          return "Industry must be at least 2 characters long";
        if (value.trim().length > 120)
          return "Industry cannot exceed 120 characters";
        break;

      case "oneLiner":
        if (!value.trim()) return "Company description is required";
        if (value.trim().length < 10)
          return "Company description must be at least 10 characters long";
        if (value.trim().length > 500)
          return "Company description cannot exceed 500 characters";
        break;

      case "problem":
        if (!value.trim()) return "Problem description is required";
        if (value.trim().length < 10)
          return "Problem description must be at least 10 characters long";
        if (value.trim().length > 1000)
          return "Problem description cannot exceed 1000 characters";
        break;

      case "value":
        if (!value.trim()) return "Value proposition is required";
        if (value.trim().length < 10)
          return "Value proposition must be at least 10 characters long";
        if (value.trim().length > 1000)
          return "Value proposition cannot exceed 1000 characters";
        break;

      case "status":
        // Optional field, no validation needed
        break;

      case "brandColor":
        if (!value.trim()) return "Brand color is required";
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value))
          return "Please provide a valid hex color";
        break;
    }
    return undefined;
  };

  const isStepValid = () => {
    // Step 2 (status/traction) is optional, always valid
    if (currentStep === 2) {
      return true;
    }

    // Step 3 (brand) - check if there's a validation error for brandColor
    if (currentStep === 3) {
      return !errors.brandColor;
    }

    // For other steps, check both that required fields have values AND no validation errors
    const requiredFields = currentStepData.fields.filter((f) => f.required);

    // First check if all required fields have values
    const allFieldsHaveValues = requiredFields.every((field) => {
      const value =
        formData[field.id as keyof BuilderFormData]?.toString().trim() || "";
      return value.length > 0;
    });

    // Then check if there are any validation errors for fields in this step
    const hasErrors = currentStepData.fields.some((field) => {
      return errors[field.id] !== undefined && errors[field.id] !== null;
    });

    return allFieldsHaveValues && !hasErrors;
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });
    // Only clear error if one exists - don't show new errors until Continue is clicked
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: undefined }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData({
      ...formData,
      brandColor: color,
    });
    // Only clear error if one exists - don't show new errors until Continue is clicked
    if (errors.brandColor) {
      setErrors((prev) => ({ ...prev, brandColor: undefined }));
    }
  };

  const handleNext = () => {
    // Step 2 (status/traction) is optional, skip validation
    if (currentStep === 2) {
      // Proceed directly to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleCreatePitch();
      }
      return;
    }

    // First, validate all fields in the current step
    const stepErrors: Record<string, string | undefined> = {};
    let hasStepErrors = false;

    if (currentStep === 3) {
      // Validate brand color
      const brandColorErr = validateField("brandColor", formData.brandColor);
      if (brandColorErr) {
        stepErrors.brandColor = brandColorErr;
        hasStepErrors = true;
      }
    } else {
      // Validate all required fields in current step
      currentStepData.fields.forEach((field) => {
        if (field.required) {
          const value = String(
            formData[field.id as keyof BuilderFormData] ?? ""
          );
          const err = validateField(field.id, value);
          if (err) {
            stepErrors[field.id] = err;
            hasStepErrors = true;
          }
        }
      });
    }

    // Update errors state - don't proceed if there are errors
    if (hasStepErrors) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return; // Don't proceed if there are errors
    }

    // Clear any errors for this step if validation passed
    if (currentStep === 3) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.brandColor;
        return newErrors;
      });
    } else {
      currentStepData.fields.forEach((field) => {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field.id];
          return newErrors;
        });
      });
    }

    // If validation passes, proceed to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Check auth before completing
      handleCreatePitch();
    }
  };

  // Helper to generate secondary color from primary (darken it)
  const generateSecondaryColor = (primaryColor: string): string => {
    // Convert hex to RGB
    const hex = primaryColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Darken by 30%
    const darkenedR = Math.max(0, Math.floor(r * 0.7));
    const darkenedG = Math.max(0, Math.floor(g * 0.7));
    const darkenedB = Math.max(0, Math.floor(b * 0.7));

    // Convert back to hex
    return `#${darkenedR.toString(16).padStart(2, "0")}${darkenedG
      .toString(16)
      .padStart(2, "0")}${darkenedB.toString(16).padStart(2, "0")}`;
  };

  const handleComplete = async (data: BuilderFormData) => {
    // Validate all required fields before submitting
    const allErrors: Record<string, string | undefined> = {};
    let firstInvalidIndex = -1;

    steps.forEach((step, stepIdx) => {
      step.fields.forEach((field) => {
        if (field.required) {
          const value = String((data as any)[field.id] ?? "");
          const err = validateField(field.id, value);
          if (err) {
            allErrors[field.id] = err;
            if (firstInvalidIndex === -1) firstInvalidIndex = stepIdx;
          }
        }
      });
    });

    // Validate brand color
    const brandColorErr = validateField("brandColor", data.brandColor);
    if (brandColorErr) {
      allErrors.brandColor = brandColorErr;
      if (firstInvalidIndex === -1) firstInvalidIndex = 3;
    }

    if (firstInvalidIndex !== -1) {
      setErrors((prev) => ({ ...prev, ...allErrors }));
      setCurrentStep(firstInvalidIndex);
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      // Map new UI fields -> API contract
      // Use oneLiner for targetAudience, and combine with value for solution/mainProduct
      const secondaryColor = generateSecondaryColor(data.brandColor);

      const payload = {
        startupName: data.companyName,
        industry: data.industry,
        problemSolved: data.problem,
        targetAudience: data.oneLiner, // Use oneLiner as target audience description
        mainProduct: data.value, // Use value proposition as main product description
        uniqueSellingPoint: data.value, // Use value as unique selling point
        primaryColor: data.brandColor,
        secondaryColor: secondaryColor,
        email: user?.email || "", // Use email from authenticated user
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
        data.companyName;

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldType: "input" | "textarea"
  ) => {
    if (e.key === "Enter") {
      // For textareas, allow Shift+Enter for new lines
      if (fieldType === "textarea" && e.shiftKey) {
        return; // Allow default behavior (new line)
      }
      // For inputs or Enter without Shift in textareas, submit
      e.preventDefault();
      handleNext();
    }
  };

  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafbff] via-white to-[#f8fafc] flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl border-2 border-gray-200 rounded-[20px]">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#252952] to-[#4A90E2] flex items-center justify-center">
                <StepIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CardTitle className="text-2xl text-[#252952]">
                    {currentStepData.title}
                  </CardTitle>
                  {currentStepData.optional && (
                    <Badge className="bg-gray-100 text-gray-600 border-0">
                      Optional
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">
                  {currentStepData.subtitle}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#252952] to-[#4A90E2] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          {/* Regular form fields */}
          {currentStep < 3 && (
            <div className="space-y-6">
              {currentStepData.fields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <Label className="text-lg font-semibold text-[#252952]">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  {field.id === "industry" ? (
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleChange("industry", value)}
                    >
                      <SelectTrigger className="text-base h-14 border-2 border-gray-200 focus:border-[#252952] rounded-[12px]">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "input" ? (
                    <Input
                      placeholder={field.placeholder}
                      value={
                        (formData[
                          field.id as keyof BuilderFormData
                        ] as string) || ""
                      }
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, "input")}
                      className="text-base h-14 border-2 border-gray-200 focus:border-[#252952] rounded-[12px]"
                      autoFocus={field.id === currentStepData.fields[0]?.id}
                      autoComplete="off"
                    />
                  ) : (
                    <Textarea
                      placeholder={field.placeholder}
                      value={
                        (formData[
                          field.id as keyof BuilderFormData
                        ] as string) || ""
                      }
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, "textarea")}
                      className="text-base min-h-[140px] border-2 border-gray-200 focus:border-[#252952] rounded-[12px] resize-none"
                      autoFocus={field.id === currentStepData.fields[0]?.id}
                      autoComplete="off"
                    />
                  )}

                  {field.helperText && (
                    <p className="text-sm text-gray-500 mt-2">
                      {field.helperText}
                    </p>
                  )}

                  {errors[field.id] && (
                    <p className="text-sm text-red-600">{errors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Brand Identity Step */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="bg-[#f8fafc] rounded-[16px] p-6 border border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-[#4A90E2] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#252952] mb-2">
                      Choose one option
                    </h3>
                    <p className="text-sm text-gray-600">
                      Upload your logo or pick a primary brand color. Foundify
                      will auto-generate the rest.
                    </p>
                  </div>
                </div>
              </div>

              {/* Logo Upload Option */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-[#252952]">
                  Upload Logo (SVG / PNG)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-[12px] p-8 text-center hover:border-[#4A90E2] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">SVG, PNG (max. 2MB)</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    or
                  </span>
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-[#252952]">
                  Pick a Primary Brand Color
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {BRAND_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorSelect(color.value)}
                      className={`relative h-20 rounded-[12px] bg-gradient-to-br ${
                        color.gradient
                      } transition-all hover:scale-105 ${
                        formData.brandColor === color.value
                          ? "ring-4 ring-[#252952] ring-offset-2"
                          : "ring-2 ring-gray-200"
                      }`}
                    >
                      {formData.brandColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <Check className="w-5 h-5 text-[#252952]" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Selected:{" "}
                  <span className="font-semibold text-[#252952]">
                    {
                      BRAND_COLORS.find((c) => c.value === formData.brandColor)
                        ?.name
                    }
                  </span>
                </p>
                {errors.brandColor && (
                  <p className="text-sm text-red-600">{errors.brandColor}</p>
                )}
              </div>

              {/* Preview */}
              <div className="bg-[#f8fafc] rounded-[16px] p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-[#252952] mb-4">
                  Preview
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Used across pitches, emails, landing pages, and documents.
                </p>
                <div className="space-y-3">
                  {/* Preview button */}
                  <div
                    className="h-12 rounded-[10px] flex items-center justify-center font-semibold text-white shadow-lg"
                    style={{ background: formData.brandColor }}
                  >
                    Primary Button
                  </div>
                  {/* Preview card */}
                  <div
                    className="h-24 rounded-[12px] p-4 border-2"
                    style={{
                      backgroundColor: `${formData.brandColor}15`,
                      borderColor: `${formData.brandColor}40`,
                    }}
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      Company Card
                    </div>
                    <div
                      className="font-semibold"
                      style={{ color: formData.brandColor }}
                    >
                      {formData.companyName || "Your Company"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        <div className="border-t border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-2 border-gray-200 hover:border-gray-300 rounded-[10px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px] shadow-lg px-8"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {currentStep === 2 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              You can skip this step and add traction details later
            </p>
          )}
        </div>
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
