/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import useAxios from "../hooks/useAxios";
import { log } from "util";
import { data } from "react-router-dom";
export const API_BASE_URL =
  "https://foundify-api-production.up.railway.app/api/v1/";

// export const API_BASE_URL = "http://localhost:5001/api/v1/";

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
  keyTraction: string;
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
    return response.data;
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
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to generate email"
        );
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
        throw new Error(
          error.response?.data?.message || "Failed to create invoice"
        );
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
        throw new Error(
          error.response?.data?.message || "Failed to update invoice"
        );
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

  const downloadInvoicePdf = useCallback(
    (uid: string, invoiceId: string): void => {
      const pdfUrl = `${API_BASE_URL}invoices/${uid}/${invoiceId}/pdf`;
      window.open(pdfUrl, "_blank");
    },
    []
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
    return await user.getIdToken();
  }

  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
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

  downloadInvoicePdf(uid: string, invoiceId: string): void {
    const pdfUrl = `${API_BASE_URL}invoices/${uid}/${invoiceId}/pdf`;
    window.open(pdfUrl, "_blank");
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
};
