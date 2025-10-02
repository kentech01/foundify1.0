import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
} from "lucide-react";
import { LoadingModal } from "../components/LoadingModal";
import { toast } from "sonner@2.0.3";
import { useApiService } from "../services/api";
import type { PitchHistoryItem, PitchHistoryResponse } from "../services/api";
import html2pdf from "html2pdf.js";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../atoms/userAtom";
import { pitchesAtom } from "../atoms/pitchesAtom";
import { useNavigate } from "react-router-dom";

interface PitchDashboardProps {
  initialPitch?: any;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function PitchDashboard({
  initialPitch,
  isPremium,
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

  const handleGenerateLanding = async (pitchId: string) => {
    // Find the first pitch to ensure we only generate for the first pitch
    const firstPitch = pitches?.find((pitch) => pitch.isFirstPitch);

    if (!firstPitch) {
      toast.error("No first pitch found", {
        description:
          "Please create your first pitch to generate a landing page.",
      });
      return;
    }

    if (firstPitch.id !== pitchId) {
      toast.error("Landing page generation restricted", {
        description:
          "You can only generate a basic landing page for your first pitch.",
      });
      return;
    }

    setLoadingModal({ isOpen: true, type: "landing" });
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the actual API to generate landing page with basic plan
      const response = await apiService.generateLandingPage(pitchId, "basic");

      clearInterval(interval);
      setProgress(100);

      // Update the pitch in state with the new landing page
      setPitches(
        (prev) =>
          prev?.map((pitch) =>
            pitch.id === pitchId
              ? {
                  ...pitch,
                  landingPage: response.data.landingPage,
                  hasLandingPage: true,
                  status: "published",
                }
              : pitch
          ) || []
      );

      setTimeout(() => {
        setLoadingModal({ isOpen: false, type: "landing" });
        toast.success("Basic Landing Page Generated!", {
          description: "Your basic landing page has been created successfully.",
        });
      }, 500);
    } catch (error: any) {
      setLoadingModal({ isOpen: false, type: "landing" });
      toast.error("Failed to generate landing page", {
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

  const handleViewLandingPage = (pitch: PitchHistoryItem) => {
    navigate(`/${pitch.startupName}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fix: Add null checks for all pitches usage
  const totalViews =
    pitches?.reduce((sum, pitch) => sum + (pitch.views || 0), 0) || 0;

  const publishedCount =
    pitches?.filter((pitch) => pitch.status === "published").length || 0;

  return (
    <div className="p-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pitches</p>
                <p className="text-4xl font-bold text-gray-900">
                  {pitches?.length || 0}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-premium-purple-50 flex items-center justify-center">
                <FileText className="h-7 w-7 text-premium-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-4xl font-bold text-gray-900">{totalViews}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-deep-blue-50 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-deep-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                {/* <p className="text-sm text-gray-600 mb-1">Published</p> */}
                <p className="text-4xl font-bold text-gray-900">
                  {publishedCount}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <Globe className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pitches List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Pitches</h3>

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
              className="bg-blue-600 hover:bg-blue-700"
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
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Pitch Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {pitch.startupName}
                        </h3>
                        <Badge
                          variant={
                            pitch.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            pitch.status === "published"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {pitch.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(pitch.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {pitch.views || 0} views
                        </div>
                      </div>
                      {pitch.preview && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {pitch.preview}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(pitch)}
                        className="border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                        disabled={loadingModal.isOpen}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>

                      {pitch.hasLandingPagePremium ? (
                        <>
                          <Button
                            onClick={() => handleViewLandingPage(pitch)}
                            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Landing Page
                          </Button>
                          <Button
                            onClick={() => handleViewLanding(pitch)}
                            className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Download Landing
                          </Button>
                        </>
                      ) : pitch.landingPage ? (
                        <Button
                          onClick={() => handleViewLanding(pitch)}
                          className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Download Landing
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleGenerateLanding(pitch.id)}
                          className="rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white"
                          disabled={loadingModal.isOpen}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Create Landing
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

      {/* Premium Status */}
      {isPremium && (
        <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    Premium Active
                  </h3>
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    ✓ Premium
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
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
    </div>
  );
}
