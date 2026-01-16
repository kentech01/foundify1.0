import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
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
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  FileText,
  Globe,
  Download,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Plus,
  Upload,
  X,
  FileCheck,
  Loader2,
  Building2,
  Target,
  Palette,
  Edit,
  CheckCircle2,
  Mail,
  Receipt,
  Users,
  QrCode,
  Copy,
  Zap,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react";
import { LoadingModal } from "../components/LoadingModal";
import { toast } from "sonner";
import { useApiService } from "../services/api";
import type { PitchHistoryItem, PitchHistoryResponse } from "../services/api";
import html2pdf from "html2pdf.js";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../atoms/userAtom";
import { pitchesAtom } from "../atoms/pitchesAtom";
import { useNavigate } from "react-router-dom";
import React from "react";

interface PitchDashboardProps {
  initialPitch?: any;
  onCreatePitch: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function PitchDashboard({
  initialPitch,
  isPremium,
  onCreatePitch,
  onUpgrade,
}: PitchDashboardProps) {
  const navigate = useNavigate();
  const apiService = useApiService();
  const [currentUser] = useRecoilState(currentUserAtom);
  const [pitches, setPitches] = useRecoilState(pitchesAtom); // Use atom state
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    hasMore: false,
  });
  const [loadingModal, setLoadingModal] = useState<{
    isOpen: boolean;
    type: "pdf" | "landing" | "generating";
  }>({
    isOpen: false,
    type: "generating",
  });
  const [progress, setProgress] = useState(0);

  // Landing Page Generator states
  const [firstPitchMeta, setFirstPitchMeta] = useState<any>(null);
  const [firstPitchHasPremiumLanding, setFirstPitchHasPremiumLanding] =
    useState(false);
  const [isFetchingFirstPitch, setIsFetchingFirstPitch] = useState(false);
  const [logoSvgContent, setLogoSvgContent] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [isGeneratingLanding, setIsGeneratingLanding] = useState(false);
  const [showLandingLoading, setShowLandingLoading] = useState(false);
  const [landingProgress, setLandingProgress] = useState(0);

  // Company profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editStep, setEditStep] = useState(0);

  const DEFAULT_INDUSTRIES = [
    "AI/ML",
    "SaaS",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "Education",
    "Enterprise Software",
    "Consumer",
    "B2B",
    "Other",
  ];

  const TEAM_SIZES = ["Just me", "2-5", "6-10", "11-25", "26-50", "50+"];

  const BRAND_COLORS = [
    { name: "Navy Blue", value: "#252952" },
    { name: "Ocean Blue", value: "#4A90E2" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Emerald", value: "#10B981" },
    { name: "Rose", value: "#F43F5E" },
    { name: "Amber", value: "#F59E0B" },
    { name: "Slate", value: "#475569" },
    { name: "Teal", value: "#14B8A6" },
  ];

  // Get basic company data from first pitch (details are loaded lazily when editing)
  const companyData = firstPitchMeta
    ? {
        companyName: firstPitchMeta.startupName || "",
        industry: firstPitchMeta.industry || "",
        oneLiner: firstPitchMeta.preview || "",
        problem: "",
        value: "",
        status: "",
        brandColor: "#252952",
        teamSize: "",
      }
    : null;

  const [industryOptions, setIndustryOptions] =
    useState<string[]>(DEFAULT_INDUSTRIES);

  const [isOpeningEditor, setIsOpeningEditor] = useState(false);
  const [regenCount, setRegenCount] = useState(0);

  const [editedData, setEditedData] = useState(
    companyData || {
      companyName: "",
      industry: "",
      oneLiner: "",
      problem: "",
      value: "",
      status: "",
      brandColor: "#252952",
      teamSize: "",
    }
  );

  const isProfileComplete = companyData?.companyName && companyData?.oneLiner;

  // Update editedData when companyData changes
  useEffect(() => {
    if (companyData) {
      setEditedData(companyData);
    }
  }, [firstPitchMeta]);

  // Load regenerate count from localStorage (per user + pitch)
  useEffect(() => {
    if (!currentUser?.uid || !firstPitchMeta?.id) return;
    const key = `foundify_regen_count_${currentUser.uid}_${firstPitchMeta.id}`;
    const stored = window.localStorage.getItem(key);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!Number.isNaN(parsed)) {
        setRegenCount(parsed);
      }
    }
  }, [currentUser?.uid, firstPitchMeta?.id]);

  const editSteps = [
    { id: "basics", label: "Company Basics", icon: Building2 },
    { id: "problem", label: "Problem & Value", icon: Target },
    { id: "credibility", label: "Credibility", icon: TrendingUp },
    { id: "brand", label: "Brand", icon: Palette },
  ];

  const handleSaveEdit = async () => {
    if (!firstPitchMeta?.id) {
      setIsEditing(false);
      setEditStep(0);
      return;
    }

    try {
      await apiService.updatePitchCompany(firstPitchMeta.id, {
        companyName: editedData.companyName,
        industry: editedData.industry,
        oneLiner: editedData.oneLiner,
        problem: editedData.problem,
        value: editedData.value,
        status: editedData.status,
        teamSize: editedData.teamSize,
        brandColor: editedData.brandColor,
      });
      setIsEditing(false);
      setEditStep(0);
      toast.success("Company profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update company profile:", error);
      toast.error("Failed to update company profile", {
        description: error.message || "Please try again later.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedData(
      companyData || {
        companyName: "",
        industry: "",
        oneLiner: "",
        problem: "",
        value: "",
        status: "",
        brandColor: "#252952",
        teamSize: "",
      }
    );
    setIsEditing(false);
    setEditStep(0);
  };

  // Load pitches with pagination
  const loadPitches = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response: PitchHistoryResponse = await apiService.getPitchHistory(
          page,
          pagination.limit
        );

        if (page === 1) {
          setPitches(response.data);
        } else {
          setPitches((prev) => [...(prev || []), ...response.data]);
        }

        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          hasMore: response.pagination.hasMore,
        });
      } catch (error: any) {
        console.error("Failed to load pitches:", error);
        toast.error("Failed to load pitches", {
          description: error.message || "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [apiService, pagination.limit, setPitches]
  );

  // Load more pitches
  const loadMorePitches = useCallback(() => {
    if (pagination.hasMore && !loading) {
      loadPitches(pagination.page + 1);
    }
  }, [loadPitches, pagination.hasMore, pagination.page, loading]);

  // Load pitches on component mount
  useEffect(() => {
    loadPitches(1);
  }, []);

  // Fetch first pitch for landing page generator
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsFetchingFirstPitch(true);
        const fp = await apiService.getFirstPitch();
        if (isMounted && fp) {
          setFirstPitchMeta(fp);
          setFirstPitchHasPremiumLanding(!!fp.hasLandingPagePremium);
        }
      } catch (_e) {
        // Silently fail - landing page generator will just not show
      } finally {
        if (isMounted) {
          setIsFetchingFirstPitch(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Refresh first pitch data after landing page generation
  const refreshFirstPitch = async () => {
    try {
      const refreshed = await apiService.getFirstPitch();
      if (refreshed) {
        setFirstPitchMeta(refreshed);
        setFirstPitchHasPremiumLanding(!!refreshed.hasLandingPagePremium);
      }
    } catch (_e) {
      // no-op: keep previous state if refresh fails
    }
  };

  // Handle SVG file upload
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

  // Clear logo
  const clearLogo = () => {
    setLogoSvgContent(null);
    setLogoFileName("");
    setUploadError("");
  };

  // Open landing page in new tab
  const openLandingPage = () => {
    if (firstPitchMeta?.startupName) {
      window.open(`/${firstPitchMeta.startupName}`, "_blank");
    }
  };

  // Generate premium landing page
  const generateLandingPage = async () => {
    if (!firstPitchMeta) {
      toast.error("No pitch found", {
        description:
          "Please create your first pitch to generate a premium landing page.",
      });
      return;
    }

    let progressInterval: number | undefined;

    try {
      setIsGeneratingLanding(true);
      setShowLandingLoading(true);
      setLandingProgress(10);

      progressInterval = window.setInterval(() => {
        setLandingProgress((p) => Math.min(p + 5, 95));
      }, 5000);

      const response = await apiService.generateLandingPage(
        firstPitchMeta.id,
        "premium",
        logoSvgContent || undefined
      );

      setLandingProgress(100);

      toast.success("Premium Landing Page Generated!", {
        description: "Your premium landing page has been created successfully.",
      });

      // Clear logo after successful generation
      clearLogo();

      // Refresh first pitch data
      await refreshFirstPitch();
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
      setIsGeneratingLanding(false);
    }
  };

  // Convert JSON pitch content to HTML
  const formatPitchContentAsHtml = (
    pitchContent: any,
    startupName: string,
    primaryColor: string = "#252952"
  ) => {
    // Handle case where pitchContent might be a string (JSON) or already an object
    let content: any;
    if (typeof pitchContent === "string") {
      try {
        content = JSON.parse(pitchContent);
      } catch {
        // If it's not valid JSON, treat it as HTML
        return pitchContent;
      }
    } else {
      content = pitchContent;
    }

    // If it's not an object with expected fields, return as-is (might already be HTML)
    if (!content || typeof content !== "object" || !content.startupName) {
      return typeof pitchContent === "string"
        ? pitchContent
        : JSON.stringify(pitchContent);
    }

    const color = primaryColor || "#252952";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            background: #fff;
          }
          .pitch-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 4px solid ${color};
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            color: ${color};
            font-size: 36px;
            margin-bottom: 10px;
            font-weight: 700;
          }
          .subtitle {
            color: #666;
            font-size: 18px;
            font-weight: 500;
          }
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          .section-title {
            color: ${color};
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 15px;
            border-left: 4px solid ${color};
            padding-left: 15px;
          }
          .section-content {
            font-size: 16px;
            line-height: 1.8;
            color: #444;
            text-align: justify;
          }
          .highlight {
            background: ${color}15;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          @media print {
            body { padding: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="pitch-container">
          <div class="header">
            <h1>${content.startupName || startupName}</h1>
            ${
              content.industryArea
                ? `<p class="subtitle">${content.industryArea}</p>`
                : ""
            }
          </div>

          ${
            content.executiveSummary
              ? `
            <div class="section highlight">
              <div class="section-title">Executive Summary</div>
              <div class="section-content">${content.executiveSummary}</div>
            </div>
          `
              : ""
          }

          ${
            content.problemStatement
              ? `
            <div class="section">
              <div class="section-title">Problem Statement</div>
              <div class="section-content">${content.problemStatement}</div>
            </div>
          `
              : ""
          }

          ${
            content.solutionOverview
              ? `
            <div class="section">
              <div class="section-title">Solution Overview</div>
              <div class="section-content">${content.solutionOverview}</div>
            </div>
          `
              : ""
          }

          ${
            content.marketOpportunity
              ? `
            <div class="section">
              <div class="section-title">Market Opportunity</div>
              <div class="section-content">${content.marketOpportunity}</div>
            </div>
          `
              : ""
          }

          ${
            content.productDescription
              ? `
            <div class="section">
              <div class="section-title">Product Description</div>
              <div class="section-content">${content.productDescription}</div>
            </div>
          `
              : ""
          }

          ${
            content.uniqueValueProposition
              ? `
            <div class="section">
              <div class="section-title">Unique Value Proposition</div>
              <div class="section-content">${content.uniqueValueProposition}</div>
            </div>
          `
              : ""
          }

          ${
            content.targetMarketAnalysis
              ? `
            <div class="section">
              <div class="section-title">Target Market Analysis</div>
              <div class="section-content">${content.targetMarketAnalysis}</div>
            </div>
          `
              : ""
          }

          ${
            content.businessModel
              ? `
            <div class="section">
              <div class="section-title">Business Model</div>
              <div class="section-content">${content.businessModel}</div>
            </div>
          `
              : ""
          }

          ${
            content.competitiveAdvantage
              ? `
            <div class="section">
              <div class="section-title">Competitive Advantage</div>
              <div class="section-content">${content.competitiveAdvantage}</div>
            </div>
          `
              : ""
          }

          ${
            content.nextSteps
              ? `
            <div class="section">
              <div class="section-title">Next Steps</div>
              <div class="section-content">${content.nextSteps}</div>
            </div>
          `
              : ""
          }
        </div>
      </body>
      </html>
    `;
  };

  const handleDownload = (pitch: PitchHistoryItem) => {
    try {
      // Add classes to body and html to lock layout during PDF generation
      document.body.classList.add("pdf-generating");
      document.documentElement.classList.add("pdf-generating");

      // Get primary color from companyData or use default
      const primaryColor = companyData?.brandColor || "#252952";

      // Convert pitch content to HTML
      const htmlContent = pitch.pitchContent;

      // Create hidden container for PDF content
      const hiddenContainer = document.createElement("div");
      hiddenContainer.id = "pdf-temp-container";
      hiddenContainer.style.position = "absolute";
      hiddenContainer.style.left = "-9999px";
      hiddenContainer.style.width = "210mm";
      hiddenContainer.innerHTML = htmlContent;
      document.body.appendChild(hiddenContainer);

      const opt = {
        margin: 0.5,
        filename: `${pitch.startupName}_Pitch.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      } as any;

      html2pdf().set(opt).from(htmlContent).save();
    } catch (error: any) {
      console.error("Failed to download PDF:", error);
      document.body.classList.remove("pdf-generating");
      toast.error("Failed to download PDF", {
        description: error.message || "Please try again later.",
      });
    }
  };

  const handleViewLanding = async (pitch: PitchHistoryItem) => {
    try {
      const response = await apiService.getLandingPageHtml(pitch.id);

      if (response) {
        // Create a blob with the HTML content
        const blob = new Blob([response], {
          type: "text/html",
        });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${pitch.startupName}_landing_page.html`;

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(url);

        toast.success("Landing page downloaded successfully!");
      } else {
        toast.error("Failed to download landing page", {
          description: "No HTML content available.",
        });
      }
    } catch (error: any) {
      toast.error("Failed to open landing page", {
        description: error.message || "Please try again later.",
      });
    }
  };

  // const handleViewLandingPage = (pitch: PitchHistoryItem) => {
  //   window.open(`/${pitch.startupName}`, "_blank");
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCopyUrl = () => {
    if (firstPitchMeta?.startupName) {
      const url = `${window.location.origin}/${firstPitchMeta.startupName
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      navigator.clipboard.writeText(url);
      toast.success("Landing page URL copied!");
    }
  };

  const handleRegenerate = async () => {
    if (!firstPitchMeta?.id) {
      toast.error("No pitch to regenerate");
      return;
    }

    // Enforce a max of 10 regenerations per user per pitch (client-side)
    if (regenCount >= 10) {
      toast.error("Regeneration limit reached", {
        description:
          "You can regenerate this pitch up to 10 times. Please create a new pitch if you need more changes.",
      });
      return;
    }

    try {
      toast.loading("Regenerating pitch…", {
        id: "regenerate-pitch",
      });
      await apiService.regeneratePitch(firstPitchMeta.id);
      await loadPitches(1);

      const nextCount = regenCount + 1;
      setRegenCount(nextCount);
      if (currentUser?.uid) {
        const key = `foundify_regen_count_${currentUser.uid}_${firstPitchMeta.id}`;
        window.localStorage.setItem(key, String(nextCount));
      }

      toast.success("Pitch regenerated from your latest company info!", {
        id: "regenerate-pitch",
      });
    } catch (error: any) {
      console.error("Failed to regenerate pitch:", error);
      toast.error("Failed to regenerate pitch", {
        description: error.message || "Please try again later.",
        id: "regenerate-pitch",
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="grid gap-6">
        {/* Company Profile Card - Primary */}
        {companyData ? (
          <Card className="border-2 border-gray-200 rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Brand accent bar */}
            <div
              className="h-2"
              style={{
                background: `linear-gradient(90deg, ${companyData.brandColor} 0%, ${companyData.brandColor}80 100%)`,
              }}
            />

            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-6 flex-1">
                  {/* Logo/Icon */}
                  <div
                    className="w-20 h-20 rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${companyData.brandColor} 0%, ${companyData.brandColor}dd 100%)`,
                    }}
                  >
                    <Building2 className="w-10 h-10 text-white" />
                  </div>

                  {/* Company Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-[50px] font-bold text-[#252952] leading-tight">
                        {companyData.companyName}
                      </h2>
                      <Badge
                        className={`border-0 ${
                          isProfileComplete
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isProfileComplete ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Complete
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Needs Info
                          </>
                        )}
                      </Badge>
                    </div>

                    <p className="text-gray-700 text-[18px] mb-4 leading-relaxed">
                      {companyData.oneLiner}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      {companyData.industry && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                          <BarChart3 className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700 font-medium">
                            {companyData.industry}
                          </span>
                        </div>
                      )}
                      {companyData.status && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700 font-medium">
                            {companyData.status}
                          </span>
                        </div>
                      )}
                      {companyData.teamSize && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-700 font-medium">
                            {companyData.teamSize} people
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <Button
                  onClick={async () => {
                    if (isOpeningEditor) return;
                    setIsOpeningEditor(true);
                    try {
                      if (firstPitchMeta?.id) {
                        const details = await apiService.getPitchDetails(
                          firstPitchMeta.id
                        );
                        const pitch = details.data;
                        const backendIndustry = pitch.industry || "";
                        if (
                          backendIndustry &&
                          !industryOptions.includes(backendIndustry)
                        ) {
                          setIndustryOptions((prev) => [
                            backendIndustry,
                            ...prev,
                          ]);
                        }
                        setEditedData({
                          companyName: pitch.startupName || "",
                          industry:
                            backendIndustry || companyData?.industry || "",
                          oneLiner:
                            pitch.targetAudience || companyData?.oneLiner || "",
                          problem: pitch.problemSolved || "",
                          value:
                            pitch.mainProduct || pitch.uniqueSellingPoint || "",
                          status: pitch.traction || companyData?.status || "",
                          brandColor:
                            pitch.primaryColor ||
                            companyData?.brandColor ||
                            "#252952",
                          teamSize:
                            pitch.teamSize || companyData?.teamSize || "",
                        });
                      } else if (companyData) {
                        setEditedData(companyData);
                      }
                      setIsEditing(true);
                      setEditStep(0);
                    } catch (error) {
                      console.error("Failed to load pitch details:", error);
                      if (companyData) {
                        setEditedData(companyData);
                      }
                      toast.error("Failed to open company editor", {
                        description:
                          (error as any)?.message || "Please try again later.",
                      });
                    } finally {
                      setIsOpeningEditor(false);
                    }
                  }}
                  disabled={isOpeningEditor}
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[12px] shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isOpeningEditor ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Company Info
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-gray-200 rounded-[24px] overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-[25px] font-semibold text-gray-900 mb-2">
                No Company Profile
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first pitch to set up your company profile
              </p>
              <Button
                onClick={() => navigate("/builder")}
                className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[12px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Pitch
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pitch Assets - Merged Output Card */}
        {companyData && (
          <Card className="border-2 border-gray-200 rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[25px] font-bold text-[#252952] mb-1">
                    Pitch Assets
                  </h3>
                  <p className="text-gray-600 text-[16px]">
                    Auto-generated from your company profile
                  </p>
                </div>
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-[#252952] rounded-[12px]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate (Pitch)
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4" id="pitch-assets">
                {/* Pitch Deck */}
                {pitches && pitches.length > 0 && (
                  <div className="p-6 rounded-[16px] border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#252952] transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#252952] to-[#4A90E2] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[20px] font-semibold text-[#252952] mb-1">
                          Pitch Deck
                        </h4>
                        <p className="text-[16px] text-gray-600 mb-3">
                          Professional presentation
                        </p>
                        <div className="flex gap-2">
                          {/* <Button
                            size="sm"
                            className="bg-[#eef0ff] text-[#252952] hover:bg-[#252952] hover:text-white rounded-[8px]"
                            onClick={() => {
                              const pitch = pitches[0];
                              if (pitch) {
                                // Open pitch in a new window/modal
                                const newWindow = window.open();
                                if (newWindow) {
                                  newWindow.document.write(pitch.pitchContent);
                                }
                              }
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button> */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-2 border-gray-200 rounded-[8px]"
                            onClick={() =>
                              pitches[0] && handleDownload(pitches[0])
                            }
                          >
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Landing Page */}
                {firstPitchMeta && (
                  <div className="p-6 rounded-[16px] border-2 border-gray-200 bg-gradient-to-br from-white to-blue-50 hover:border-[#4A90E2] transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#4A90E2] to-[#7DD3FC] flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[20px] font-semibold text-[#252952] mb-1">
                          Live Landing Page
                        </h4>
                        {firstPitchHasPremiumLanding ? (
                          <>
                            <p className="text-[16px] text-gray-600 mb-3">
                              foundify.app/
                              {firstPitchMeta.startupName
                                ?.toLowerCase()
                                .replace(/\s+/g, "-") || "your-company"}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white rounded-[8px]"
                                onClick={openLandingPage}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-2 border-gray-200 rounded-[8px]"
                                onClick={handleCopyUrl}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 mb-3">
                              Generate your landing page
                            </p>
                            <Button
                              size="sm"
                              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white rounded-[8px]"
                              onClick={generateLandingPage}
                              disabled={isGeneratingLanding}
                            >
                              {isGeneratingLanding ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate Landing Page
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Powers All Your Tools */}
        {companyData && (
          <Card className="border-2 border-gray-200 rounded-[20px] bg-gradient-to-br from-[#f8faff] to-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#252952] to-[#4A90E2] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[25px] font-bold text-[#252952] mb-1">
                    Powers All Your Tools
                  </h3>
                  <p className="text-gray-600 text-[16px]">
                    This information automatically powers all your Foundify
                    tools
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: FileText, label: "Pitch Deck", color: "#252952" },
                  { icon: Globe, label: "Landing Page", color: "#4A90E2" },
                  { icon: Mail, label: "Email Templates", color: "#8B5CF6" },
                  { icon: FileCheck, label: "Contracts", color: "#10B981" },
                  { icon: Receipt, label: "Invoices", color: "#F59E0B" },
                  { icon: Users, label: "Team Records", color: "#F43F5E" },
                  { icon: QrCode, label: "QR Card", color: "#14B8A6" },
                  { icon: Sparkles, label: "All Tools", color: "#475569" },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.label}
                      className="flex items-center gap-2 p-3 rounded-[10px] bg-white border border-gray-200"
                    >
                      <div
                        className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${tool.color}15` }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: tool.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#252952] truncate">
                          {tool.label}
                        </div>
                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Original Pitches List Section (Hidden but kept for functionality) */}
      <div className="hidden">
        <h3 className="text-[25px] font-bold text-gray-900 mb-3 md:mb-4">
          Your Pitches
        </h3>

        {loading && (pitches?.length || 0) === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading pitches...</p>
            </div>
          </div>
        ) : (pitches?.length || 0) === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-[25px] font-medium text-gray-900 mb-2">
              No pitches yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first pitch to get started with your startup journey.
            </p>
            <Button
              onClick={() => navigate("/builder")}
              className="bg-[#252952] hover:bg-[#161930]"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Your First Pitch
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pitches?.map((pitch) => (
              <Card
                key={pitch.id}
                className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                    {/* Pitch Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[25px] font-semibold text-gray-900 truncate">
                          {pitch.startupName}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(pitch.createdAt)}
                        </div>
                      </div>
                      {pitch.preview && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {pitch.preview}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(pitch)}
                        className="  border-2 border-gray-200 rounded-xl hover:bg-gray-50 w-full sm:w-auto"
                        disabled={loadingModal.isOpen}
                        size="lg"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <span className="whitespace-nowrap">Download PDF</span>
                      </Button>

                      {pitch.hasLandingPage && (
                        <Button
                          onClick={() => handleViewLanding(pitch)}
                          className="rounded-xl w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          size="lg"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span className="whitespace-nowrap">
                            View Landing Page
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={loadMorePitches}
              disabled={loading}
              variant="outline"
              className="border-2 border-gray-200 rounded-xl hover:bg-gray-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Load More Pitches
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Edit Modal with 4 Steps */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl h-auto max-h-[90vh] rounded-[32px] p-0 flex flex-col">
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-[50px] font-bold text-[#252952] flex items-center gap-3">
                <Edit className="w-7 h-7" />
                Edit Company Info
              </DialogTitle>
              <DialogDescription className="text-[16px]">
                Update your company information — changes apply everywhere
                automatically
              </DialogDescription>
            </DialogHeader>

            {/* Step tabs */}
            <div className="flex gap-2 mt-6">
              {editSteps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setEditStep(index)}
                    className={`flex-1 p-3 rounded-[12px] border-2 transition-all ${
                      editStep === index
                        ? "border-[#252952] bg-[#f8faff]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <StepIcon
                        className={`w-4 h-4 ${
                          editStep === index
                            ? "text-[#252952]"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          editStep === index
                            ? "text-[#252952]"
                            : "text-gray-600"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* Step 1: Company Basics */}
            {editStep === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952]">
                    Company / Startup Name *
                  </Label>
                  <Input
                    value={editedData.companyName}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        companyName: e.target.value,
                      })
                    }
                    className="h-14 text-lg border-2 border-gray-200 rounded-[12px] focus:border-[#252952]"
                    autoComplete="off"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952]">
                    What does your company do? *
                  </Label>
                  <Textarea
                    value={editedData.oneLiner}
                    onChange={(e) =>
                      setEditedData({ ...editedData, oneLiner: e.target.value })
                    }
                    className="min-h-[100px] text-base border-2 border-gray-200 rounded-[12px] resize-none focus:border-[#252952]"
                    autoComplete="off"
                    placeholder="One clear sentence that explains your company"
                  />
                  <p className="text-sm text-gray-500">
                    Keep it simple and clear — this appears everywhere
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952]">
                    Industry
                  </Label>
                  <Select
                    value={editedData.industry}
                    onValueChange={(value) =>
                      setEditedData({ ...editedData, industry: value })
                    }
                  >
                    <SelectTrigger className="h-14 text-base border-2 border-gray-200 rounded-[12px]">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Problem & Value */}
            {editStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952]">
                    What problem do you solve? *
                  </Label>
                  <Textarea
                    value={editedData.problem}
                    onChange={(e) =>
                      setEditedData({ ...editedData, problem: e.target.value })
                    }
                    className="min-h-[140px] text-base border-2 border-gray-200 rounded-[12px] resize-none focus:border-[#252952]"
                    autoComplete="off"
                    placeholder="Describe the problem your company addresses..."
                  />
                  <p className="text-sm text-gray-500">
                    Write it as if you're explaining to a smart friend
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952]">
                    How do you solve it? *
                  </Label>
                  <Textarea
                    value={editedData.value}
                    onChange={(e) =>
                      setEditedData({ ...editedData, value: e.target.value })
                    }
                    className="min-h-[140px] text-base border-2 border-gray-200 rounded-[12px] resize-none focus:border-[#252952]"
                    autoComplete="off"
                    placeholder="Explain the value you create and how you help..."
                  />
                  <p className="text-sm text-gray-500">
                    Focus on benefits and outcomes you deliver
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Credibility */}
            {editStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952] flex items-center gap-2">
                    Traction
                    <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                      Optional
                    </Badge>
                  </Label>
                  <Input
                    value={editedData.status}
                    onChange={(e) =>
                      setEditedData({ ...editedData, status: e.target.value })
                    }
                    className="h-14 text-base border-2 border-gray-200 rounded-[12px] focus:border-[#252952]"
                    autoComplete="off"
                    placeholder='e.g., "$50K MRR", "500+ customers", "Early stage"'
                  />
                  <p className="text-sm text-gray-500">
                    Share your current metrics or stage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#252952]">
                    Team Size
                  </Label>
                  <Select
                    value={editedData.teamSize}
                    onValueChange={(value) =>
                      setEditedData({ ...editedData, teamSize: value })
                    }
                  >
                    <SelectTrigger className="h-14 text-base border-2 border-gray-200 rounded-[12px]">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Brand */}
            {editStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-[#252952]">
                    Upload Logo
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-[16px] p-12 text-center hover:border-[#4A90E2] transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-base text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">SVG, PNG (max. 2MB)</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                      or
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-[#252952]">
                    Choose Brand Color
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {BRAND_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setEditedData({
                            ...editedData,
                            brandColor: color.value,
                          })
                        }
                        className={`relative h-24 rounded-[16px] transition-all hover:scale-105 ${
                          editedData.brandColor === color.value
                            ? "ring-4 ring-[#252952] ring-offset-2"
                            : "ring-2 ring-gray-200 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {editedData.brandColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center">
                              <Check className="w-6 h-6 text-[#252952]" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Selected:{" "}
                    <span className="font-semibold text-[#252952]">
                      {
                        BRAND_COLORS.find(
                          (c) => c.value === editedData.brandColor
                        )?.name
                      }
                    </span>
                  </p>
                </div>

                {/* Preview */}
                <div className="mt-8 p-6 rounded-[16px] bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
                  <h4 className="text-sm font-semibold text-[#252952] mb-4">
                    Preview
                  </h4>
                  <div className="space-y-3">
                    <div
                      className="h-14 rounded-[12px] flex items-center justify-center font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                      style={{ backgroundColor: editedData.brandColor }}
                    >
                      Primary Button
                    </div>
                    <div
                      className="h-24 rounded-[16px] p-4 border-2 transition-all"
                      style={{
                        backgroundColor: `${editedData.brandColor}10`,
                        borderColor: `${editedData.brandColor}40`,
                      }}
                    >
                      <div className="text-xs font-semibold text-gray-500 mb-2">
                        Company Card
                      </div>
                      <div
                        className="font-bold text-lg"
                        style={{ color: editedData.brandColor }}
                      >
                        {editedData.companyName || "Your Company"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-white border-t border-gray-200 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  editStep > 0 ? setEditStep(editStep - 1) : handleCancelEdit()
                }
                className="border-2 border-gray-200 hover:border-gray-300 rounded-[12px] px-6"
              >
                {editStep === 0 ? "Cancel" : "Back"}
              </Button>

              <div className="flex items-center gap-2">
                {editSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === editStep
                        ? "w-8 bg-[#252952]"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={() => {
                  if (editStep < editSteps.length - 1) {
                    setEditStep(editStep + 1);
                  } else {
                    handleSaveEdit();
                  }
                }}
                className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[12px] shadow-lg px-8"
              >
                {editStep === editSteps.length - 1 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Landing Page Generator - Hidden */}
      <div className="hidden mt-8">
        <h3 className="text-[25px] font-bold text-gray-900 mb-4">
          Landing Page Generator
        </h3>
        <Card className="border-2 border-gray-100">
          <CardHeader>
            <CardTitle className="text-[25px] font-bold">
              Upload Your Logo (Optional)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Upload an SVG logo to include in your premium landing page. You
              can also skip this step.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {isFetchingFirstPitch ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            ) : !firstPitchMeta ? (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Create your first pitch to generate a premium landing page.
                </p>
                <Button
                  onClick={() => navigate("/builder")}
                  className="bg-[#252952] hover:bg-[#161930]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Your First Pitch
                </Button>
              </div>
            ) : (
              <>
                {/* File Upload Area */}
                <div
                  className={`w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    firstPitchHasPremiumLanding
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <label
                    htmlFor="logo-upload"
                    className={`block ${
                      firstPitchHasPremiumLanding
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <Upload
                      className={`mx-auto h-12 w-12 mb-3 ${
                        firstPitchHasPremiumLanding
                          ? "text-gray-300"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm mb-2 ${
                        firstPitchHasPremiumLanding
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {firstPitchHasPremiumLanding
                        ? "Upload disabled - Landing page already exists"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p
                      className={`text-xs ${
                        firstPitchHasPremiumLanding
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      SVG files only
                    </p>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept=".svg,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={
                        isGeneratingLanding || firstPitchHasPremiumLanding
                      }
                    />
                  </label>
                </div>

                {/* Show uploaded file */}
                {logoFileName && (
                  <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-700">
                        {logoFileName}
                      </span>
                    </div>
                    <button
                      onClick={clearLogo}
                      className="text-gray-500 hover:text-red-500"
                      disabled={
                        isGeneratingLanding || firstPitchHasPremiumLanding
                      }
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
                <div className="flex justify-center gap-3 pt-4">
                  {firstPitchHasPremiumLanding ? (
                    <Button
                      className="px-6 bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110"
                      onClick={openLandingPage}
                    >
                      View Landing Page
                    </Button>
                  ) : (
                    <Button
                      className="px-6 bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] cursor-pointer hover:from-premium-purple-dark hover:to-deep-blue-dark text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      onClick={generateLandingPage}
                      disabled={isGeneratingLanding || !firstPitchMeta}
                    >
                      {isGeneratingLanding ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Premium Landing Page"
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Premium Status */}
      {/* {isPremium && (
        <Card className="mt-6 md:mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                  <h3 className="text-[25px] font-bold text-gray-900">
                    Premium Active
                  </h3>
                  <Badge className="bg-green-500 text-white hover:bg-green-600 text-xs">
                    ✓ Premium
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  You have full access to all premium features, AI assistance,
                  and founder tools
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      <LoadingModal
        isOpen={loadingModal.isOpen}
        type={loadingModal.type}
        progress={progress}
      />
      <LoadingModal
        isOpen={showLandingLoading}
        type="landing"
        progress={landingProgress}
      />
    </div>
  );
}
