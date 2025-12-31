/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import useAxios from "../hooks/useAxios";
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";

interface ApiResponse<T> {
  success: boolean;
  user?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

interface LandingPageHtmlResponse {
  success: boolean;
  data: {
    landingPage: string;
  };
  error?: string;
  message?: string;
}

// Email generator interfaces
interface EmailTemplate {
  id: string;
  title: string;
}

interface EmailTemplatesResponse {
  success: boolean;
  templates: EmailTemplate[];
}

interface GenerateEmailRequest {
  template: "cold_outreach" | "meeting_followup" | "warm_introduction" | string;
  yourName: string;
  companyName: string;
  investorName: string;
  valueProposition: string;
  keyTraction?: string; // Optional for meeting_followup and warm_introduction, required for cold_outreach
}

interface GenerateEmailResponse {
  success: boolean;
  subject: string;
  body: string;
  template: string;
}

interface UserProfile {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  plan?: string; // "basic" | "premium" | etc.
  customClaims: Record<string, any>;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

interface PitchFormData {
  startupName: string;
  problemSolved: string;
  targetAudience: string;
  mainProduct: string;
  uniqueSellingPoint: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
}

interface PitchHistoryItem {
  id: string;
  startupName: string;
  createdAt: string;
  status: string;
  preview: string;
  pitchContent: any;
  landingPage: string;
  isFirstPitch?: boolean;
  hasLandingPage?: boolean;
  hasLandingPagePremium?: boolean;
  landingPagePremium?: string;
}

interface PitchHistoryResponse {
  success: boolean;
  data: PitchHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  user: string;
  timestamp: string;
}

interface PitchDetails {
  id: string;
  startupName: string;
  problemSolved: string;
  targetAudience: string;
  mainProduct: string;
  uniqueSellingPoint: string;
  email: string;
  content: string;
  createdAt: string;
}

interface PitchDetailsResponse {
  success: boolean;
  data: PitchDetails;
  timestamp: string;
}

interface DeletePitchResponse {
  success: boolean;
  message: string;
  pitchId: string;
  timestamp: string;
}

interface LandingPageResponse {
  success: boolean;
  data: {
    pitchId: string;
    landingPage: string;
    startupName: string;
    generatedAt: string;
    generatedBy: string;
  };
}

interface LandingPageHtmlResponse {
  success: boolean;
  data: {
    landingPage: string;
  };
  error?: string;
  message?: string;
}

// Invoice interfaces
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  firebaseUid: string;
  companyName?: string;
  clientName?: string;
  invoiceNumber?: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  bankDetails?: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  html?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceCreateData {
  companyName?: string;
  clientName?: string;
  invoiceNumber?: string;
  currency?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  bankDetails?: string;
  status?: "draft" | "sent" | "paid" | "cancelled";
}

interface InvoiceUpdateData {
  companyName?: string;
  clientName?: string;
  invoiceNumber?: string;
  currency?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
  bankDetails?: string;
  status?: "draft" | "sent" | "paid" | "cancelled";
}

interface InvoiceResponse {
  success: boolean;
  data: Invoice;
  error?: string;
  message?: string;
}

interface InvoiceListResponse {
  success: boolean;
  data: Invoice[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
  message?: string;
}
interface ResponseInvoiceListResponse {
  data: InvoiceListResponse;
  counter: number;
}

interface InvoiceHtmlResponse {
  success: boolean;
  data: {
    id: string;
    html: string;
  };
  error?: string;
  message?: string;
}

// Interview interfaces
interface InterviewGenerateRequest {
  candidateName: string;
  role: string;
  seniority: string;
  industry: string;
  interviewGoal: string;
}

interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
}

interface InterviewQuestionsResponse {
  success: boolean;
  data: {
    candidateInfo: {
      candidateName: string;
      role: string;
      seniority: string;
      industry: string;
      interviewGoal: string;
    };
    questions: {
      technical: InterviewQuestion[];
      softSkills: InterviewQuestion[];
      cultureFit: InterviewQuestion[];
    };
  };
  message: string;
}

interface InterviewExportRequest {
  candidateName: string;
  role: string;
  seniority: string;
  industry: string;
  interviewGoal: string;
  technicalQuestions: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  softSkillsQuestions: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  cultureFitQuestions: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

// Contract interfaces
interface ContractGenerateRequest {
  templateId: string;
  data: Record<string, string>;
  customContent?: string; // For edited preview content
}

interface ContractGenerateResponse {
  success: boolean;
  data: {
    contractId: string;
    html: string;
    templateId: string;
    generatedAt: string;
  };
  message?: string;
}

interface ContractPdfResponse {
  success: boolean;
  data: {
    contractId: string;
    pdfUrl: string;
  };
  message?: string;
}

// Add type for export request
interface ContractExportPdfRequest {
  templateId: string;
  data: Record<string, string>;
  customContent?: string; // optional: send edited text if your API supports it
}

interface ContractEditRequest {
  templateId: string;
  originalData: Record<string, string>;
  updates: {
    data?: Record<string, string>;
    customContent?: string;
  };
}

interface ContractEditResponse {
  success: boolean;
  data: {
    contractId?: string;
    html: string;
    templateId: string;
    generatedAt?: string;
  };
  message?: string;
}

interface ContractListResponse {
  success: boolean;
  data: Array<{
    id: string;
    firebase_uid: string;
    user_id?: string;
    template_id: string;
    template_name: string;
    data: Record<string, string>;
    custom_content?: string;
    content: string;
    status: string;
    html?: string;
    created_at: string;
    updated_at: string;
  }>;
  pagination?: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message?: string;
}

// Feedback interfaces
interface FeedbackExportRequest {
  employeeName: string;
  role: string;
  feedbackCycle: string;
  strengthsObserved?: string;
  areasForGrowth?: string;
  teamCollaboration?: string;
  goalsNext6Months?: string;
  additionalNotes?: string;
}

// Subscription interfaces
interface CreateSubscriptionCheckoutResponse {
  success: boolean;
  checkout_url: string;
  checkout_id: string | number;
}

interface SubscriptionRecord {
  id?: string;
  user_id?: string;
  lemonsqueezy_subscription_id?: string | null;
  status: "inactive" | "active" | "cancelled" | string;
  plan_type: "free" | "premium";
  created_at?: string;
  updated_at?: string;
  email?: string;
  lemonSqueezeData?: unknown;
}

interface GetSubscriptionStatusResponse {
  success: boolean;
  subscription: SubscriptionRecord;
}

// Add helper to surface server error messages (used below)
const errorMessage = (error: any) => {
  const status = error?.response?.status;
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Request failed";
  return status ? `${status} ${msg}` : msg;
};

// Centralized fetch helper that attaches a Firebase ID token and
// transparently refreshes it once if the backend reports it as invalid/expired.
export const apiFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  const { auth } = await import("../../firebase");
  const user = auth.currentUser;

