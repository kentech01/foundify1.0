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
import {
  FileText,
  Globe,
  Download,
  Rocket,
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
  userName: string | null;
  onUpgrade: () => void;
}

export function PitchDashboard({
  initialPitch,
  isPremium,
  onCreatePitch,
  onUpgrade,
  userName,
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

  const handleDownload = (pitch: PitchHistoryItem) => {
    try {
      const container = document.createElement("div");
      container.innerHTML = pitch.pitchContent;

      const opt = {
        margin: 0.5,
        filename: `${pitch.startupName}_Pitch.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(opt).from(container).save();

      toast.success("PDF Downloaded!", {
        description: "Your pitch deck PDF has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Failed to download PDF:", error);
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

  return (
    <div className="p-8">
      <div className="flex justify-between gap-3 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-[#252952] figtree ">
            Hi, {userName?.split(" ")[0]}
          </h2>
          <p className="text-[16px] text-[#252952] font-medium mt-3 figtree">
            Ready to start your new pitch?
          </p>
        </div>

        <Button
          onClick={onCreatePitch}
          disabled={(pitches?.length || 0) > 0}
          className="bg-[#EEF0FF]  text-[#252952] rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg disabled:hover:brightness-100"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Pitch
        </Button>
      </div>

      {/* Pitches List */}
      <div className="mt-20">
        <h3 className="text-xl figtree md:text-xl font-semibold text-[#252952] mb-3 md:mb-4 flex gap-2">
          <Rocket />
          My Pitches
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
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
                <CardContent className="p-4 md:p-6 bg-[#EEF0FF]">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 md:gap-6 ">
                    {/* Pitch Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-medium text-[#252952] truncate figtree tracking-[0.002em]">
                          {pitch.startupName}
                        </h3>
                      </div>

                      {pitch.preview && (
                        <p className="text-[16px] figtree font-normal text-[#252952] mt-2 tracking-[0.002em] line-clamp-2">
                          {pitch.preview}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(pitch.createdAt)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(pitch)}
                        className=" hover:bg-gray-50 w-full sm:w-auto bg-transparent border-0 text-5xl"
                        disabled={loadingModal.isOpen}
                        size="lg"
                      >
                        <Download className="!w-[25px] !h-[25px] text-[#252952" />
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

      {/* Landing Page Generator */}
      <div className="mt-12">
        <h3 className="text-2xl md:text-xl font-semibold text-[#252952] mb-4">
          Landing Page Generator
        </h3>
        <Card className="border-2 border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-[#252952]">
              Upload Your Logo (Optional)
            </CardTitle>
            <p className="text-sm text-[#8E8E8E] font-medium">
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
                      className="w-[250px] pt-[16px] pb-[16px] h-[48px] text-lg bg-[#252952] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110 tracking-[0.002em]"
                      onClick={openLandingPage}
                    >
                      View Landing Page
                    </Button>
                  ) : (
                    <Button
                      className="w-[250px] pt-[16px] pb-[16px] h-[48px] text-lg bg-[#252952] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110 tracking-[0.002em]"
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
      {isPremium && (
        <Card className="mt-6 md:mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                  <h3 className="text-base md:text-lg font-bold text-gray-900">
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
      )}

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
