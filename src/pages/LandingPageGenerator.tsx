import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Upload, X, FileCheck, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useApiService } from "../services/api";
import { LoadingModal } from "../components/LoadingModal";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import React from "react";

export function LandingPageGenerator() {
  const navigate = useNavigate();
  const apiService = useApiService();
  const { pitches } = useApp();

  // First pitch meta and premium landing status
  const [firstPitchMeta, setFirstPitchMeta] = useState<any>(null);
  const [firstPitchHasPremiumLanding, setFirstPitchHasPremiumLanding] =
    useState(false);
  const [isFetchingFirstPitch, setIsFetchingFirstPitch] = useState(false);

  // Logo upload states
  const [logoSvgContent, setLogoSvgContent] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLandingLoading, setShowLandingLoading] = useState(false);
  const [landingProgress, setLandingProgress] = useState(0);

  // Fetch first pitch on mount
  useEffect(() => {
    (async () => {
      try {
        setIsFetchingFirstPitch(true);
        const fp = await apiService.getFirstPitch();
        if (fp) {
          setFirstPitchMeta(fp);
          setFirstPitchHasPremiumLanding(!!fp.hasLandingPagePremium);
        } else {
          toast.error("No first pitch found", {
            description:
              "Please create your first pitch to generate a premium landing page.",
          });
          navigate("/dashboard/pitches");
        }
      } catch (_e) {
        toast.error("Failed to load pitch data");
        navigate("/dashboard/pitches");
      } finally {
        setIsFetchingFirstPitch(false);
      }
    })();
  }, []);

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

  // Generate landing page
  const generateLandingPage = async () => {
    if (!firstPitchMeta) {
      toast.error("No pitch data available");
      return;
    }

    let progressInterval: number | undefined;

    try {
      setIsGenerating(true);
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
      setIsGenerating(false);
    }
  };

  // Show loading while fetching first pitch
  if (isFetchingFirstPitch) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingModal
        isOpen={showLandingLoading}
        type="landing"
        progress={landingProgress}
      />

      <div className="p-8">
        {/* Header: Back + Title */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div>
            <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">
              Landing Page Generator
            </h2>
            <p className="text-gray-600">
              Upload your logo and generate a premium landing page
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Upload Your Logo (Optional)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Upload an SVG logo to include in your landing page. You can also
                skip this step.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
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
                    disabled={isGenerating}
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
                    disabled={isGenerating}
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
                    className="px-6 bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] hover:to-deep-blue-dark text-white"
                    onClick={openLandingPage}
                  >
                    View Landing Page
                  </Button>
                ) : (
                  <Button
                    className="flex-1 bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white"
                    onClick={generateLandingPage}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate with Logo"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
