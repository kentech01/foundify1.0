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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  FileText,
  FileCheck,
  MessageSquare,
  Users,
  Mail,
  ClipboardList,
  ArrowRight,
  Download,
  Copy,
  CheckCircle,
  Star,
  Target,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import starterPackImage from "figma:asset/d60826e7654cae0c43327173cc7cdd845aca3e70.png";
import { useApiService } from "../services/api";
import { useRecoilState, useRecoilValue } from "recoil";
import { pitchesAtom } from "../atoms/pitchesAtom";
import { currentUserAtom } from "../atoms/userAtom";
import { LoadingModal } from "../components/LoadingModal";

const tools = [
  {
    id: "invoice",
    title: "Invoice Generator",
    description: "Create professional PDF invoices instantly",
    icon: FileText,
    color: "bg-blue-500",
    colorLight: "bg-blue-50",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    buttonText: "Generate Invoice",
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
    color: "bg-pink-500",
    colorLight: "bg-pink-50",
    isPremium: true,
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Create Feedback",
  },
  {
    id: "roles",
    title: "Founder Role Suggestions",
    description: "AI-powered role and responsibility mapping",
    icon: Users,
    color: "bg-purple-500",
    colorLight: "bg-purple-50",
    isPremium: true,
    buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
    buttonText: "Get Suggestions",
  },
  {
    id: "investor",
    title: "Investor Email Draft",
    description: "Professional outreach email templates",
    icon: Mail,
    color: "bg-blue-500",
    colorLight: "bg-blue-50",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    buttonText: "Draft Email",
  },
  {
    id: "interviews",
    title: "Customer Interview Guide",
    description: "Structured interview templates and questions",
    icon: ClipboardList,
    color: "bg-blue-500",
    colorLight: "bg-blue-50",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    buttonText: "Start Guide",
  },
  {
    id: "landing-page",
    title: "Landing Page Generator",
    description: "Generate a premium landing page for your startup",
    icon: FileCheck,
    color: "bg-purple-500",
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
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const apiService = useApiService();

  const currentUser = useRecoilValue<any>(currentUserAtom);

  const isLocked = currentUser?.profile?.plan === "basic";

  const [showLandingLoading, setShowLandingLoading] = useState(false);
  const [landingProgress, setLandingProgress] = useState(0);

  const handleToolAction = async (toolId: string) => {
    if (toolId === "landing-page") {
      // Find the first pitch using the API service
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

      let progressInterval: number | undefined;

      try {
        setIsGenerating(true);
        setShowLandingLoading(true);
        setLandingProgress(10);

        // Progress animation while generating
        progressInterval = window.setInterval(() => {
          setLandingProgress((p) => Math.min(p + 5, 95));
        }, 500);

        // Call the API to generate premium landing page
        const response = await apiService.generateLandingPage(
          firstPitch.id,
          "premium"
        );

        setLandingProgress(100);

        toast.success("Premium Landing Page Generated!", {
          description:
            "Your premium landing page has been created successfully.",
        });
      } catch (error: any) {
        toast.error("Failed to generate premium landing page", {
          description: error.message || "Please try again later.",
        });
      } finally {
        if (progressInterval) window.clearInterval(progressInterval);
        // brief pause so users see 100%
        setTimeout(() => {
          setShowLandingLoading(false);
          setLandingProgress(0);
        }, 400);
        setIsGenerating(false);
      }

      return;
    }
  };

  const generateContent = async (type: string, input: any) => {
    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      let content = "";

      switch (type) {
        case "investor":
          content = `Subject: Partnership Opportunity - ${input.startupName}

Dear ${input.investorName},

I hope this email finds you well. My name is ${input.founderName}, and I'm the founder of ${input.startupName}, a ${input.industry} startup that ${input.description}.

We're currently raising a ${input.fundingStage} round to ${input.useOfFunds}. Based on your portfolio and investment focus, I believe ${input.startupName} would be a great fit for your interests.

Key highlights:
• ${input.traction}
• Strong market opportunity in ${input.industry}
• Experienced team with proven track record

I'd love to share our pitch deck and discuss how we can work together. Would you be available for a brief call next week?

Best regards,
${input.founderName}
Founder & CEO, ${input.startupName}`;
          break;

        case "contracts":
          content = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between:

Party A: ${input.company1 || "[COMPANY 1]"}
Party B: ${input.company2 || "[COMPANY 2]"}

1. PURPOSE: The parties wish to explore potential business opportunities and may disclose confidential information.

2. CONFIDENTIAL INFORMATION: Any information disclosed that is marked as confidential or should reasonably be considered confidential.

3. OBLIGATIONS: Each party agrees to:
   - Keep all confidential information strictly confidential
   - Use the information solely for evaluation purposes
   - Not disclose to third parties without written consent

4. TERM: This agreement shall remain in effect for 2 years from the date of signing.

[Additional standard NDA clauses would follow...]`;
          break;

        case "feedback":
          content = `360° FEEDBACK FRAMEWORK FOR ${input.employeeName.toUpperCase()}

PERFORMANCE REVIEW PERIOD: ${input.period}

1. CORE COMPETENCIES ASSESSMENT:
   ${input.competencies
     .split(",")
     .map((comp: string) => `   • ${comp.trim()}: [Rating 1-5]`)
     .join("\n")}

2. PEER FEEDBACK QUESTIONS:
   • What are ${input.employeeName}'s strongest contributions to the team?
   • Where could ${input.employeeName} improve or grow?
   • How effectively does ${input.employeeName} collaborate with others?

3. SELF-ASSESSMENT PROMPTS:
   • What achievements are you most proud of this period?
   • What challenges did you face and how did you address them?
   • What goals would you like to set for next period?

4. MANAGER EVALUATION:
   • Technical skills demonstration
   • Leadership and initiative
   • Communication effectiveness
   • Goal achievement and impact`;
          break;

        default:
          content = "Generated content will appear here...";
      }

      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success("Content generated successfully!");
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Copied to clipboard!");
  };
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
              className={`border-2 rounded-2xl transition-all duration-300 ${
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

      {/* Tool Modals */}

      {/* Investor Email Modal */}
      <Dialog
        open={activeModal === "investor"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Investor Email Generator
            </DialogTitle>
            <DialogDescription>
              Create professional outreach emails to potential investors
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Email Form</TabsTrigger>
              <TabsTrigger value="generated">Generated Email</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input
                    placeholder="Enter your name"
                    className="rounded-xl"
                    id="founderName"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Startup Name</Label>
                  <Input
                    placeholder="Your startup name"
                    className="rounded-xl"
                    id="startupName"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Investor Name</Label>
                  <Input
                    placeholder="Investor's name"
                    className="rounded-xl"
                    id="investorName"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brief Description</Label>
                <Textarea
                  placeholder="Briefly describe what your startup does"
                  className="rounded-xl"
                  id="description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Funding Stage</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Key Traction</Label>
                  <Input
                    placeholder="e.g. 10k users, $50k MRR"
                    className="rounded-xl"
                    id="traction"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Use of Funds</Label>
                <Textarea
                  placeholder="How will you use the investment?"
                  className="rounded-xl"
                  id="useOfFunds"
                />
              </div>

              <Button
                onClick={() => {
                  const formData = {
                    founderName:
                      (
                        document.getElementById(
                          "founderName"
                        ) as HTMLInputElement
                      )?.value || "",
                    startupName:
                      (
                        document.getElementById(
                          "startupName"
                        ) as HTMLInputElement
                      )?.value || "",
                    investorName:
                      (
                        document.getElementById(
                          "investorName"
                        ) as HTMLInputElement
                      )?.value || "",
                    industry: "FinTech", // Default
                    description:
                      (
                        document.getElementById(
                          "description"
                        ) as HTMLTextAreaElement
                      )?.value || "",
                    fundingStage: "Seed", // Default
                    traction:
                      (document.getElementById("traction") as HTMLInputElement)
                        ?.value || "",
                    useOfFunds:
                      (
                        document.getElementById(
                          "useOfFunds"
                        ) as HTMLTextAreaElement
                      )?.value || "",
                  };
                  generateContent("investor", formData);
                }}
                className="w-full bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Email"}
              </Button>
            </TabsContent>

            <TabsContent value="generated" className="space-y-4">
              {generatedContent ? (
                <>
                  <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                    <pre className="whitespace-pre-wrap text-sm">
                      {generatedContent}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="rounded-xl"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Email
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                      <Mail className="mr-2 h-4 w-4" />
                      Open in Email Client
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Generate an email first to see the content here
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Contract Templates Modal */}
      <Dialog
        open={activeModal === "contracts"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-600" />
              Legal Contract Templates
            </DialogTitle>
            <DialogDescription>
              Generate legal documents and agreements for your startup
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Non-Disclosure Agreement (NDA)",
                  desc: "Protect confidential information",
                  icon: FileCheck,
                },
                {
                  name: "Founder Agreement",
                  desc: "Define roles and equity splits",
                  icon: Users,
                },
                {
                  name: "Employment Contract",
                  desc: "Standard employee agreements",
                  icon: FileText,
                },
                {
                  name: "Consultant Agreement",
                  desc: "Independent contractor terms",
                  icon: ClipboardList,
                },
              ].map((template, index) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={index}
                    className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-xl cursor-pointer"
                    onClick={() => {
                      const input = {
                        company1: "Your Company",
                        company2: "Partner Company",
                      };
                      generateContent("contracts", input);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {template.desc}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {generatedContent && (
              <>
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Template
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Coach Modal */}
      <Dialog
        open={activeModal === "feedback"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-pink-600" />
              360° Feedback Coach
            </DialogTitle>
            <DialogDescription>
              Create structured feedback frameworks for your team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee Name</Label>
                <Input
                  placeholder="Enter employee name"
                  className="rounded-xl"
                  id="employeeName"
                />
              </div>
              <div className="space-y-2">
                <Label>Review Period</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1-2025">Q1 2025</SelectItem>
                    <SelectItem value="q2-2025">Q2 2025</SelectItem>
                    <SelectItem value="q3-2025">Q3 2025</SelectItem>
                    <SelectItem value="q4-2025">Q4 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Core Competencies (comma-separated)</Label>
              <Textarea
                placeholder="e.g. Communication, Technical Skills, Leadership, Teamwork"
                className="rounded-xl"
                id="competencies"
              />
            </div>

            <Button
              onClick={() => {
                const formData = {
                  employeeName:
                    (
                      document.getElementById(
                        "employeeName"
                      ) as HTMLInputElement
                    )?.value || "Employee",
                  period: "Q1 2025",
                  competencies:
                    (
                      document.getElementById(
                        "competencies"
                      ) as HTMLTextAreaElement
                    )?.value || "Communication, Technical Skills, Leadership",
                };
                generateContent("feedback", formData);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Feedback Framework"}
            </Button>

            {generatedContent && (
              <>
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Framework
                  </Button>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                    <Download className="mr-2 h-4 w-4" />
                    Export Template
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Tool Modals for Free Tools */}
      <Dialog
        open={activeModal === "interviews"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              Customer Interview Guide
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Essential Interview Questions:
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• What's your biggest challenge with [problem area]?</li>
                <li>• How do you currently solve this problem?</li>
                <li>• What would an ideal solution look like?</li>
                <li>• What tools do you currently use?</li>
                <li>• How much time/money does this problem cost you?</li>
              </ul>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Download Full Interview Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade CTA */}
      {!isPremium && (
        <Card className="mt-12 border-2 border-premium-purple bg-gradient-to-br from-premium-purple-50 to-white rounded-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Unlock All Tools with Premium
                </h3>
                <p className="text-gray-600 text-lg">
                  Get access to all 6 essential founder tools for just $10/month
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-premium-purple flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>All 6 essential founder tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-premium-purple flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>AI-assisted pitch building</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-premium-purple flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl px-8 py-6 text-lg shadow-xl whitespace-nowrap"
              >
                Upgrade to Premium
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
