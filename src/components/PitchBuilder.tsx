import { useState } from "react";
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

export function PitchBuilder() {
  const navigate = useNavigate();
  const { addPitch, setIsGenerating, setProgress } = useApp();
  const { user, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PitchData>({
    startupName: "",
    problem: "",
    targetAudience: "",
    solution: "",
    uniqueValue: "",
    email: "",
  });

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

  const handleChange = (value: string) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete(formData);
    }
  };

  const handleComplete = async (data: PitchData) => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate AI generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            // Create new pitch
            const newPitch: Pitch = {
              id: Date.now().toString(),
              name: data.startupName,
              createdAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              views: 0,
              status: "draft",
              hasLanding: false,
              hasPDF: false,
            };
            addPitch(newPitch);
            navigate("/dashboard");
          }, 500);
          return 100;
        }
        return prev + 8;
      });
    }, 400);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }

    navigate("/");
  };

  const isCurrentStepValid =
    formData[currentQuestion.id as keyof PitchData].trim().length > 0;

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  // Show loading or sign-in prompt if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-premium-purple-50 via-white to-deep-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-gray-100">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-premium-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-premium-purple-50 via-white to-deep-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-gray-100">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to create a pitch. Please sign in to
                continue.
              </p>
              <Button
                onClick={() => setIsSignInModalOpen(true)}
                className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white px-8 py-3 rounded-xl shadow-lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
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
              />
            ) : (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-base min-h-[150px] border-2 border-gray-200 focus:border-premium-purple rounded-xl resize-none"
                autoFocus
              />
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
