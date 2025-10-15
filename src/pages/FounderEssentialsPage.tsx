import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  FileText,
  FileCheck,
  MessageSquare,
  Users,
  Mail,
  ArrowRight,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useApiService } from "../services/api";
import { useRecoilValue } from "recoil";
import { currentUserAtom } from "../atoms/userAtom";
import { LoadingModal } from "../components/LoadingModal";
import { useNavigate } from "react-router-dom";
import { AIHiringAssistant } from "../components/AIHiringAssistant";
import { InvestorEmailDraft } from "../components/InvestorEmailDraft";
import { FeedbackCoach } from "../components/FeedbackCoach";
import { Input } from "../components/ui/input";
import { InvoicesPage } from "./invoices/InvoicesPage";
import { ContractsListPage } from "./ContractsListPage";
import React from "react";

const tools = [
  {
    id: "invoice",
    title: "Invoice Generator",
    description: "Create professional PDF invoices instantly",
    icon: FileText,
    color: "bg-purple-500",
    colorLight: "bg-purple-50",
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Generate Invoice",
    isPremium: true,
  },
  {
    id: "contracts",
    title: "Contract Templates",
    description: "NDA, Founder Agreement, and legal templates",
    icon: FileCheck,
    color: "bg-purple-500",
    colorLight: "bg-purple-50",
    isPremium: true,
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Browse Templates",
  },
  {
    id: "feedback",
    title: "Feedback Coach",
    description: "Structure meaningful feedback for your team",
    icon: MessageSquare,
    color: "bg-purple-500",
    colorLight: "bg-purple-50",
    isPremium: true,
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Create Feedback",
  },
  {
    id: "investor",
    title: "Investor Email Draft",
    description: "Professional outreach email templates",
    icon: Mail,
    color: "bg-purple-500",
    colorLight: "bg-purple-50",
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Draft Email",
    isPremium: true,
  },
  {
    id: "ai-hiring",
    title: "AI Hiring Assistant",
    description: "Generate interview questions and evaluate candidates",
    icon: Users,
    color: "bg-pink-500",
    colorLight: "bg-purple-50",
    isPremium: true,
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "AI Hiring Assistant",
  },
  {
    id: "landing-page",
    title: "Landing Page Generator",
    description: "Generate a premium landing page for your startup",
    icon: FileCheck,
    color: "bg-pink-500",
    colorLight: "bg-purple-50",
    isPremium: true,
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Generate Landing Page",
  },
];

