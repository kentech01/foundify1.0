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
  X,
  Upload,
  Palette,
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

import { Combobox } from "./ui/combobox";
import { INDUSTRIES } from "../constants/industries";

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
  const [search, setSearch] = useState("");
  
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState("");
  const [wantsGeneratedLogo, setWantsGeneratedLogo] = useState(false);

  // Auto-submit after successful sign-in when user is ready
  useEffect(() => {
    if (shouldAutoSubmit && user && !loading) {
      setShouldAutoSubmit(false);
      handleComplete(formData);
    }
  }, [shouldAutoSubmit, user, loading, formData]);

  const { generatePitch, updatePitchCompany, generateAndSaveCompanyLogo } =
    useApiService();

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
      id: "logo",
      title: "Brand",
      subtitle: "Upload or generate your logo",
      icon: Palette,
      optional: true,
      fields: [], // Logo step uses custom UI below
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

      case "status":
        // Optional field, no validation needed
        break;
    }
    return undefined;
  };

  const isStepValid = () => {
    // Step 2 (logo) has no required fields, always valid
    if (currentStep === 2) {
      return true;
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

  const handleNext = () => {
    // Step 2 (logo) is optional, proceed to pitch creation
    if (currentStep === 2) {
      handleCreatePitch();
      return;
    }

    // First, validate all fields in the current step
    const stepErrors: Record<string, string | undefined> = {};
    let hasStepErrors = false;

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

    // Update errors state - don't proceed if there are errors
    if (hasStepErrors) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return; // Don't proceed if there are errors
    }

    // Clear any errors for this step if validation passed
    currentStepData.fields.forEach((field) => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.id];
        return newErrors;
      });
    });

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
        targetAudience: data.oneLiner,
        mainProduct: data.oneLiner, // Use one-liner as main product after removing "value"
        uniqueSellingPoint: data.oneLiner,
        primaryColor: data.brandColor,
        secondaryColor: secondaryColor,
        email: user?.email || "",
      };

      setProgress(30);
      const response = await generatePitch(payload as any);
      setProgress(60);

      // Backend returns the saved pitch ID as pitchId
      const generatedId: string | null =
        response?.data?.pitchId ||
        response?.data?.id ||
        response?.id ||
        null;

      const startupName =
        response?.data?.startupName ||
        response?.startupName ||
        data.companyName;

      const hasLanding = Boolean(
        response?.data?.landingPage || response?.landingPage
      );

      // Only attempt to update pitch/ logo if we have a valid pitch ID from backend
      if (generatedId) {
        // Update new pitch with traction/status and logo
        try {
          await updatePitchCompany(generatedId, {
            companyName: data.companyName,
            industry: data.industry,
            oneLiner: data.oneLiner,
            problem: data.problem,
            value: data.oneLiner,
            status: data.status,
            brandColor: data.brandColor,
            logo: data.logo || undefined,
          });
        } catch (updateErr) {
          console.warn("Failed to update pitch with logo/traction:", updateErr);
        }

        if (wantsGeneratedLogo) {
          setProgress(75);
          try {
            await generateAndSaveCompanyLogo(generatedId, {
              companyName: data.companyName,
              industry: data.industry,
              oneLiner: data.oneLiner,
              problem: data.problem,
              value: data.oneLiner,
              status: data.status,
              brandColor: data.brandColor,
            });
          } catch (logoErr) {
            console.warn("Failed to generate logo:", logoErr);
          }
        }
      }

      setProgress(100);

      const clientPitchId = generatedId ?? Date.now().toString();

      const newPitch: Pitch = {
        id: String(clientPitchId),
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

  const handleBuilderLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid =
      file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    if (!valid) {
      setLogoError("Please upload SVG files only");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("File size must be less than 2MB");
      return;
    }
    setLogoError("");
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setFormData((prev) => ({ ...prev, logo: content }));
    };
    reader.readAsText(file);
  };

  const handleBuilderLogoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBuilderLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const valid =
      file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    if (!valid) {
      setLogoError("Please upload SVG files only");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("File size must be less than 2MB");
      return;
    }
    setLogoError("");
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setFormData((prev) => ({ ...prev, logo: content }));
    };
    reader.readAsText(file);
  };

  const clearBuilderLogo = () => {
    setLogoFile(null);
    setFormData((prev) => ({ ...prev, logo: undefined }));
    setLogoError("");
    setWantsGeneratedLogo(false);
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
          {/* Step 3: Logo (upload or generate) */}
          {currentStepData.id === "logo" ? (
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-[#252952]">
                  Upload your logo
                </Label>
                <label
                  htmlFor="builder-logo-upload"
                  onDragOver={handleBuilderLogoDragOver}
                  onDrop={handleBuilderLogoDrop}
                  className="border-2 border-dashed border-gray-300 rounded-[16px] p-12 text-center bg-gradient-to-br from-white to-gray-50 block transition-all hover:border-[#4A90E2] cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-base text-gray-600 mb-2">
                    Click to upload or drag and drop your existing logo
                  </p>
                  <p className="text-sm text-gray-500">SVG only (max. 2MB)</p>
                  <Input
                    id="builder-logo-upload"
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleBuilderLogoUpload}
                    className="hidden"
                  />
                </label>
                {logoFile && (
                  <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-700">{logoFile.name}</span>
                    <button
                      type="button"
                      onClick={clearBuilderLogo}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
                {logoError && (
                  <p className="text-sm text-red-600">{logoError}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold text-[#252952]">
                  Generate a logo for your company
                </Label>
                <div className="border-2 border-purple-200 rounded-[16px] p-6 bg-gradient-to-br from-white to-purple-50 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-gray-700">
                      Don&apos;t have a logo yet? We&apos;ll generate one after
                      you complete setup.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    className="bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-[999px] px-5"
                    onClick={() => setWantsGeneratedLogo(!wantsGeneratedLogo)}
                  >
                    {wantsGeneratedLogo ? (
                      <>✓ Generate after setup</>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate after setup
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
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
                  <Combobox
                    options={INDUSTRIES}
                    value={formData.industry}
                    onValueChange={(value) => handleChange("industry", value)}
                    placeholder={field.placeholder}
                    className="text-base h-14 border-2 border-gray-200 focus:border-[#252952] rounded-[12px]"
                  />
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
              You can skip this step and add a logo later from Company Profile
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
