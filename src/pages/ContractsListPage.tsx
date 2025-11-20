import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
} from "lucide-react";
import { toast } from "sonner";
import { ContractTemplates } from "../components/ContractTemplates";
import type { ContractTemplatesStep } from "../components/ContractTemplates";
import { useApiService } from "../services/api";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Contract {
  id: string;
  title: string;
  type: string;
  status: "completed" | "draft";
  createdDate: string;
  templateId?: string;
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
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(
    null
  );
  const [showCreateHeader, setShowCreateHeader] = useState(true);
  const [showEditHeader, setShowEditHeader] = useState(true);

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
          className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] cursor-pointer text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110 "
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

      {/* Empty State */}
      {!isLoading && contracts.length === 0 && (
        <Card className="border-2 border-solid border-gray-200 rounded-2xl">
          <CardContent className="p-6 sm:p-12 text-center">
            <FileCheck className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No contracts yet
            </h3>
          </CardContent>
        </Card>
      )}

      {/* Contracts List */}
      {!isLoading && contracts.length > 0 && (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Contract Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contract?.template_name || "Untitled Contract"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {contract.type || "Contract"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-6 ">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">Status:</p>
                      <Badge
                        className={
                          contract.status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 w-fit mt-1"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100 w-fit mt-1"
                        }
                      >
                        {contract.status === "completed"
                          ? "Completed"
                          : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleView(contract)}
                      variant="secondary"
                      size="lg"
                      className="cursor-pointer border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                      disabled={viewingId === contract.id}
                    >
                      {viewingId === contract.id ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          Viewing...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleEdit(contract)}
                      className="cursor-pointer border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleDownload(contract)}
                      className="bg-[#252952] hover:bg-[#161930] text-white rounded-xl"
                      disabled={downloadingId === contract.id}
                    >
                      {downloadingId === contract.id ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleDeleteClick(contract)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
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
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          {showCreateHeader && (
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Choose a contract template to get started
              </DialogDescription>
            </DialogHeader>
          )}
          <ContractTemplates
            onSuccess={handleCreateSuccess}
            onStepChange={(step: ContractTemplatesStep) =>
              setShowCreateHeader(step === "select")
            }
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
        <DialogContent className="overflow-y-auto max-h-[90vh]">
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