interface FounderEssentialsPageProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export function FounderEssentialsPage({
  isPremium,
  onUpgrade,
}: FounderEssentialsPageProps) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const apiService = useApiService();
  const currentUser = useRecoilValue<any>(currentUserAtom);
  const isLocked = false;
  const [showLandingLoading, setShowLandingLoading] = useState(false);
  const [landingProgress, setLandingProgress] = useState(0);

  // Add new states for logo upload
  const [showLogoUploadModal, setShowLogoUploadModal] = useState(false);
  const [logoSvgContent, setLogoSvgContent] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [showInvoices, setShowInvoices] = useState(false);
  const [showContracts, setShowContracts] = useState(false);

  const modalContentClass = "overflow-y-auto w-3/4 ";

  // Add function to handle SVG file upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes("svg")) {
      setUploadError("Please upload only SVG files");
      setLogoSvgContent(null);
      setLogoFileName("");
      return;
    }

    setUploadError("");
    setLogoFileName(file.name);

    // Read SVG file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setLogoSvgContent(content);
    };
    reader.onerror = () => {
      setUploadError("Failed to read SVG file");
      setLogoSvgContent(null);
      setLogoFileName("");
    };
    reader.readAsText(file);
  };

  // Add function to clear logo
  const clearLogo = () => {
    setLogoSvgContent(null);
    setLogoFileName("");
    setUploadError("");
  };

  // Add function to proceed with landing page generation
  const proceedWithLandingPageGeneration = async (firstPitch: any) => {
    setShowLogoUploadModal(false);
    let progressInterval: number | undefined;

    try {
      setIsGenerating(true);
      setShowLandingLoading(true);
      setLandingProgress(10);

      progressInterval = window.setInterval(() => {
        setLandingProgress((p) => Math.min(p + 5, 95));
      }, 500);

      const response = await apiService.generateLandingPage(
        firstPitch.id,
        "premium",
        logoSvgContent || undefined // Pass SVG content
      );

      setLandingProgress(100);

      toast.success("Premium Landing Page Generated!", {
        description: "Your premium landing page has been created successfully.",
      });

      // Clear logo after successful generation
      clearLogo();
    } catch (error: any) {
      toast.error("Failed to generate premium landing page", {
        description: error.message || "Please try again later.",
      });
    } finally {
      if (progressInterval) window.clearInterval(progressInterval);
      setTimeout(() => {
        setShowLandingLoading(false);
        setLandingProgress(0);
      }, 400);
      setIsGenerating(false);
    }
  };

  const handleToolAction = async (toolId: string) => {
    if (toolId === "invoice") {
      setShowInvoices(true);
      return;
    }

    if (toolId === "contracts") {
      setShowContracts(true);
      return;
    }

    if (toolId === "investor") {
      setActiveModal("investor");
      return;
    }

    if (toolId === "feedback") {
      setActiveModal("feedback");
      return;
    }

    if (toolId === "landing-page") {
      const firstPitch = await apiService.getFirstPitch();

      if (!firstPitch) {
        toast.error("No first pitch found", {
          description:
            "Please create your first pitch to generate a premium landing page.",
        });
        return;
      }

      if (isLocked) {
        onUpgrade();
        return;
      }

      // Open logo upload modal instead of generating immediately
      setShowLogoUploadModal(true);
      // Store firstPitch in state or pass it through
      (window as any).__firstPitch = firstPitch; // Temporary storage

      return;
    }

    if (toolId === "ai-hiring") {
      if (isLocked) {
        onUpgrade();
        return;
      }
      setActiveModal("ai-hiring");
      return;
    }
  };

  if (showInvoices) {
    return (
      <InvoicesPage
        showInvoices={showInvoices}
        setShowInvoices={setShowInvoices}
      />
    );
  }

  if (showContracts) {
    return (
      <ContractsListPage
        showContracts={showContracts}
        setShowContracts={setShowContracts}
      />
    );
  }

  return (
    <div className="p-8">
      <LoadingModal
        isOpen={showLandingLoading}
        type="landing"
        progress={landingProgress}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Founder Essentials
            </h2>
            <p className="text-gray-600">
              Essential tools to launch and grow your startup
            </p>
          </div>
          {!isPremium && (
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg"
            >
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <Card
              key={tool.id}
              className={`border-2 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isLocked
                  ? "border-gray-200 opacity-75"
                  : "border-gray-100 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl ${tool.colorLight} flex items-center justify-center`}
                  >
                    <Icon
                      className={`h-7 w-7 ${tool.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  {tool.isPremium && (
                    <Badge className="bg-premium-purple text-white hover:bg-premium-purple">
                      Premium
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className={`w-full rounded-xl text-white ${
                    isLocked
                      ? "bg-gray-300 hover:bg-gray-400 cursor-not-allowed"
                      : tool.buttonColor
                  }`}
                  onClick={() =>
                    isLocked ? onUpgrade() : handleToolAction(tool.id)
                  }
                  disabled={isLocked || isGenerating}
                >
                  {isLocked ? (
                    <>
                      Unlock with Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {tool.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Investor Email Modal */}
      <Dialog
        open={activeModal === "investor"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className={modalContentClass}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Investor Email Generator
            </DialogTitle>
          </DialogHeader>
          <InvestorEmailDraft />
        </DialogContent>
      </Dialog>

      {/* Feedback Coach Modal */}
      <Dialog
        open={activeModal === "feedback"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className={modalContentClass}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-pink-600" />
              360° Feedback Coach
            </DialogTitle>
          </DialogHeader>
          <FeedbackCoach />
        </DialogContent>
      </Dialog>

      {/* AI Hiring Assistant Modal */}
      <Dialog
        open={activeModal === "ai-hiring"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className={modalContentClass}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              AI Hiring Assistant
            </DialogTitle>
            <DialogDescription>
              Generate smart interview questions and evaluate candidates
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <AIHiringAssistant />
          </div>
        </DialogContent>
      </Dialog>

      {/* Logo Upload Modal */}
      <Dialog
        open={showLogoUploadModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowLogoUploadModal(false);
            clearLogo();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Upload Your Logo (Optional)
            </DialogTitle>
            <DialogDescription>
              Upload an SVG logo to include in your landing page. You can also
              skip this step.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
              <label htmlFor="logo-upload" className="cursor-pointer block">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG files only</p>
                <Input
                  id="logo-upload"
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Show uploaded file */}
            {logoFileName && (
              <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-700">{logoFileName}</span>
                </div>
                <button
                  onClick={clearLogo}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {uploadError}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Skip logo upload and generate
                  // setLogoSvgContent(null);
                  // const firstPitch = (window as any).__firstPitch;
                  // proceedWithLandingPageGeneration(firstPitch);
                  setShowLogoUploadModal(false);
                  clearLogo();
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-premium-purple hover:bg-premium-purple-dark"
                onClick={() => {
                  const firstPitch = (window as any).__firstPitch;
                  proceedWithLandingPageGeneration(firstPitch);
                }}
                disabled={!logoSvgContent || !!uploadError}
              >
                Generate Landing Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