  // Helper to perform a single fetch with an optional forced token refresh
  const doRequest = async (forceRefresh = false): Promise<Response> => {
    const freshUser = auth.currentUser;
    const token = freshUser ? await freshUser.getIdToken(forceRefresh) : null;

    const headers = new Headers(init.headers || {});

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    // Preserve existing Content-Type if provided, otherwise default to JSON
    if (
      !headers.has("Content-Type") &&
      init.body &&
      !(init.body instanceof FormData)
    ) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(input, {
      ...init,
      headers,
    });
  };

  // First attempt with the current token
  let response = await doRequest(false);

  // If unauthorized, check if it's specifically the "invalid or expired" case
  if (response.status === 401 && user) {
    try {
      const data = await response
        .clone()
        .json()
        .catch(() => null);
      const message =
        data?.message || data?.error || (typeof data === "string" ? data : "");

      if (
        typeof message === "string" &&
        message
          .toLowerCase()
          .includes("invalid or expired authentication token")
      ) {
        // Force-refresh the token and retry once
        response = await doRequest(true);
      }
    } catch {
      // If we fail to read the body, just fall through and return the original response
    }
  }

  // TEMPORARILY DISABLED: Premium check for Founder Essentials
  // All users can access Founder Essentials for now
  // TODO: Re-enable when premium feature is returned
  /* Handle 403 Forbidden errors - check if it's a premium requirement
  if (response.status === 403) {
    try {
      const data = await response
        .clone()
        .json()
        .catch(() => null);
      const message =
        data?.message || data?.error || (typeof data === "string" ? data : "");

      if (
        typeof message === "string" &&
        (message.toLowerCase().includes("premium") ||
          message.toLowerCase().includes("upgrade") ||
          message.toLowerCase().includes("founder essentials"))
      ) {
        // Trigger premium modal
        const { triggerPremiumModal } = await import("../hooks/useAxios");
        triggerPremiumModal();
      }
    } catch {
      // If we fail to read the body, just fall through
    }
  }
  */

