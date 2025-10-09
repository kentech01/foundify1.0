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
  FileText,
  Globe,
  Download,
  Eye,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { LoadingModal } from "../components/LoadingModal";
import { toast } from "sonner";
import React from "react";

interface Pitch {
  id: string;
  name: string;
  createdAt: string;
  views: number;
  status: "draft" | "published";
  hasLanding: boolean;
  hasPDF: boolean;
}

interface DashboardProps {
  onCreateNew: () => void;
  onUpgrade: () => void;
  initialPitch?: Pitch;
  isPremium?: boolean;
}

export function Dashboard({
  onCreateNew,
  onUpgrade,
  initialPitch,
  isPremium = false,
}: DashboardProps) {
  const [pitches, setPitches] = useState<Pitch[]>(
    initialPitch ? [initialPitch] : []
  );
  const [loadingModal, setLoadingModal] = useState<{
    isOpen: boolean;
    type: "pdf" | "landing" | "generating";
  }>({
    isOpen: false,
    type: "generating",
  });
  const [progress, setProgress] = useState(0);

  const handleGeneratePDF = async (pitchId: string) => {
    setLoadingModal({ isOpen: true, type: "pdf" });
    setProgress(0);

    // Simulate PDF generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoadingModal({ isOpen: false, type: "pdf" });
            // Update pitch to mark PDF as generated
            setPitches(
              pitches.map((p) =>
                p.id === pitchId ? { ...p, hasPDF: true } : p
              )
            );
            toast.success("PDF Generated!", {
              description: "Your pitch deck PDF is ready to download.",
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleGenerateLanding = async (pitchId: string) => {
    setLoadingModal({ isOpen: true, type: "landing" });
    setProgress(0);

    // Simulate landing page generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoadingModal({ isOpen: false, type: "landing" });
            // Update pitch to mark landing as generated
            setPitches(
              pitches.map((p) =>
                p.id === pitchId
                  ? { ...p, hasLanding: true, status: "published" }
                  : p
              )
            );
            toast.success("Landing Page Live!", {
              description: "Your landing page has been published successfully.",
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Foundify</h1>
                  {isPremium && (
                    <Badge className="bg-gradient-to-r from-premium-purple to-deep-blue text-white hover:from-premium-purple-dark hover:to-deep-blue-dark">
                      ✨ Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">Pitch Dashboard</p>
              </div>
            </div>
            <Button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Pitch
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pitches</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pitches.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-premium-purple-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-premium-purple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pitches.reduce((sum, p) => sum + p.views, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-deep-blue-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-deep-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Published</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pitches.filter((p) => p.status === "published").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pitches List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Pitches</h2>
          </div>

          {pitches.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No pitches yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first pitch to get started
                </p>
                <Button
                  onClick={onCreateNew}
                  className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Pitch
                </Button>
              </CardContent>
            </Card>
          ) : (
            pitches.map((pitch) => (
              <Card
                key={pitch.id}
                className="border-2 border-gray-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Pitch Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {pitch.name}
                        </h3>
                        <Badge
                          variant={
                            pitch.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {pitch.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pitch.createdAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {pitch.views} views
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleGeneratePDF(pitch.id)}
                        className="border-2 rounded-xl"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {pitch.hasPDF ? "Download PDF" : "Generate PDF"}
                      </Button>
                      <Button
                        onClick={() => handleGenerateLanding(pitch.id)}
                        className={`rounded-xl ${
                          isPremium
                            ? "bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!isPremium}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        {pitch.hasLanding ? "View Landing" : "Create Landing"}
                        {!isPremium && (
                          <Badge className="ml-2 bg-premium-purple text-white text-xs">
                            Premium
                          </Badge>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Upgrade CTA or Premium Badge */}
        {!isPremium ? (
          <Card className="mt-8 border-2 border-premium-purple bg-gradient-to-br from-premium-purple-50 to-white">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-premium-purple flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Upgrade to Premium
                    </h3>
                    <p className="text-gray-600">
                      Get hosted landing pages, analytics, AI assistance, and
                      all essential founder tools for just $10/month
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onUpgrade}
                  className="bg-premium-purple hover:bg-premium-purple-dark text-white rounded-xl whitespace-nowrap"
                >
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Premium Active
                    </h3>
                    <Badge className="bg-green-500 text-white hover:bg-green-600">
                      ✓ Premium
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    You have full access to all premium features, AI assistance,
                    and founder tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <LoadingModal
        isOpen={loadingModal.isOpen}
        type={loadingModal.type}
        progress={progress}
      />
    </div>
  );
}
