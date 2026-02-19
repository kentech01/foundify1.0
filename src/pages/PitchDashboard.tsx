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
import { Combobox } from "../components/ui/combobox";
import { INDUSTRIES } from "../constants/industries";
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
  FileDown,
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
  Building2,
  Target,
  Palette,
  Edit,
  Zap,
  CheckCircle2,
  Mail,
  Receipt,
  Users,
  QrCode,
  Copy,
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
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [showLogoLoading, setShowLogoLoading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);

  // Company profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editStep, setEditStep] = useState(0);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
  const [editLogoError, setEditLogoError] = useState<string>("");
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [generatedLogoSvg, setGeneratedLogoSvg] = useState<string | null>(null);
  const [logoPreviewModal, setLogoPreviewModal] = useState<{
    isOpen: boolean;
    logo: string | null;
    isSvg: boolean;
  }>({
    isOpen: false,
    logo: null,
    isSvg: false,
  });

  // Use comprehensive industries list from constants

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

  // Company data state - initialized from firstPitchMeta but can be updated independently
  const [companyData, setCompanyData] = useState<{
    companyName: string;
    industry: string;
    oneLiner: string;
    problem: string;
    value: string;
    status: string;
    brandColor: string;
    teamSize: string;
    logo: string | null;
  } | null>(null);

  // Initialize companyData from firstPitchMeta when it's available,
  // but never wipe out an already-loaded logo.
  useEffect(() => {
    if (firstPitchMeta) {
      const rawLogo = (firstPitchMeta as any).logo;
      const computedLogo =
        rawLogo && (rawLogo.startsWith("<svg") || rawLogo.includes("<svg"))
          ? processSvgLogo(rawLogo)
          : rawLogo || null;

      setCompanyData((prev) => ({
        companyName: firstPitchMeta.startupName || prev?.companyName || "",
        industry: firstPitchMeta.industry || prev?.industry || "",
        oneLiner: firstPitchMeta.preview || prev?.oneLiner || "",
        problem: prev?.problem || "",
        value: prev?.value || "",
        status: prev?.status || "",
        brandColor: prev?.brandColor || "#252952",
        teamSize: prev?.teamSize || "",
        // Prefer an existing logo if the meta object doesn't contain one
        logo: computedLogo ?? prev?.logo ?? null,
      }));

      // Update firstPitchMeta with logoGenerated if available
      if ((firstPitchMeta as any).logoGenerated !== undefined) {
        setFirstPitchMeta((prev: any) => ({
          ...prev,
          logoGenerated: (firstPitchMeta as any).logoGenerated || false,
        }));
      }
    }
  }, [firstPitchMeta?.id, firstPitchMeta?.startupName]); // Only update when pitch ID or name changes

  // On initial dashboard load, fetch full pitch details (including SVG logo)
  // so the avatar can render the latest logo from the backend.
  useEffect(() => {
    const fetchInitialPitchDetails = async () => {
      if (!firstPitchMeta?.id) return;

      try {
        const details = await apiService.getPitchDetails(firstPitchMeta.id);
        if (!details?.data) return;

        const pitch = details.data;
        const backendLogo =
          pitch.logo &&
          (pitch.logo.startsWith("<svg") || pitch.logo.includes("<svg"))
            ? processSvgLogo(pitch.logo)
            : pitch.logo || null;

        setCompanyData((prev) => ({
          companyName:
            pitch.startupName ||
            firstPitchMeta.startupName ||
            prev?.companyName ||
            "",
          industry:
            pitch.industry || firstPitchMeta.industry || prev?.industry || "",
          oneLiner:
            pitch.targetAudience ||
            firstPitchMeta.preview ||
            prev?.oneLiner ||
            "",
          problem: pitch.problemSolved || prev?.problem || "",
          value:
            pitch.mainProduct || pitch.uniqueSellingPoint || prev?.value || "",
          status: pitch.traction || prev?.status || "",
          brandColor: pitch.primaryColor || prev?.brandColor || "#252952",
          teamSize: pitch.teamSize || prev?.teamSize || "",
          logo: backendLogo ?? prev?.logo ?? null,
        }));

        // Update firstPitchMeta with logoGenerated status
        setFirstPitchMeta((prev: any) => ({
          ...prev,
          logoGenerated: (pitch as any).logoGenerated || false,
        }));
      } catch (error) {
        console.error("Failed to load initial pitch details:", error);
      }
    };

    fetchInitialPitchDetails();
    // We intentionally do NOT include companyData in deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPitchMeta?.id]);

  const [industryOptions, setIndustryOptions] = useState<string[]>(INDUSTRIES);

  const [isOpeningEditor, setIsOpeningEditor] = useState(false);
  const [regenCount, setRegenCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isStepSaving, setIsStepSaving] = useState(false);

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
      logo: null,
    },
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

  // When arriving with ?openLogo=1 (e.g. from Hero's Generate Logo), open Edit Company Info at Brand step
  useEffect(() => {
    if (searchParams.get("openLogo") === "1") {
      setEditStep(3);
      setIsEditing(true);
      searchParams.delete("openLogo");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Helper to check if company data has unsaved changes
  const hasCompanyChanges = () => {
    if (!companyData) return false;

    const fields: (keyof typeof companyData)[] = [
      "companyName",
      "industry",
      "oneLiner",
      "problem",
      "value",
      "status",
      "teamSize",
      "brandColor",
      "logo",
    ];

    for (const field of fields) {
      if (editedData[field] !== companyData[field]) {
        return true;
      }
    }

    // Also treat upload/generated logo state as a change
    if (editLogoFile || generatedLogoSvg) {
      return true;
    }

    return false;
  };

  // Lightweight auto-save used when moving between steps/tabs
  const saveCompanyDraft = async () => {
    if (!firstPitchMeta?.id) return;
    if (!hasCompanyChanges()) return;

    try {
      setIsStepSaving(true);
      // Convert logo file or generated SVG if present
      let logoData = editedData.logo;
      if (editLogoFile && editLogoPreview) {
        logoData = editLogoPreview;
      } else if (generatedLogoSvg) {
        logoData = generatedLogoSvg;
      }

      // If user uploaded a logo (not generated), only clear logoGenerated
      // if it has never been set before. Once a logo has been generated
      // for this pitch, that flag stays true for lifetime.
      const isUploadedLogo = Boolean(editLogoFile && editLogoPreview);
      const logoGenerated = generatedLogoSvg
        ? true
        : !firstPitchMeta?.logoGenerated && isUploadedLogo
          ? false
          : undefined; // don't change when already true

      await apiService.updatePitchCompany(firstPitchMeta.id, {
        companyName: editedData.companyName,
        industry: editedData.industry,
        oneLiner: editedData.oneLiner,
        problem: editedData.problem,
        value: editedData.value,
        status: editedData.status,
        teamSize: editedData.teamSize,
        brandColor: editedData.brandColor,
        logo: logoData,
        logoGenerated: logoGenerated,
      });

      // Update local companyData so UI stays in sync
      setCompanyData((prev) => {
        if (!prev) {
          return {
            companyName: editedData.companyName,
            industry: editedData.industry,
            oneLiner: editedData.oneLiner,
            problem: editedData.problem,
            value: editedData.value,
            status: editedData.status,
            brandColor: editedData.brandColor,
            teamSize: editedData.teamSize,
            logo: logoData || null,
          };
        }

        return {
          ...prev,
          companyName: editedData.companyName,
          industry: editedData.industry,
          oneLiner: editedData.oneLiner,
          problem: editedData.problem,
          value: editedData.value,
          status: editedData.status,
          brandColor: editedData.brandColor,
          teamSize: editedData.teamSize,
          logo: logoData || prev.logo,
        };
      });
    } catch (error) {
      console.error("Failed to auto-save company profile:", error);
      // Silent fail for autosave; main save still shows toasts
    } finally {
      setIsStepSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!firstPitchMeta?.id) {
      setIsEditing(false);
      setEditStep(0);
      return;
    }

    setIsSaving(true);
    try {
      // Convert logo file to base64 if a new file was uploaded
      // Or use generated SVG if one was generated
      let logoData = editedData.logo;
      if (editLogoFile && editLogoPreview) {
        // If it's a data URL, extract the base64 part
        if (editLogoPreview.startsWith("data:")) {
          logoData = editLogoPreview;
        } else {
          logoData = editLogoPreview;
        }
      } else if (generatedLogoSvg) {
        // Use generated SVG if available
        logoData = generatedLogoSvg;
      }

      // If user uploaded a logo (not generated), only clear logoGenerated
      // if it has never been set before. Once a logo has been generated,
      // the flag should remain true even if the user uploads a new logo.
      const isUploadedLogo = Boolean(editLogoFile && editLogoPreview);
      const logoGenerated = generatedLogoSvg
        ? true
        : !firstPitchMeta?.logoGenerated && isUploadedLogo
          ? false
          : undefined;

      await apiService.updatePitchCompany(firstPitchMeta.id, {
        companyName: editedData.companyName,
        industry: editedData.industry,
        oneLiner: editedData.oneLiner,
        problem: editedData.problem,
        value: editedData.value,
        status: editedData.status,
        teamSize: editedData.teamSize,
        brandColor: editedData.brandColor,
        logo: logoData,
        logoGenerated: logoGenerated,
      });

      // Get updated pitch details
      const updatedPitch = await apiService.getPitchDetails(firstPitchMeta.id);

      // Update companyData immediately with the new data
      if (updatedPitch?.data) {
        const logo = updatedPitch.data.logo
          ? updatedPitch.data.logo.startsWith("<svg") ||
            updatedPitch.data.logo.includes("<svg")
            ? processSvgLogo(updatedPitch.data.logo)
            : updatedPitch.data.logo
          : null;

        setCompanyData({
          companyName: updatedPitch.data.startupName || "",
          industry: updatedPitch.data.industry || "",
          oneLiner: updatedPitch.data.targetAudience || "",
          problem: updatedPitch.data.problemSolved || "",
          value:
            updatedPitch.data.mainProduct ||
            updatedPitch.data.uniqueSellingPoint ||
            "",
          status: updatedPitch.data.traction || "",
          brandColor: updatedPitch.data.primaryColor || "#252952",
          teamSize: updatedPitch.data.teamSize || "",
          logo: logo,
        });

        // Update firstPitchMeta with the new data
        if (firstPitchMeta) {
          setFirstPitchMeta({
            ...firstPitchMeta,
            startupName: updatedPitch.data.startupName,
            industry: updatedPitch.data.industry,
            preview: updatedPitch.data.targetAudience || firstPitchMeta.preview,
            logo: updatedPitch.data.logo || null,
            logoGenerated: updatedPitch.data.logoGenerated || false,
          } as any);
        }
      }

      // Also refresh the pitches list to update the pitch card
      await loadPitches(1);

      // Clear edit logo state after successful save
      setEditLogoFile(null);
      setEditLogoPreview(null);
      setGeneratedLogoSvg(null);
      setIsEditing(false);
      setEditStep(0);

      toast.success("Company profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update company profile:", error);
      toast.error("Failed to update company profile", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSaving(false);
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
        logo: null,
      },
    );
    setEditLogoFile(null);
    setEditLogoPreview(null);
    setEditLogoError("");
    setGeneratedLogoSvg(null);
    setIsGeneratingLogo(false);
    setIsEditing(false);
    setEditStep(0);
  };

  // Handle logo upload in edit modal
  const handleEditLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - only accept SVG files
    const isValidSvgType = file.type === "image/svg+xml";
    const isValidSvgExtension = file.name.toLowerCase().endsWith(".svg");

    if (!isValidSvgType && !isValidSvgExtension) {
      setEditLogoError("Please upload SVG files only");
      setEditLogoFile(null);
      setEditLogoPreview(null);
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setEditLogoError("File size must be less than 2MB");
      setEditLogoFile(null);
      setEditLogoPreview(null);
      return;
    }

    setEditLogoError("");
    setEditLogoFile(file);
    // When user chooses to upload, treat upload as the single source of truth
    // and clear any previously generated logo
    setGeneratedLogoSvg(null);
    setIsGeneratingLogo(false);

    // Reset logoGenerated flag when uploading (uploads don't count as generated)
    // This will be saved when the user saves the form

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEditLogoPreview(content);

      // Extract colors from the uploaded SVG
      const extractedColors = extractColorsFromSVG(content);
      const newBrandColor =
        extractedColors?.primaryColor || editedData.brandColor || "#252952";

      // Keep editedData.logo in sync with the uploaded logo preview and update brand color
      setEditedData((prev) => ({
        ...prev,
        logo: content,
        brandColor: newBrandColor,
      }));
    };
    reader.onerror = () => {
      setEditLogoError("Failed to read file");
      setEditLogoFile(null);
      setEditLogoPreview(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type - only accept SVG files
    const isValidSvgType = file.type === "image/svg+xml";
    const isValidSvgExtension = file.name.toLowerCase().endsWith(".svg");

    if (!isValidSvgType && !isValidSvgExtension) {
      setEditLogoError("Please upload SVG files only");
      setEditLogoFile(null);
      setEditLogoPreview(null);
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setEditLogoError("File size must be less than 2MB");
      setEditLogoFile(null);
      setEditLogoPreview(null);
      return;
    }

    setEditLogoError("");
    setEditLogoFile(file);
    // Upload replaces any previously generated logo
    setGeneratedLogoSvg(null);
    setIsGeneratingLogo(false);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEditLogoPreview(content);

      // Extract colors from the uploaded SVG
      const extractedColors = extractColorsFromSVG(content);
      const newBrandColor =
        extractedColors?.primaryColor || editedData.brandColor || "#252952";

      setEditedData((prev) => ({
        ...prev,
        logo: content,
        brandColor: newBrandColor,
      }));
    };
    reader.onerror = () => {
      setEditLogoError("Failed to read file");
      setEditLogoFile(null);
      setEditLogoPreview(null);
    };
    reader.readAsDataURL(file);
  };

  const clearEditLogo = () => {
    setEditLogoFile(null);
    setEditLogoPreview(null);
    setEditLogoError("");
    // Do not touch generatedLogoSvg here – this only clears the uploaded version
  };

  // Download logo function
  const downloadLogo = (logo: string, isSvg: boolean, filename: string) => {
    try {
      if (isSvg) {
        // Download as SVG file
        const blob = new Blob([logo], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Logo downloaded successfully!");
      } else {
        // Download as image (for uploaded images)
        const link = document.createElement("a");
        link.href = logo;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Logo downloaded successfully!");
      }
    } catch (error) {
      console.error("Failed to download logo:", error);
      toast.error("Failed to download logo");
    }
  };

  // Process SVG to remove black backgrounds
  // Extract colors from SVG (handles raw SVG and data URLs including base64)
  const extractColorsFromSVG = (
    logoOrSvg: string,
  ): { primaryColor: string; secondaryColor: string } | null => {
    if (!logoOrSvg || typeof logoOrSvg !== "string") {
      return null;
    }

    // Resolve SVG content from raw SVG or data URL (base64 or unencoded)
    let svgString = logoOrSvg;
    if (
      !logoOrSvg.includes("<svg") &&
      logoOrSvg.startsWith("data:image/svg+xml")
    ) {
      const commaIdx = logoOrSvg.indexOf(",");
      if (commaIdx === -1) return null;
      const payload = logoOrSvg.slice(commaIdx + 1);
      try {
        svgString = logoOrSvg.includes("base64")
          ? decodeURIComponent(escape(atob(payload)))
          : decodeURIComponent(payload);
      } catch {
        return null;
      }
    }

    const colors: string[] = [];
    const hexColorRegex = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
    const rgbColorRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/g;

    // Extract hex colors from fill, stroke, and style attributes
    const fillMatches = svgString.match(/fill=["']([^"']+)["']/gi) || [];
    const strokeMatches = svgString.match(/stroke=["']([^"']+)["']/gi) || [];
    const styleMatches = svgString.match(/style=["']([^"']+)["']/gi) || [];

    const allMatches = [...fillMatches, ...strokeMatches, ...styleMatches];

    allMatches.forEach((match) => {
      // Extract hex colors
      const hexMatches = match.match(hexColorRegex);
      if (hexMatches) {
        colors.push(...hexMatches);
      }

      // Extract RGB colors and convert to hex
      const rgbMatches = match.match(rgbColorRegex);
      if (rgbMatches) {
        rgbMatches.forEach((rgb) => {
          const rgbValues = rgb.match(/\d+/g);
          if (rgbValues && rgbValues.length === 3) {
            const r = parseInt(rgbValues[0]).toString(16).padStart(2, "0");
            const g = parseInt(rgbValues[1]).toString(16).padStart(2, "0");
            const b = parseInt(rgbValues[2]).toString(16).padStart(2, "0");
            colors.push(`#${r}${g}${b}`);
          }
        });
      }
    });

    // Normalize hex colors (convert 3-digit to 6-digit)
    const normalizeHexColor = (color: string): string | null => {
      if (typeof color !== "string") return null;
      const trimmed = color.trim();
      if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) return null;
      if (trimmed.length === 4) {
        const [hash, r, g, b] = trimmed.toUpperCase().split("");
        return `${hash}${r}${r}${g}${g}${b}${b}`;
      }
      return trimmed.toUpperCase();
    };

    // Remove common non-color values and duplicates
    const validColors = colors
      .map((color) => normalizeHexColor(color))
      .filter((color): color is string => {
        if (!color) return false;
        // Filter out white, black, transparent-like colors
        const lower = color.toLowerCase();
        return (
          lower !== "#FFFFFF" &&
          lower !== "#000000" &&
          lower !== "#FFF" &&
          lower !== "#000" &&
          lower !== "#TRANSPARENT"
        );
      })
      .filter((color, index, self) => self.indexOf(color) === index);

    if (validColors.length === 0) {
      return null;
    }

    return {
      primaryColor: validColors[0],
      secondaryColor: validColors[1] || validColors[0],
    };
  };

  const processSvgLogo = (svg: string): string => {
    if (!svg || (!svg.startsWith("<svg") && !svg.includes("<svg"))) {
      return svg;
    }

    let processed = svg;

    // Remove black background rectangles
    processed = processed.replace(
      /<rect[^>]*(?:fill=["']#000000["']|fill=["']black["']|fill=["']#000["'])[^>]*\/?>/gi,
      "",
    );
    processed = processed.replace(
      /<rect[^>]*(?:width=["']512["']|width=["']100%["'])[^>]*(?:height=["']512["']|height=["']100%["'])[^>]*(?:fill=["']#000000["']|fill=["']black["']|fill=["']#000["'])[^>]*\/?>/gi,
      "",
    );

    // Ensure transparent background
    if (!processed.includes("style=")) {
      processed = processed.replace(
        /<svg([^>]*)>/i,
        '<svg$1 style="background: transparent;">',
      );
    } else if (!processed.includes("background")) {
      processed = processed.replace(
        /style=["']([^"']*)["']/i,
        'style="$1; background: transparent;"',
      );
    }

    return processed;
  };

  // Open logo preview modal
  const openLogoPreview = (logo: string, isSvg: boolean) => {
    const processedLogo = isSvg ? processSvgLogo(logo) : logo;
    setLogoPreviewModal({
      isOpen: true,
      logo: processedLogo,
      isSvg,
    });
  };

  // Handle logo generation
  const handleGenerateLogo = async () => {
    if (!firstPitchMeta?.id || !editedData.companyName) {
      toast.error("Missing company information", {
        description: "Please fill in your company name first.",
      });
      return;
    }

    // Check if logo has already been generated
    if (firstPitchMeta.logoGenerated) {
      toast.error("Logo generation limit reached", {
        description:
          "You can only generate one logo per pitch. Please upload a logo if you need a different one.",
      });
      return;
    }

    setIsGeneratingLogo(true);
    setEditLogoError("");
    setShowLogoLoading(true);
    setLogoProgress(5);
    // When generating a new logo, clear any uploaded logo so only one source is active
    setEditLogoFile(null);
    setEditLogoPreview(null);

    let progressInterval: number | undefined;
    let currentProgress = 5;

    try {
      // Simulate smooth, gradual progress updates
      // Start slow, gradually increase, cap at 85% until API completes
      progressInterval = window.setInterval(() => {
        // Use smaller increments and slower updates for more realistic progress
        // Increment decreases as we get closer to the cap
        const increment =
          currentProgress < 50 ? 3 : currentProgress < 75 ? 2 : 1;
        currentProgress = Math.min(currentProgress + increment, 85);
        setLogoProgress(currentProgress);
      }, 800); // Update every 800ms for smoother feel

      // STEP 1: First, save any pending company info changes (without logo)
      // This ensures we have the latest data before generating the logo
      if (hasCompanyChanges()) {
        setLogoProgress(15);
        currentProgress = 15;
        try {
          // Save company info without logo (we'll add the logo after generation)
          await apiService.updatePitchCompany(firstPitchMeta.id, {
            companyName: editedData.companyName,
            industry: editedData.industry || "",
            oneLiner: editedData.oneLiner || "",
            problem: editedData.problem || "",
            value: editedData.value || "",
            status: editedData.status,
            teamSize: editedData.teamSize,
            brandColor: editedData.brandColor,
            logo: null, // Don't update logo yet, we're about to generate it
          });

          // Update local companyData to reflect the saved changes
          if (companyData) {
            setCompanyData({
              ...companyData,
              companyName: editedData.companyName,
              industry: editedData.industry || "",
              oneLiner: editedData.oneLiner || "",
              problem: editedData.problem || "",
              value: editedData.value || "",
              status: editedData.status,
              teamSize: editedData.teamSize,
              brandColor: editedData.brandColor,
            });
          }
          setLogoProgress(25);
          currentProgress = 25;
        } catch (error) {
          console.error(
            "Failed to save company info before logo generation:",
            error,
          );
          // Continue with logo generation even if save fails
        }
      } else {
        setLogoProgress(20);
        currentProgress = 20;
      }

      // STEP 2: Now generate the logo with the latest saved data
      // Progress will continue gradually up to 85% while waiting for API
      const result = await apiService.generateAndSaveCompanyLogo(
        firstPitchMeta.id,
        {
          companyName: editedData.companyName,
          industry: editedData.industry || "",
          oneLiner: editedData.oneLiner || "",
          problem: editedData.problem || "",
          value: editedData.value || "",
          status: editedData.status,
          teamSize: editedData.teamSize,
          brandColor: editedData.brandColor,
        },
      );

      // Clear the interval and jump to 100% when API completes
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setLogoProgress(100);

      // Process the SVG to remove any black backgrounds
      const processedSvg = processSvgLogo(result.svg);

      // Extract colors from the generated SVG
      const extractedColors = extractColorsFromSVG(processedSvg);
      const newBrandColor =
        extractedColors?.primaryColor || editedData.brandColor || "#252952";

      // Store the generated SVG
      setGeneratedLogoSvg(processedSvg);

      // Update editedData with the new logo and extracted brand color
      setEditedData((prev) => ({
        ...prev,
        logo: processedSvg,
        brandColor: newBrandColor,
      }));

      // Update companyData immediately
      if (companyData) {
        setCompanyData({
          ...companyData,
          logo: processedSvg,
        });
      }

      // Update firstPitchMeta with logo and mark as generated
      if (firstPitchMeta) {
        setFirstPitchMeta({
          ...firstPitchMeta,
          logo: processedSvg,
          logoGenerated: true,
        } as any);
      }

      // Refresh pitches list
      await loadPitches(1);

      // Refresh company data to get the updated logo
      if (firstPitchMeta?.id) {
        try {
          const updatedPitch = await apiService.getPitchDetails(
            firstPitchMeta.id,
          );
          if (updatedPitch?.data) {
            setCompanyData({
              companyName: updatedPitch.data.startupName || "",
              industry: updatedPitch.data.industry || "",
              oneLiner: updatedPitch.data.targetAudience || "",
              problem: updatedPitch.data.problemSolved || "",
              value:
                updatedPitch.data.mainProduct ||
                updatedPitch.data.uniqueSellingPoint ||
                "",
              status: updatedPitch.data.traction || "",
              brandColor: updatedPitch.data.primaryColor || "#252952",
              teamSize: updatedPitch.data.teamSize || "",
              logo:
                updatedPitch.data.logo &&
                (updatedPitch.data.logo.startsWith("<svg") ||
                  updatedPitch.data.logo.includes("<svg"))
                  ? processSvgLogo(updatedPitch.data.logo)
                  : updatedPitch.data.logo || null,
            });

            // Update firstPitchMeta with logoGenerated status
            if (firstPitchMeta) {
              setFirstPitchMeta({
                ...firstPitchMeta,
                logoGenerated: updatedPitch.data.logoGenerated || false,
              } as any);
            }
          }
        } catch (error) {
          console.error("Failed to refresh company data:", error);
        }
      }

      toast.success("Logo generated and saved successfully!");
    } catch (error: any) {
      console.error("Failed to generate logo:", error);
      // Clear interval on error
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      toast.error("Failed to generate logo", {
        description: error.message || "Please try again later.",
      });
      setEditLogoError(error.message || "Failed to generate logo");
    } finally {
      // Ensure interval is cleared
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setTimeout(() => {
        setShowLogoLoading(false);
        setLogoProgress(0);
      }, 400);
      setIsGeneratingLogo(false);
    }
  };

  // Load pitches with pagination
  const loadPitches = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response: PitchHistoryResponse = await apiService.getPitchHistory(
          page,
          pagination.limit,
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
    [apiService, pagination.limit, setPitches],
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
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://foundify.app/${firstPitchMeta.startupName}`,
      );
    } catch (err) {
      console.error("Failed to copy", err);
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
        logoSvgContent || undefined,
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
    primaryColor: string = "#252952",
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

  const [isEditingPitchContent, setIsEditingPitchContent] = useState(false);
  const [pitchContentSource, setPitchContentSource] = useState("");
  const [isSavingPitchContent, setIsSavingPitchContent] = useState(false);
  const [pitchEditFields, setPitchEditFields] = useState({
    startupName: "",
    industryArea: "",
    executiveSummary: "",
    problemStatement: "",
    solutionOverview: "",
    whyNow: "",
    marketOpportunity: "",
    productDescription: "",
    uniqueValueProposition: "",
    targetMarketAnalysis: "",
    businessModel: "",
    competitiveAdvantage: "",
    team: "",
    nextSteps: "",
  });

  const handleOpenPitchEditor = (pitch: PitchHistoryItem) => {
    const html =
      typeof pitch.pitchContent === "string"
        ? pitch.pitchContent
        : formatPitchContentAsHtml(pitch.pitchContent, pitch.startupName);

    setPitchContentSource(html);

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const getText = (selector: string) =>
        doc.querySelector(selector)?.textContent || "";

      const getSectionText = (headingIncludes: string) => {
        // Pitch HTML uses: <div class="section"><div class="section-title"><p>1. Executive Summary</p></div><p>...</p></div>
        const headings = Array.from(
          doc.querySelectorAll(".section .section-title p"),
        ) as HTMLElement[];

        const heading = headings.find((h) =>
          h.textContent?.includes(headingIncludes),
        );
        if (!heading) return "";

        const section = heading.parentElement?.parentElement; // div.section
        if (!section) return "";

        // Find the first content <p> inside the section that is NOT inside .section-title
        const paragraphs = Array.from(
          section.querySelectorAll("p"),
        ) as HTMLElement[];
        const contentP = paragraphs.find((p) => !p.closest(".section-title"));

        return contentP ? contentP.innerHTML || contentP.textContent || "" : "";
      };

      setPitchEditFields({
        startupName: getText(".cover h1"),
        industryArea: getText(".cover p"),
        executiveSummary: getSectionText("Executive Summary"),
        problemStatement: getSectionText("Problem Statement"),
        solutionOverview: getSectionText("Solution Overview"),
        whyNow: getSectionText("Why Now"),
        marketOpportunity: getSectionText("Market Opportunity"),
        productDescription: getSectionText("Product/Service Description"),
        uniqueValueProposition: getSectionText("Unique Value Proposition"),
        targetMarketAnalysis: getSectionText("Target Market Analysis"),
        businessModel: getSectionText("Business Model"),
        competitiveAdvantage: getSectionText("Competitive Advantage"),
        team: getSectionText("Team"),
        nextSteps: getSectionText("Next Steps"),
      });
    } catch (e) {
      console.error("Failed to parse pitch HTML for editing:", e);
    }

    setIsEditingPitchContent(true);
  };

  const handleSavePitchContent = async (pitch: PitchHistoryItem) => {
    if (!firstPitchMeta?.id) return;

    try {
      setIsSavingPitchContent(true);
      toast.loading("Saving pitch content…", {
        id: "save-pitch-content",
      });

      // Rebuild HTML from the stored source, replacing only text sections
      const parser = new DOMParser();
      const doc = parser.parseFromString(pitchContentSource, "text/html");

      const setText = (selector: string, value: string) => {
        const el = doc.querySelector(selector);
        if (el && value) {
          el.textContent = value;
        }
      };

      const setSection = (headingIncludes: string, value: string) => {
        if (!value) return;

        const headings = Array.from(
          doc.querySelectorAll(".section .section-title p"),
        ) as HTMLElement[];

        const heading = headings.find((h) =>
          h.textContent?.includes(headingIncludes),
        );
        if (!heading) return;

        const section = heading.parentElement?.parentElement; // div.section
        if (!section) return;

        const paragraphs = Array.from(
          section.querySelectorAll("p"),
        ) as HTMLElement[];
        const contentP = paragraphs.find((p) => !p.closest(".section-title"));

        if (contentP) {
          contentP.innerHTML = value;
        }
      };

      setText(".cover h1", pitchEditFields.startupName);
      // Keep structure of the existing subtitle but swap text
      setText(".cover p", pitchEditFields.industryArea);

      setSection("Executive Summary", pitchEditFields.executiveSummary);
      setSection("Problem Statement", pitchEditFields.problemStatement);
      setSection("Solution Overview", pitchEditFields.solutionOverview);
      setSection("Why Now", pitchEditFields.whyNow);
      setSection("Market Opportunity", pitchEditFields.marketOpportunity);
      setSection(
        "Product/Service Description",
        pitchEditFields.productDescription,
      );
      setSection(
        "Unique Value Proposition",
        pitchEditFields.uniqueValueProposition,
      );
      setSection(
        "Target Market Analysis",
        pitchEditFields.targetMarketAnalysis,
      );
      setSection("Business Model", pitchEditFields.businessModel);
      setSection("Competitive Advantage", pitchEditFields.competitiveAdvantage);
      setSection("Team", pitchEditFields.team);
      setSection("Next Steps", pitchEditFields.nextSteps);

      const serializer = new XMLSerializer();
      const updatedHtml =
        "<!DOCTYPE html>\n" + serializer.serializeToString(doc.documentElement);

      await apiService.updatePitchContent(pitch.id, updatedHtml);

      // Refresh history so local state uses the latest content
      await loadPitches(1);

      setIsEditingPitchContent(false);
      toast.success("Pitch content updated!", {
        id: "save-pitch-content",
      });
    } catch (error: any) {
      console.error("Failed to update pitch content:", error);
      toast.error("Failed to update pitch content", {
        description: error.message || "Please try again later.",
        id: "save-pitch-content",
      });
    } finally {
      setIsSavingPitchContent(false);
    }
  };

  const handleDownload = (pitch: PitchHistoryItem) => {
    try {
      // Add classes to body and html to lock layout during PDF generation
      document.body.classList.add("pdf-generating");
      document.documentElement.classList.add("pdf-generating");

      // Get primary color from companyData or use default
      const primaryColor = companyData?.brandColor || "#252952";

      // Resolve HTML the same way as the editor: use string if already HTML, else build from JSON
      let htmlContent =
        typeof pitch.pitchContent === "string"
          ? pitch.pitchContent
          : formatPitchContentAsHtml(
              pitch.pitchContent,
              pitch.startupName,
              primaryColor,
            );

      // Resolve logo: use pitch.logo from API; for current/first pitch also allow unsaved generated or company logo
      const isCurrentPitch = firstPitchMeta?.id === pitch.id;
      const logoSource =
        pitch.logo && typeof pitch.logo === "string" && pitch.logo.trim()
          ? pitch.logo.trim()
          : isCurrentPitch
            ? (generatedLogoSvg ?? companyData?.logo ?? null)
            : null;
      //   const rawLogo = typeof logoSource === "string" ? logoSource.trim() : "";

      //   // If we have an uploaded or generated logo, inject it into the cover (first page) so it appears in the PDF
      //   if (rawLogo) {
      //     const isSvg = rawLogo.includes("<svg");
      //     const isImageSrc =
      //       rawLogo.startsWith("data:image") || rawLogo.startsWith("http");

      //     const logoMarkup = isSvg
      //       ? rawLogo
      //       : isImageSrc
      //         ? `<img src="${rawLogo}" alt="${pitch.startupName} logo" />`
      //         : "";

      //     if (logoMarkup) {
      //       const coverLogoContainer = `
      //         <div class="cover-logo" style="margin-bottom: 24px; display: flex; justify-content: center; align-items: center;">

      //         ${logoMarkup}
      //         </div>
      //       `;

      //       // Inject logo at the top of the cover: support both API format (.cover) and client format (.header)
      //       const coverMatch = htmlContent.match(/\s*<div\s+class="cover"\s*>/);
      //       const headerMatch = htmlContent.match(/\s*<div\s+class="header"\s*>/);
      //       if (coverMatch) {
      //         htmlContent = htmlContent.replace(
      //           coverMatch[0],
      //           `${coverMatch[0]}${coverLogoContainer}`,
      //         );
      //       } else if (headerMatch) {
      //         htmlContent = htmlContent.replace(
      //           headerMatch[0],
      //           `${headerMatch[0]}${coverLogoContainer}`,
      //         );
      //       }

      //       // Ensure CSS exists to constrain the logo size on the cover
      //       if (!htmlContent.includes(".cover-logo svg")) {
      //         const coverLogoStyles = `
      //         .cover-logo svg,
      //         .cover-logo img {
      //           max-width: 240px !important;
      //           max-height: 140px !important;
      //           width: auto !important;
      //           height: auto !important;
      //           object-fit: contain;
      //         }`;

      //         if (htmlContent.includes("</style>")) {
      //           htmlContent = htmlContent.replace(
      //             "</style>",
      //             `${coverLogoStyles}
      // </style>`,
      //           );
      //         }
      //       }
      //     }
      //   }

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
      const landingHtml = response?.data?.landingPage;

      if (landingHtml) {
        // Create a blob with the HTML content
        const blob = new Blob([landingHtml], {
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

  const mainLoading =
    (loading && (pitches?.length || 0) === 0) || isFetchingFirstPitch;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid gap-6">
        {/* Company Profile Card - Primary */}
        {mainLoading ? (
          <Card className="border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
              <p className="text-slate-600 text-sm">Loading...</p>
            </CardContent>
          </Card>
        ) : companyData ? (
          <Card className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-100 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex gap-5">
                  {companyData.logo ? (
                    <button
                      type="button"
                      onClick={() =>
                        openLogoPreview(
                          companyData.logo!,
                          companyData.logo.startsWith("<svg") ||
                            companyData.logo.includes("<svg"),
                        )
                      }
                      className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-slate-100 overflow-hidden p-2 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition"
                      title="Click to preview logo"
                    >
                      {companyData.logo.startsWith("<svg") ||
                      companyData.logo.includes("<svg") ? (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: processSvgLogo(companyData.logo),
                          }}
                        />
                      ) : (
                        <img
                          src={companyData.logo}
                          alt={`${companyData.companyName} logo`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </button>
                  ) : (
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${companyData.brandColor} 0%, ${companyData.brandColor}dd 100%)`,
                      }}
                      onClick={() => {
                        // Initialize logo preview from existing company data
                        if (companyData?.logo) {
                          if (
                            companyData.logo.startsWith("<svg") ||
                            companyData.logo.includes("<svg")
                          ) {
                            // It's a generated SVG
                            setGeneratedLogoSvg(companyData.logo);
                            setEditLogoPreview(null);
                            setEditLogoFile(null);
                          } else {
                            // It's an uploaded image (data URL or base64)
                            setEditLogoPreview(companyData.logo);
                            setEditLogoFile(null);
                            setGeneratedLogoSvg(null);
                          }
                        } else {
                          setEditLogoPreview(null);
                          setEditLogoFile(null);
                          setGeneratedLogoSvg(null);
                        }
                        setEditStep(2);
                        setIsEditing(true);
                      }}
                      title="Click to add a logo"
                    >
                      <Building2 className="w-14 h-14 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {companyData.companyName}
                      </h2>
                      <Badge
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                          isProfileComplete
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {isProfileComplete ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                            Complete
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1 inline" />
                            Needs Info
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                      {companyData.oneLiner}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    if (isOpeningEditor) return;
                    setIsOpeningEditor(true);
                    try {
                      if (firstPitchMeta?.id) {
                        // Only fetch if we don't already have companyData with all fields populated
                        // This prevents unnecessary refetches when reopening the modal
                        const needsFetch =
                          !companyData ||
                          !companyData.problem ||
                          !companyData.value ||
                          !companyData.status;

                        let pitch;
                        if (needsFetch) {
                          const details = await apiService.getPitchDetails(
                            firstPitchMeta.id,
                          );
                          pitch = details.data;
                        } else {
                          // Use existing companyData, but structure it like pitch data
                          // No need to fetch - we already have all the data
                          pitch = {
                            startupName: companyData.companyName,
                            industry: companyData.industry,
                            targetAudience: companyData.oneLiner,
                            problemSolved: companyData.problem,
                            mainProduct: companyData.value,
                            uniqueSellingPoint: companyData.value,
                            traction: companyData.status,
                            primaryColor: companyData.brandColor,
                            teamSize: companyData.teamSize,
                            logo: companyData.logo,
                          };
                        }
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
                        // Update companyData with full pitch details
                        const processedLogo = pitch.logo
                          ? pitch.logo.startsWith("<svg") ||
                            pitch.logo.includes("<svg")
                            ? processSvgLogo(pitch.logo)
                            : pitch.logo
                          : null;

                        setCompanyData({
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
                          logo: processedLogo,
                        });

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
                          logo: processedLogo,
                        });

                        // Set logo preview if logo exists
                        if (processedLogo) {
                          // Check if it's an SVG (generated) or a data URL (uploaded)
                          if (
                            processedLogo.startsWith("<svg") ||
                            processedLogo.includes("<svg")
                          ) {
                            // It's a generated SVG
                            setGeneratedLogoSvg(processedLogo);
                            setEditLogoPreview(null);
                            setEditLogoFile(null);
                          } else {
                            // It's an uploaded image (data URL)
                            setEditLogoPreview(processedLogo);
                            setEditLogoFile(null); // No file, just existing logo
                            setGeneratedLogoSvg(null);
                          }
                        } else {
                          setEditLogoPreview(null);
                          setEditLogoFile(null);
                          setGeneratedLogoSvg(null);
                        }
                      } else if (companyData) {
                        setEditedData(companyData);
                        // Initialize logo preview from existing company data
                        if (companyData.logo) {
                          if (
                            companyData.logo.startsWith("<svg") ||
                            companyData.logo.includes("<svg")
                          ) {
                            // It's a generated SVG
                            setGeneratedLogoSvg(companyData.logo);
                            setEditLogoPreview(null);
                            setEditLogoFile(null);
                          } else {
                            // It's an uploaded image (data URL or base64)
                            setEditLogoPreview(companyData.logo);
                            setEditLogoFile(null);
                            setGeneratedLogoSvg(null);
                          }
                        } else {
                          setEditLogoPreview(null);
                          setEditLogoFile(null);
                          setGeneratedLogoSvg(null);
                        }
                      }
                      setIsEditing(true);
                      setEditStep(0);
                    } catch (error) {
                      console.error("Failed to load pitch details:", error);
                      if (companyData) {
                        setEditedData(companyData);
                        // Initialize logo preview from existing company data
                        if (companyData.logo) {
                          if (
                            companyData.logo.startsWith("<svg") ||
                            companyData.logo.includes("<svg")
                          ) {
                            // It's a generated SVG
                            setGeneratedLogoSvg(companyData.logo);
                            setEditLogoPreview(null);
                            setEditLogoFile(null);
                          } else {
                            // It's an uploaded image (data URL or base64)
                            setEditLogoPreview(companyData.logo);
                            setEditLogoFile(null);
                            setGeneratedLogoSvg(null);
                          }
                        } else {
                          setEditLogoPreview(null);
                          setEditLogoFile(null);
                          setGeneratedLogoSvg(null);
                        }
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
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isOpeningEditor ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Edit className="w-3 h-3 mr-2" />
                      EDIT INFO
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
          <Card className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900 text-base">
                  Pitch Assets
                </h4>
              </div>

              <div className="grid md:grid-cols-3 gap-6" id="pitch-assets">
                {/* Pitch Deck */}
                {pitches && pitches.length > 0 && (
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-100 transition-all group/asset flex flex-col min-h-[220px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover/asset:border-indigo-100 group-hover/asset:text-indigo-600 text-slate-400 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      Pitch Deck
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Professional presentation
                    </p>
                    <div className="flex flex-col gap-2.5 mt-auto">
                      <div className="flex gap-2.5">
                        <button
                          onClick={handleRegenerate}
                          className="w-1/2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-[999px] text-xs font-medium flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3" /> Regenerate
                        </button>
                        <button
                          onClick={() =>
                            pitches[0] && handleOpenPitchEditor(pitches[0])
                          }
                          className="w-1/2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-[999px] text-xs font-medium flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
                        >
                          <Edit className="w-3 h-3" /> Edit Pitch
                        </button>
                      </div>
                      <button
                        onClick={() => pitches[0] && handleDownload(pitches[0])}
                        className="w-full py-3 bg-[#252952] text-white rounded-[999px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#1a1d3a] transition-colors shadow-lg shadow-[#252952]/25 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}

                {/* Landing Page */}
                {firstPitchMeta && (
                  <div className="p-5 rounded-2xl border border-slate-100 bg-indigo-50/30 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all group/asset relative overflow-hidden flex flex-col min-h-[220px]">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shadow-sm text-indigo-600">
                        <Zap size={20} />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1 relative z-10">
                      Live Landing Page
                    </h4>
                    {firstPitchHasPremiumLanding ? (
                      <p className="text-xs text-slate-500 mb-4 relative z-10 break-all">
                        foundify.app/
                        {firstPitchMeta.startupName
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") || "your-company"}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mb-4 relative z-10">
                        Generate your landing page
                      </p>
                    )}
                    <div className="mt-auto relative z-10">
                      {firstPitchHasPremiumLanding ? (
                        <button
                          onClick={openLandingPage}
                          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 relative z-10 cursor-pointer"
                        >
                          <ExternalLink size={12} /> Open Page
                        </button>
                      ) : (
                        <button
                          onClick={generateLandingPage}
                          disabled={isGeneratingLanding}
                          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 relative z-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingLanding ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} /> Generate Page
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                )}

                {/* Logo & Brand Assets */}
                {companyData && (
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-purple-200/50 hover:border-purple-100 transition-all group/asset relative overflow-hidden flex flex-col min-h-[220px]">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] flex items-center justify-center shadow-sm text-white">
                        <Palette size={20} />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1 relative z-10">
                      Logo & Brand
                    </h4>
                    {companyData.logo ? (
                      <p className="text-xs text-slate-500 mb-4 relative z-10">
                        Logo generated
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mb-4 relative z-10">
                        Generate your logo
                      </p>
                    )}
                    <div className="mt-auto relative z-10">
                      {companyData.logo ? (
                        <div className="flex flex-row gap-2">
                          <button
                            onClick={() => {
                              openLogoPreview(
                                companyData.logo!,
                                companyData.logo.startsWith("<svg") ||
                                  companyData.logo.includes("<svg"),
                              );
                            }}
                            className="flex-1 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-500/20 cursor-pointer"
                          >
                            <Eye size={12} /> Preview
                          </button>
                          <button
                            onClick={() => {
                              downloadLogo(
                                companyData.logo!,
                                companyData.logo.startsWith("<svg") ||
                                  companyData.logo.includes("<svg"),
                                `${companyData.companyName || "logo"}-logo`,
                              );
                            }}
                            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                          >
                            <Download size={12} /> Download
                          </button>
                        </div>
                      ) : (
                        <div className="mt-auto w-full">
                          <Button
                            size="default"
                            className="bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-[12px] w-full disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={Boolean(firstPitchMeta?.logoGenerated)}
                            onClick={() => {
                              if (firstPitchMeta?.logoGenerated) {
                                toast.error("Logo generation limit reached", {
                                  description:
                                    "You can only generate one logo per pitch. Please upload a logo if you need a different one.",
                                });
                                return;
                              }
                              setEditStep(3);
                              setIsEditing(true);
                            }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {firstPitchMeta?.logoGenerated
                              ? "Logo Already Generated"
                              : "Generate Logo"}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Powers All Your Tools
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
        )} */}
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
                <CardContent className="p-4 md:p-6 bg-[#EEF0FF]">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 md:gap-6 ">
                    {/* Pitch Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[25px] font-semibold text-gray-900 truncate">
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

      {/* Edit Pitch Content Modal */}
      {pitches && pitches.length > 0 && (
        <Dialog
          open={isEditingPitchContent}
          onOpenChange={setIsEditingPitchContent}
        >
          <DialogContent className="max-w-4xl h-auto max-h-[90vh] rounded-[24px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#252952]">
                Edit Pitch Content
              </DialogTitle>
              <DialogDescription>
                Update the text of your pitch sections. The design and layout
                will stay the same.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Startup name
                </Label>
                <Input
                  value={pitchEditFields.startupName}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      startupName: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Industry line (cover subtitle)
                </Label>
                <Input
                  value={pitchEditFields.industryArea}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      industryArea: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Executive summary
                </Label>
                <Textarea
                  value={pitchEditFields.executiveSummary}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      executiveSummary: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Problem statement
                </Label>
                <Textarea
                  value={pitchEditFields.problemStatement}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      problemStatement: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Solution overview
                </Label>
                <Textarea
                  value={pitchEditFields.solutionOverview}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      solutionOverview: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Why now
                </Label>
                <Textarea
                  value={pitchEditFields.whyNow}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      whyNow: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Market opportunity
                </Label>
                <Textarea
                  value={pitchEditFields.marketOpportunity}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      marketOpportunity: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Product / service description
                </Label>
                <Textarea
                  value={pitchEditFields.productDescription}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      productDescription: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Unique value proposition
                </Label>
                <Textarea
                  value={pitchEditFields.uniqueValueProposition}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      uniqueValueProposition: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Target market analysis
                </Label>
                <Textarea
                  value={pitchEditFields.targetMarketAnalysis}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      targetMarketAnalysis: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Business model
                </Label>
                <Textarea
                  value={pitchEditFields.businessModel}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      businessModel: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Competitive advantage
                </Label>
                <Textarea
                  value={pitchEditFields.competitiveAdvantage}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      competitiveAdvantage: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Team
                </Label>
                <Textarea
                  value={pitchEditFields.team}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      team: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#252952]">
                  Next steps
                </Label>
                <Textarea
                  value={pitchEditFields.nextSteps}
                  onChange={(e) =>
                    setPitchEditFields((prev) => ({
                      ...prev,
                      nextSteps: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[80px] border border-slate-200 focus-visible:ring-1 focus-visible:ring-[#2529521a] focus-visible:border-[#252952] focus-visible:outline-none focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  !isSavingPitchContent && setIsEditingPitchContent(false)
                }
                disabled={isSavingPitchContent}
              >
                Cancel
              </Button>
              <Button
                disabled={isSavingPitchContent}
                onClick={() =>
                  !isSavingPitchContent &&
                  pitches[0] &&
                  handleSavePitchContent(pitches[0])
                }
              >
                {isSavingPitchContent ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal with 4 Steps */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl h-auto max-h-[90vh] rounded-[32px] p-0 flex flex-col">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#252952] flex items-center gap-2">
                <Edit className="w-5 h-5 shrink-0" />
                Edit Company Info
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
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
                    onClick={() => {
                      if (index === editStep) return;
                      // Tabs should never send requests - just switch tabs
                      setEditStep(index);
                    }}
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
                  <Combobox
                    options={industryOptions}
                    value={editedData.industry}
                    onValueChange={(value) =>
                      setEditedData({ ...editedData, industry: value })
                    }
                    placeholder="Select your industry"
                    className="h-14 text-base border-2 border-gray-200 rounded-[12px]"
                  />
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
                  <Label className="text-base font-semibold text-[#252952] flex items-center gap-2">
                    Current status or traction
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
              </div>
            )}

            {/* Step 4: Brand (logo) */}
            {editStep === 3 && (
              <div className="space-y-8">
                {/* Section 1: Upload Logo */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-[#252952]">
                    Upload your logo
                  </Label>
                  <label
                    htmlFor="edit-logo-upload"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-[16px] p-12 text-center bg-gradient-to-br from-white to-gray-50 block transition-all hover:border-[#4A90E2] cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-base text-gray-600 mb-2">
                      Click to upload or drag and drop your existing logo
                    </p>
                    <p className="text-sm text-gray-500">SVG only (max. 2MB)</p>
                    <Input
                      id="edit-logo-upload"
                      type="file"
                      accept=".svg,image/svg+xml"
                      onChange={handleEditLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Show uploaded file (takes precedence if present) */}
                  {editLogoFile && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5 text-purple-600" />
                          <span className="text-sm text-gray-700">
                            {editLogoFile.name}
                          </span>
                        </div>
                        <button
                          onClick={clearEditLogo}
                          className="text-gray-500 hover:text-red-500"
                          type="button"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show logo preview (for both newly uploaded and existing logos) */}
                  {editLogoPreview && (
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <p className="text-sm font-semibold text-[#252952] mb-3">
                        Preview:
                      </p>
                      <div className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
                        <div
                          className="w-32 h-32 rounded-full flex items-center justify-center bg-white p-1 border-2 border-gray-200 overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform"
                          onClick={() =>
                            openLogoPreview(
                              editLogoPreview,
                              editLogoPreview.startsWith("<svg") ||
                                editLogoPreview.includes("<svg"),
                            )
                          }
                        >
                          {editLogoPreview.startsWith("<svg") ||
                          editLogoPreview.includes("<svg") ? (
                            <div
                              className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
                              dangerouslySetInnerHTML={{
                                __html: editLogoPreview,
                              }}
                            />
                          ) : (
                            <img
                              src={editLogoPreview}
                              alt="Logo preview"
                              className="w-full h-full object-cover rounded-full"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-2 border-gray-200 rounded-[8px]"
                          onClick={() =>
                            openLogoPreview(
                              editLogoPreview,
                              editLogoPreview.startsWith("<svg") ||
                                editLogoPreview.includes("<svg"),
                            )
                          }
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-2 border-gray-200 rounded-[8px]"
                          onClick={() =>
                            downloadLogo(
                              editLogoPreview,
                              editLogoPreview.startsWith("<svg") ||
                                editLogoPreview.includes("<svg"),
                              `${editedData.companyName || "logo"}-logo`,
                            )
                          }
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        This logo will be saved to your company profile
                      </p>
                    </div>
                  )}

                  {/* Show generated logo preview when there is no uploaded logo */}
                  {generatedLogoSvg && !editLogoFile && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-gray-700">
                            Logo generated successfully
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setGeneratedLogoSvg(null);
                            if (editedData.logo === generatedLogoSvg) {
                              setEditedData({ ...editedData, logo: null });
                            }
                          }}
                          className="text-gray-500 hover:text-red-500"
                          type="button"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      {/* Logo Preview */}
                      <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                        <p className="text-sm font-semibold text-[#252952] mb-3">
                          Preview:
                        </p>
                        <div className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
                          <div
                            className="w-32 h-32 rounded-full flex items-center justify-center bg-white p-1 border-2 border-gray-200 overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform"
                            onClick={() =>
                              openLogoPreview(generatedLogoSvg, true)
                            }
                          >
                            <div
                              className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
                              dangerouslySetInnerHTML={{
                                __html: generatedLogoSvg,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-2 border-gray-200 rounded-[8px]"
                            onClick={() =>
                              openLogoPreview(generatedLogoSvg, true)
                            }
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-2 border-gray-200 rounded-[8px]"
                            onClick={() =>
                              downloadLogo(
                                generatedLogoSvg,
                                true,
                                `${editedData.companyName || "logo"}-logo`,
                              )
                            }
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          This logo will be saved to your company profile
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {editLogoError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {editLogoError}
                    </div>
                  )}
                </div>

                {/* Section 2: Generate Logo */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-[#252952]">
                    Generate a logo for your company
                  </Label>
                  <div className="border-2 border-purple-200 rounded-[16px] p-6 bg-gradient-to-br from-white to-purple-50 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          Don&apos;t have a logo yet? Let Foundify help you
                          create one that matches your brand.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-[999px] px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleGenerateLogo}
                      disabled={
                        isGeneratingLogo ||
                        !editedData.companyName ||
                        firstPitchMeta?.logoGenerated
                      }
                    >
                      {isGeneratingLogo ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : firstPitchMeta?.logoGenerated ? (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Logo Already Generated
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Generate Logo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Credibility */}
            {editStep === 2 && (
              <div className="space-y-6">
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
                onClick={async () => {
                  if (editStep < editSteps.length - 1) {
                    // Continue button should never auto-save - just move to next step
                    // Only the final "Save Changes" button will save
                    setEditStep(editStep + 1);
                  } else {
                    // Final step - only save if there are actual changes
                    if (hasCompanyChanges()) {
                      await handleSaveEdit();
                    } else {
                      // No changes, just close the modal
                      handleCancelEdit();
                      toast.info("No changes to save");
                    }
                  }
                }}
                disabled={isSaving || isStepSaving}
                className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[12px] shadow-lg px-8 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {editStep === editSteps.length - 1 ? (
                  <>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {isStepSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
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
      <LoadingModal
        isOpen={showLogoLoading}
        type="logo"
        progress={logoProgress}
      />

      {/* Logo Preview Modal */}
      <Dialog
        open={logoPreviewModal.isOpen}
        onOpenChange={(open) =>
          setLogoPreviewModal({ ...logoPreviewModal, isOpen: open })
        }
      >
        <DialogContent className="max-w-3xl rounded-[24px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-[32px] font-bold text-[#252952]">
              Logo Preview
            </DialogTitle>
            <DialogDescription className="text-base">
              Preview and download your company logo
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-[16px] border-2 border-gray-200 mb-4">
              <div className="w-full max-w-lg bg-white p-4 border-2 border-gray-200 rounded-[20px] shadow-lg flex items-center justify-center">
                {logoPreviewModal.isSvg && logoPreviewModal.logo ? (
                  <div
                    className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-[480px] [&_svg]:max-h-[260px]"
                    dangerouslySetInnerHTML={{
                      __html: logoPreviewModal.logo,
                    }}
                  />
                ) : logoPreviewModal.logo ? (
                  <img
                    src={logoPreviewModal.logo}
                    alt="Logo preview"
                    className="w-full h-auto max-h-[260px] max-w-[480px] object-contain"
                  />
                ) : null}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-2 border-gray-200 rounded-[12px]"
                onClick={() =>
                  setLogoPreviewModal({ ...logoPreviewModal, isOpen: false })
                }
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[12px]"
                onClick={() => {
                  if (logoPreviewModal.logo) {
                    downloadLogo(
                      logoPreviewModal.logo,
                      logoPreviewModal.isSvg,
                      `${editedData.companyName || companyData?.companyName || "logo"}-logo`,
                    );
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Logo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
