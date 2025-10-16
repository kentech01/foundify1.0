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
} from "../components/ui/dialog";
import {
  FileCheck,
  Download,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { ContractTemplates } from "../components/ContractTemplates";
import { useApiService } from "../services/api";
import React from "react";

interface Contract {
  id: string;
  title: string;
  type: string;
  status: "completed" | "draft";
  createdDate: string;
  templateId?: string;
  data?: Record<string, string>;
  html?: string;
}

export function ContractsListPage({
  showContracts,
  setShowContracts,
}: {
  showContracts: boolean;
  setShowContracts: (showContracts: boolean) => void;
}) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContractData, setEditContractData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { getContracts, deleteContract, exportContractPdf, getContract } =
    useApiService();

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contract?")) {
      return;
    }

    try {
      await deleteContract(id);
      setContracts(contracts.filter((c) => c.id !== id));
      toast.success("Contract deleted successfully");
    } catch (error: any) {
      console.error("Error deleting contract:", error);
      toast.error(error.message || "Failed to delete contract");
    }
  };

  const handleDownload = async (contract: Contract) => {
    try {
      setDownloadingId(contract.id);

      // Get the full contract details if needed
      const contractDetails = await getContract(contract.id);

      console.log(contractDetails, "contractDetails");

      // Prepare the payload for PDF export
      const pdfPayload = {
        templateId: contractDetails.data?.template_id || "",
        data: contract.data || {},
        customContent: contractDetails.data?.custom_content || "",
      };

      console.log(pdfPayload, "pdfPayload");

      const pdfBlob = await exportContractPdf(pdfPayload);

      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${contractDetails.data?.template_name.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${contractDetails.data?.template_name}`);
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

      // Prepare the edit data for ContractTemplates
      setEditContractData({
        contractId: contract.id,
        templateId: contractDetails.data?.template_id || "",
        title: contract.data?.template_name || "",
        formData: contract.data || {},
        contractText: contractDetails.data?.custom_content || "",
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
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowContracts(!showContracts)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Your Contracts</h3>
            <p className="text-gray-600 mt-1">
              Manage and download your generated contracts
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
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
        <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
          <CardContent className="p-12 text-center">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No contracts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first contract to get started
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Contract
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contracts List */}
      {!isLoading && contracts.length > 0 && (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              className="border-2 border-gray-100 hover:shadow-md transition-shadow rounded-2xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Left side - Icon and details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {contract?.template_name}
                        </h4>
                        <Badge
                          className={
                            contract.status === "completed"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {contract.status === "completed"
                            ? "Completed"
                            : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{contract.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {contract.createdDate}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(contract)}
                      className="rounded-xl border-2"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(contract)}
                      disabled={downloadingId === contract.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50"
                    >
                      {downloadingId === contract.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contract.id)}
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
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
            <DialogDescription>
              Choose a contract template to get started
            </DialogDescription>
          </DialogHeader>
          <ContractTemplates onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Opens ContractTemplates in edit mode */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setEditContractData(null);
          }
        }}
      >
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Make changes to your contract</DialogDescription>
          </DialogHeader>
          {editContractData && (
            <ContractTemplates
              editMode={editContractData}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