  return response;
};

// Hook-based API service
export const useApiService = () => {
  const axiosInstance = useAxios();

  const generatePitch = useCallback(
    async (pitchData: PitchFormData): Promise<any> => {
      try {
        const response = await axiosInstance.post("/pitch/generate", pitchData);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to generate pitch"
        );
      }
    },
    [axiosInstance]
  );

  const getUserStats = useCallback(async (): Promise<any> => {
    try {
      const response = await axiosInstance.get("/users/stats");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get user stats"
      );
    }
  }, [axiosInstance]);

  const getPitchHistory = useCallback(
    async (
      page: number = 1,
      limit: number = 20
    ): Promise<PitchHistoryResponse> => {
      try {
        const response = await axiosInstance.get("/pitch/history", {
          params: {
            page,
            limit: Math.min(limit, 50), // Ensure limit doesn't exceed 50
          },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get pitch history"
        );
      }
    },
    [axiosInstance]
  );

  const getPitchDetails = useCallback(
    async (id: string): Promise<PitchDetailsResponse> => {
      try {
        const response = await axiosInstance.get(`/pitch/history/${id}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get pitch details"
        );
      }
    },
    [axiosInstance]
  );

  const deletePitch = useCallback(
    async (id: string): Promise<DeletePitchResponse> => {
      try {
        const response = await axiosInstance.delete(`/pitch/history/${id}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to delete pitch"
        );
      }
    },
    [axiosInstance]
  );

  const generateLandingPage = useCallback(
    async (
      pitchId: string,
      plan: "basic" | "premium" = "basic",
      logoSvg?: string // Add optional logoSvg parameter
    ): Promise<LandingPageResponse> => {
      try {
        const response = await axiosInstance.post(`/pitch/landing/${pitchId}`, {
          plan: plan,
          logo: logoSvg,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to generate landing page"
        );
      }
    },
    [axiosInstance]
  );

  // Add a new method to get the first pitch
  const getFirstPitch =
    useCallback(async (): Promise<PitchHistoryItem | null> => {
      try {
        const response = await axiosInstance.get("/pitch/history", {
          params: {
            page: 1,
            limit: 10000,
          },
        });

        const firstPitch = response.data.data.find(
          (pitch: PitchHistoryItem) => pitch.isFirstPitch
        );
        return firstPitch || null;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get first pitch"
        );
      }
    }, [axiosInstance]);

  const getCurrentUserProfile = useCallback(async (): Promise<UserProfile> => {
    const response = await axiosInstance.get("/users/profile");
    // API returns { success: true, profile: {...} }
    return response.data.profile || response.data;
  }, [axiosInstance]);

  const getLandingPageHtml = useCallback(
    async (pitchId: string): Promise<LandingPageHtmlResponse> => {
      try {
        const response = await axiosInstance.get(`/pitch/landing/${pitchId}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get landing page HTML"
        );
      }
    },
    [axiosInstance]
  );

  const getLandingPageHtmlByStartupName = useCallback(
    async (startupName: string): Promise<LandingPageHtmlResponse> => {
      try {
        const response = await axiosInstance.get(
          `/pitch/landing/startupname/${encodeURIComponent(startupName)}`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to get landing page HTML by startup name"
        );
      }
    },
    [axiosInstance]
  );

  // Email generator API methods
  const getEmailTemplates =
    useCallback(async (): Promise<EmailTemplatesResponse> => {
      try {
        const response = await axiosInstance.get("/email/templates");
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get email templates"
        );
      }
    }, [axiosInstance]);

  const generateInvestorEmail = useCallback(
    async (payload: GenerateEmailRequest): Promise<GenerateEmailResponse> => {
      try {
        const response = await axiosInstance.post("/email/generate", payload);
        // Backend returns { success: true, subject, body, template }
        // Extract the email data from the response
        const data = response.data;
        return {
          success: data.success ?? true,
          subject: data.subject || "",
          body: data.body || "",
          template: data.template || payload.template,
        };
      } catch (error: any) {
        // Extract detailed error message
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to generate email";
        throw new Error(errorMessage);
      }
    },
    [axiosInstance]
  );

  // Invoice API methods
  const createInvoice = useCallback(
    async (invoiceData: InvoiceCreateData): Promise<InvoiceResponse> => {
      try {
        const response = await axiosInstance.post("/invoices", invoiceData);
        return response.data;
      } catch (error: any) {
        console.error("createInvoice API error:", error);
        console.error("Response data:", error.response?.data);
        console.error("Status:", error.response?.status);
        console.error(
          "Full error:",
          JSON.stringify(error.response?.data, null, 2)
        );

        // Extract error message from various possible locations
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.details ||
          (typeof error.response?.data === "string"
            ? error.response?.data
            : null) ||
          error.message ||
          "Failed to create invoice";

        throw new Error(errorMessage);
      }
    },
    [axiosInstance]
  );

  const getInvoices = useCallback(
    async (
      limit: number = 20,
      offset: number = 0
    ): Promise<ResponseInvoiceListResponse> => {
      try {
        const response = await axiosInstance.get("/invoices", {
          params: {
            limit: Math.min(limit, 50), // Ensure limit doesn't exceed 50
            offset,
          },
        });
        let counter = 0;
        let dataString = "";
        response.data.data.forEach((element) => {
          const dataTime = element.createdAt.slice(0, 7);
          console.log(dataTime, "responsi");
          if (dataTime != dataString) {
            counter = 0;
            dataString = dataTime;
            counter++;
          } else {
            counter++;
          }
        });
        console.log(counter);

        return { data: response.data, counter: counter };
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get invoices"
        );
      }
    },
    [axiosInstance]
  );

  const getInvoice = useCallback(
    async (id: string): Promise<InvoiceResponse> => {
      try {
        const response = await axiosInstance.get(`/invoices/${id}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get invoice"
        );
      }
    },
    [axiosInstance]
  );

  const updateInvoice = useCallback(
    async (
      id: string,
      updateData: InvoiceUpdateData
    ): Promise<InvoiceResponse> => {
      try {
        const response = await axiosInstance.put(`/invoices/${id}`, updateData);
        return response.data;
      } catch (error: any) {
        console.error("updateInvoice API error:", error);
        console.error("Response data:", error.response?.data);
        console.error("Status:", error.response?.status);

        // Extract error message from various possible locations
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.details ||
          (typeof error.response?.data === "string"
            ? error.response?.data
            : null) ||
          error.message ||
          "Failed to update invoice";

        throw new Error(errorMessage);
      }
    },
    [axiosInstance]
  );

  const deleteInvoice = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await axiosInstance.delete(`/invoices/${id}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to delete invoice"
        );
      }
    },
    [axiosInstance]
  );

  const renderInvoiceHtml = useCallback(
    async (id: string): Promise<InvoiceHtmlResponse> => {
      try {
        const response = await axiosInstance.post(
          `/invoices/${id}/render-html`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to render invoice HTML"
        );
      }
    },
    [axiosInstance]
  );

  const previewInvoice = useCallback((id: string): void => {
    const previewUrl = `${API_BASE_URL}invoices/${id}/preview`;
    window.open(previewUrl, "_blank");
  }, []);

  const viewInvoicePdf = useCallback(
    async (uid: string, invoiceId: string): Promise<void> => {
      try {
        const response = await axiosInstance.get(
          `/invoices/${uid}/${invoiceId}/pdf`,
          {
            responseType: "blob",
          }
        );

        // Create a blob from the response
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Open PDF in a new tab for viewing (not downloading)
        const newWindow = window.open(url, "_blank");

        // Clean up the URL after the window is closed or after a delay
        // Note: We don't revoke immediately as the new window needs the URL
        if (newWindow) {
          newWindow.addEventListener("beforeunload", () => {
            window.URL.revokeObjectURL(url);
          });
          // Fallback: revoke after 5 minutes if window is still open
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 300000);
        } else {
          // If popup was blocked, revoke immediately
          window.URL.revokeObjectURL(url);
          throw new Error("Popup blocked. Please allow popups for this site.");
        }
      } catch (error: any) {
        // Extract error message from backend response
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to view invoice PDF";
        throw new Error(errorMessage);
      }
    },
    [axiosInstance]
  );

  const downloadInvoicePdf = useCallback(
    async (uid: string, invoiceId: string): Promise<void> => {
      try {
        const response = await axiosInstance.get(
          `/invoices/${uid}/${invoiceId}/pdf`,
          {
            responseType: "blob",
          }
        );

        // Create a blob from the response
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`; // Set filename
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error: any) {
        // Extract error message from backend response
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to download invoice PDF";
        throw new Error(errorMessage);
      }
    },
    [axiosInstance]
  );

  // Interview API methods
  const generateInterviewQuestions = useCallback(
    async (
      payload: InterviewGenerateRequest
    ): Promise<InterviewQuestionsResponse> => {
      try {
        const response = await axiosInstance.post(
          "/interview/generate",
          payload
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to generate interview questions"
        );
      }
    },
    [axiosInstance]
  );

  const exportInterviewPdf = useCallback(
    async (payload: InterviewExportRequest): Promise<Blob> => {
      try {
        const response = await axiosInstance.post(
          "/interview/export-pdf",
          payload,
          {
            responseType: "blob",
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to export interview PDF"
        );
      }
    },
    [axiosInstance]
  );

  // Contract API methods
  const generateContract = useCallback(
    async (
      payload: ContractGenerateRequest
    ): Promise<ContractGenerateResponse> => {
      try {
        const response = await axiosInstance.post(
          "/contracts/generate",
          payload
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to generate contract"
        );
      }
    },
    [axiosInstance]
  );

  // Contract API methods
  const exportContractPdf = useCallback(
    async (payload: ContractExportPdfRequest): Promise<Blob> => {
      try {
        const response = await axiosInstance.post(
          "/contracts/export-pdf",
          payload,
          { responseType: "blob" }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(errorMessage(error));
      }
    },
    [axiosInstance]
  );

  const getContract = useCallback(
    async (contractId: string): Promise<ContractGenerateResponse> => {
      try {
        const response = await axiosInstance.get(`/contracts/${contractId}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get contract"
        );
      }
    },
    [axiosInstance]
  );

  const deleteContract = useCallback(
    async (
      contractId: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await axiosInstance.delete(`/contracts/${contractId}`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to delete contract"
        );
      }
    },
    [axiosInstance]
  );

  const editContract = useCallback(
    async (payload: ContractEditRequest): Promise<ContractEditResponse> => {
      try {
        const response = await axiosInstance.put("/contracts/edit", payload);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to edit contract"
        );
      }
    },
    [axiosInstance]
  );

  const getContracts = useCallback(
    async (
      limit: number = 20,
      offset: number = 0
    ): Promise<ContractListResponse> => {
      try {
        const response = await axiosInstance.get("/contracts", {
          params: {
            limit: Math.min(limit, 50),
            offset,
          },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get contracts"
        );
      }
    },
    [axiosInstance]
  );

  const getContractTemplates =
    useCallback(async (): Promise<ContractTemplatesResponse> => {
      try {
        const response = await axiosInstance.get("/contracts/templates");
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get contract templates"
        );
      }
    }, [axiosInstance]);

  const getContractTemplate = useCallback(
    async (templateId: string): Promise<ContractTemplateResponse> => {
      try {
        const response = await axiosInstance.get(
          `/contracts/templates/${templateId}`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get contract template"
        );
      }
    },
    [axiosInstance]
  );

  const exportContractPdfById = useCallback(
    async (contractId: string): Promise<Blob> => {
      try {
        const response = await axiosInstance.post(
          `/contracts/${contractId}/export-pdf`,
          {}, // No body needed since we're using the contract ID
          { responseType: "blob" }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(errorMessage(error));
      }
    },
    [axiosInstance]
  );

  const getContractTemplatePreview = useCallback(
    async (templateId: string): Promise<ContractTemplatePreviewResponse> => {
      try {
        const response = await axiosInstance.get(
          `/contracts/templates/${templateId}/preview`
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to get contract template preview"
        );
      }
    },
    [axiosInstance]
  );

  const previewContractPdf = useCallback(
    async (
      payload: ContractPreviewPdfRequest
    ): Promise<ContractPreviewPdfResponse> => {
      try {
        const response = await axiosInstance.post(
          "/contracts/preview-pdf",
          payload
        );
        return response.data;
      } catch (error: any) {
        throw new Error(errorMessage(error));
      }
    },
    [axiosInstance]
  );

  // Feedback API methods
  const exportFeedbackPdf = useCallback(
    async (payload: FeedbackExportRequest): Promise<Blob> => {
      try {
        const response = await axiosInstance.post(
          "/feedback/export-pdf",
          payload,
          {
            responseType: "blob",
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to export feedback PDF"
        );
      }
    },
    [axiosInstance]
  );

  // Subscription API methods
  const createSubscriptionCheckout = useCallback(
    async (
      billingPeriod: "monthly" | "yearly",
      email?: string,
      name?: string
    ): Promise<CreateSubscriptionCheckoutResponse> => {
      try {
        const response =
          await axiosInstance.post<CreateSubscriptionCheckoutResponse>(
            "/subscriptions/create",
            { billingPeriod, email, name }
          );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to create checkout session"
        );
      }
    },
    [axiosInstance]
  );

  const getSubscriptionStatus =
    useCallback(async (): Promise<GetSubscriptionStatusResponse> => {
      try {
        const response = await axiosInstance.get<GetSubscriptionStatusResponse>(
          "/subscriptions/status"
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to get subscription status"
        );
      }
    }, [axiosInstance]);

  return {
    generatePitch,
    getUserStats,
    getPitchHistory,
    getPitchDetails,
    deletePitch,
    generateLandingPage,
    getLandingPageHtml,
    getLandingPageHtmlByStartupName,
    getCurrentUserProfile,
    getFirstPitch,
    // Email generator methods
    getEmailTemplates,
    generateInvestorEmail,
    // Invoice methods
    createInvoice,
    getInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice,
    renderInvoiceHtml,
    previewInvoice,
    downloadInvoicePdf,
    viewInvoicePdf,
    // Interview methods
    generateInterviewQuestions,
    exportInterviewPdf,
    // Contract methods
    generateContract,
    exportContractPdf,
    exportContractPdfById,
    getContract,
    deleteContract,
    editContract,
    getContracts,
    getContractTemplates,
    getContractTemplate,
    getContractTemplatePreview,
    previewContractPdf,
    // Feedback methods
    exportFeedbackPdf,
    // Subscription methods
    createSubscriptionCheckout,
    getSubscriptionStatus,
  };
};

// Legacy class-based API service (keeping for backward compatibility)
class ApiService {
  private async getAuthToken(): Promise<string | null> {
    const { auth } = await import("../../firebase");
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    // Use Firebase's built-in token handling; this will already refresh if needed
    return await user.getIdToken();
  }

  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const response = await apiFetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      // Try to surface server-provided error messages where possible
      let message = "Request failed";
      try {
        const data = await response.json().catch(() => null);
        const extractedMessage =
          (typeof data === "string" && data) || data?.message || data?.error;

        if (extractedMessage) {
          message = extractedMessage;
        }
      } catch {
        // Ignore JSON parsing issues and fall back to generic message
      }

      if (response.status) {
        message = `${response.status} ${message}`;
      }

      throw new Error(message);
    }

    return await response.json();
  }

  async generatePitch(pitchData: PitchFormData): Promise<any> {
    return this.makeAuthenticatedRequest("/pitch/generate", {
      method: "POST",
      body: JSON.stringify(pitchData),
    });
  }

  async getUserStats(): Promise<any> {
    return this.makeAuthenticatedRequest("/users/stats");
  }

  async getPitchHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<PitchHistoryResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: Math.min(limit, 50).toString(), // Ensure limit doesn't exceed 50
    });

    const response = await this.makeAuthenticatedRequest<any>(
      `/pitch/history?${queryParams}`
    );
    return response as PitchHistoryResponse;
  }

  async getPitchDetails(id: string): Promise<PitchDetailsResponse> {
    const response = await this.makeAuthenticatedRequest<PitchDetails>(
      `/pitch/history/${id}`
    );
    return response as PitchDetailsResponse;
  }

  async deletePitch(id: string): Promise<DeletePitchResponse> {
    const response = await this.makeAuthenticatedRequest<DeletePitchResponse>(
      `/pitch/history/${id}`,
      {
        method: "DELETE",
      }
    );
    return response as DeletePitchResponse;
  }

  async generateLandingPage(pitchId: string): Promise<LandingPageResponse> {
    const response = await this.makeAuthenticatedRequest<any>(
      `/pitch/landing/${pitchId}`,
      {
        method: "POST",
      }
    );
    return response as LandingPageResponse;
  }

  async getLandingPageHtml(pitchId: string): Promise<LandingPageHtmlResponse> {
    const response = await this.makeAuthenticatedRequest<any>(
      `/pitch/landing/${pitchId}`
    );
    return response as LandingPageHtmlResponse;
  }

  async getLandingPageHtmlByStartupName(
    startupName: string
  ): Promise<LandingPageHtmlResponse> {
    const response = await this.makeAuthenticatedRequest<any>(
      `/pitch/landing/startupname/${encodeURIComponent(startupName)}`
    );
    return response as LandingPageHtmlResponse;
  }

  // Email generator methods for legacy class-based service
  async getEmailTemplates(): Promise<EmailTemplatesResponse> {
    const response = await this.makeAuthenticatedRequest<EmailTemplate[]>(
      "/email/templates"
    );
    return response as EmailTemplatesResponse;
  }

  async generateInvestorEmail(
    payload: GenerateEmailRequest
  ): Promise<GenerateEmailResponse> {
    const response = await this.makeAuthenticatedRequest<GenerateEmailResponse>(
      "/email/generate",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return response as GenerateEmailResponse;
  }

  // Invoice methods for legacy class-based service
  async createInvoice(invoiceData: InvoiceCreateData): Promise<any> {
    return this.makeAuthenticatedRequest<any>("/invoices", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    });
  }

  async getInvoices(
    limit: number = 20,
    offset: number = 0
  ): Promise<InvoiceListResponse> {
    const queryParams = new URLSearchParams({
      limit: Math.min(limit, 50).toString(),
      offset: offset.toString(),
    });

    const response = await this.makeAuthenticatedRequest<any>(
      `/invoices?${queryParams}`
    );
    return response as InvoiceListResponse;
  }

  async getInvoice(id: string): Promise<InvoiceResponse> {
    const response = await this.makeAuthenticatedRequest<Invoice>(
      `/invoices/${id}`
    );
    return response as InvoiceResponse;
  }

  async updateInvoice(
    id: string,
    updateData: InvoiceUpdateData
  ): Promise<InvoiceResponse> {
    const response = await this.makeAuthenticatedRequest<Invoice>(
      `/invoices/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      }
    );
    return response as InvoiceResponse;
  }

  async deleteInvoice(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.makeAuthenticatedRequest<any>(
      `/invoices/${id}`,
      {
        method: "DELETE",
      }
    );
    return response as { success: boolean; message: string };
  }

  async renderInvoiceHtml(id: string): Promise<any> {
    const response = await this.makeAuthenticatedRequest<any>(
      `/invoices/${id}/render-html`,
      {
        method: "POST",
      }
    );
    return response as InvoiceHtmlResponse;
  }

  previewInvoice(id: string): void {
    const previewUrl = `${API_BASE_URL}invoices/${id}/preview`;
    window.open(previewUrl, "_blank");
  }

  async downloadInvoicePdf(uid: string, invoiceId: string): Promise<void> {
    try {
      const response = await apiFetch(
        `${API_BASE_URL}invoices/${uid}/${invoiceId}/pdf`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            "Failed to download invoice PDF"
        );
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`; // Set filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw new Error(error.message || "Failed to download invoice PDF");
    }
  }

  // Contract methods for legacy class-based service
  async deleteContract(
    contractId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.makeAuthenticatedRequest<any>(
      `/contracts/${contractId}`,
      {
        method: "DELETE",
      }
    );
    return response as { success: boolean; message: string };
  }
}

export const apiService = new ApiService();
export type {
  UserProfile,
  ApiResponse,
  PitchFormData,
  PitchHistoryItem,
  PitchHistoryResponse,
  PitchDetails,
  PitchDetailsResponse,
  DeletePitchResponse,
  LandingPageResponse,
  LandingPageHtmlResponse,
  // Email generator types
  EmailTemplate,
  EmailTemplatesResponse,
  GenerateEmailRequest,
  GenerateEmailResponse,
  // Invoice types
  Invoice,
  InvoiceItem,
  InvoiceCreateData,
  InvoiceUpdateData,
  InvoiceResponse,
  InvoiceListResponse,
  InvoiceHtmlResponse,
  // Interview types
  InterviewGenerateRequest,
  InterviewQuestion,
  InterviewQuestionsResponse,
  InterviewExportRequest,
  // Contract types
  ContractGenerateRequest,
  ContractGenerateResponse,
  ContractPdfResponse,
  ContractExportPdfRequest,
  ContractEditRequest,
  ContractEditResponse,
  ContractTemplate,
  ContractTemplatesResponse,
  ContractTemplateResponse,
  ContractTemplatePreview,
  ContractTemplatePreviewResponse,
  ContractPreviewPdfRequest,
  ContractPreviewPdfResponse,
  // Feedback types
  FeedbackExportRequest,
  ContractListResponse,
  // Subscription types
  CreateSubscriptionCheckoutResponse,
  GetSubscriptionStatusResponse,
  SubscriptionRecord,
};
