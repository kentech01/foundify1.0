import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  FileCheck,
  Download,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Eye,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { ContractTemplates } from "../components/ContractTemplates";
import type { ContractTemplatesStep } from "../components/ContractTemplates";
import { useApiService } from "../services/api";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Contract {
  id: string;
  contract_name: string;
  type: string;
  status: "completed" | "draft";
  created_at: string;
  template_id?: string;
  template_name?: string;
  data?: Record<string, string>;
  html?: string;
}

export function ContractsListPage() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContractData, setEditContractData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(
    null
  );
  const [showCreateHeader, setShowCreateHeader] = useState(true);
  const [showEditHeader, setShowEditHeader] = useState(true);
  const [language, setLanguage] = useState<"en" | "alb">("en");

  const {
    getContracts,
    deleteContract,
    exportContractPdf,
    getContract,
    exportContractPdfById,
  } = useApiService();

  // Fetch contracts on mount
  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const response = await getContracts();
      setContracts(response.data);
    } catch (error: any) {
      console.error("Error fetching contracts:", error);
      toast.error("Failed to load contracts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (contract: Contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!contractToDelete) return;

    try {
      await deleteContract(contractToDelete.id);
      setContracts(contracts.filter((c) => c.id !== contractToDelete.id));
      toast.success("Contract deleted successfully");
    } catch (error: any) {
      console.error("Error deleting contract:", error);
      toast.error(error.message || "Failed to delete contract");
    } finally {
      setDeleteDialogOpen(false);
      setContractToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setContractToDelete(null);
  };

  const handleView = async (contract: Contract) => {
    try {
      setViewingId(contract.id);

      // Use the new endpoint that exports directly from the saved contract
      const pdfBlob = await exportContractPdfById(contract.id);

      // Open the PDF in a new tab for viewing
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");

      // Clean up the object URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error: any) {
      console.error("Error viewing contract:", error);
      toast.error(error.message || "Failed to view contract");
    } finally {
      setViewingId(null);
    }
  };

  const handleDownload = async (contract: Contract) => {
    try {
      setDownloadingId(contract.id);

      // Use the new endpoint that exports directly from the saved contract
      const pdfBlob = await exportContractPdfById(contract.id);

      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${contract.template_name?.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${contract.template_name}`);
    } catch (error: any) {
      console.error("Error downloading contract:", error);
      toast.error(error.message || "Failed to download contract");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleEdit = async (contract: Contract) => {
    try {
      setIsLoading(true);

      // Fetch the full contract details from the API
      const contractDetails = await getContract(contract.id);
      const details = (contractDetails?.data ?? {}) as {
        template_id?: string;
        custom_content?: string;
      };

      // Prepare the edit data for ContractTemplates
      setEditContractData({
        contractId: contract.id,
        templateId: details.template_id || "",
        title: contract.data?.template_name || contract.template_name || "",
        formData: contract.data || {},
        contractText: details.custom_content || "",
      });

      setIsEditModalOpen(true);
    } catch (error: any) {
      console.error("Error loading contract for edit:", error);
      toast.error(error.message || "Failed to load contract");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Refresh the contracts list
    fetchContracts();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditContractData(null);
    // Refresh the contracts list
    fetchContracts();
  };
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.contract_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.template_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract
        .data!.receiving_party?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract
        .data!.jurisdiction?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract
        .data!.disclosing_party?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header: Back + Title on left, Action button on right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Your Contracts
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and download your generated contracts
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setIsCreateModalOpen(true);
            setShowCreateHeader(true);
          }}
          className="bg-[#252952] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110 "
        >
          <Plus className="mr-2 h-4 w-4" />
          New Contract
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      <div className="mb-6">
        {contracts.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search contracts..."
              className="pl-10 border-2 border-gray-200 rounded-xl placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredContracts.length === 0 && (
        <Card className="border-2 border-solid border-gray-200 rounded-2xl">
          <CardContent className="p-6 sm:p-12 text-center">
            <FileCheck className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {searchTerm
                ? "No contract found"
                : "No contracts yet - create your first one"}
            </h3>
          </CardContent>
        </Card>
      )}

      {/* Contracts List */}
      {!isLoading && contracts.length > 0 && (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <Card
              key={contract.id}
              className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl"
            >
              <CardContent className="p-4 sm:p-6 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                  {/* Contract Info (title + subtitle) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {contract.data?.contract_name ||
                              contract.template_name ||
                              "Untitled Contract"}
                          </h3>
                          <Badge
                            className={`${
                              contract.status == "draft"
                                ? "bg-gray-200 text-gray-600"
                                : "bg-green-200 text-green-800"
                            } text-xs pb-0 border-0 capitalize`}
                          >
                            {contract.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {contract.data?.template_name ||
                            contract.template_name ||
                            contract.type ||
                            "Contract"}
                        </p>
                        <p className="text-[12px] text-gray-600">
                          Created at{" "}
                          {new Date(contract.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
                    <Button
                      onClick={() => handleView(contract)}
                      variant="outline"
                      size="sm"
                      className="sm:h-8 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none"
                      disabled={viewingId === contract.id}
                    >
                      {viewingId === contract.id ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          <span className="hidden sm:inline">Viewing...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="sm:h-8 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none"
                      onClick={() => handleEdit(contract)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      className="sm:h-8 bg-[#4a90e2] hover:bg-[#607dc4] text-white rounded-xl flex-1 sm:flex-none"
                      onClick={() => handleDownload(contract)}
                      disabled={downloadingId === contract.id}
                    >
                      {downloadingId === contract.id ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          <span className="hidden sm:inline">
                            Downloading...
                          </span>
                        </>
                      ) : (
                        <>
                          <Download className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="sm:h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl flex-1 sm:flex-none"
                      onClick={() => handleDeleteClick(contract)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            setShowCreateHeader(true);
          }
        }}
      >
        <DialogContent className="!w-[calc(100%-3rem)] lg:!w-full max-w-5xl overflow-y-auto rounded-2xl sm:mx-auto max-h-[90vh]">
          {showCreateHeader && (
            <DialogHeader>
              <DialogTitle>
                {language === "en"
                  ? "Create New Contract"
                  : "Krijo Kontratë të Re"}
              </DialogTitle>
              <DialogDescription>
                {language === "en"
                  ? "Choose a contract template to get started"
                  : "Zgjidhni një shabllon kontrate për të filluar"}
              </DialogDescription>
            </DialogHeader>
          )}
          <ContractTemplates
            onSuccess={handleCreateSuccess}
            onStepChange={(step: ContractTemplatesStep) =>
              setShowCreateHeader(step === "select")
            }
            onLanguageChange={setLanguage}
            initialLanguage={language}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Opens ContractTemplates in edit mode */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setShowEditHeader(true);
          }
          if (!open) {
            setEditContractData(null);
          }
        }}
      >
        <DialogContent className="!w-[calc(100%-3rem)] lg:!w-full max-w-5xl overflow-y-auto rounded-2xl mx-4 sm:mx-auto max-h-[90vh]">
          {showEditHeader && (
            <DialogHeader>
              <DialogTitle>Edit Contract</DialogTitle>
              <DialogDescription>
                Make changes to your contract
              </DialogDescription>
            </DialogHeader>
          )}
          {editContractData && (
            <ContractTemplates
              editMode={editContractData}
              onSuccess={handleEditSuccess}
              onStepChange={(step: ContractTemplatesStep) =>
                setShowEditHeader(step === "select")
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-2 border-red-100 shadow-xl max-w-md w-[95vw] sm:w-full mx-4 sm:mx-auto">
          <AlertDialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Delete Contract
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm sm:text-base text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{contractToDelete?.template_name}"
              </span>
              ? This action cannot be undone and all contract data will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:justify-end mt-6">
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className="rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-4 sm:px-6 py-2.5 w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium px-4 sm:px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
