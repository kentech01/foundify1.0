import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  Lock,
  Check,
  Copy,
  HelpCircle,
  ChevronRight,
  Edit,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useApiService } from "../services/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { contractTemplates } from "../constants";
import React from "react";

interface ContractTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  downloads: number;
  isPremium: boolean;
  previewContent: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea" | "date";
    tooltip?: string;
  }[];
}

interface ContractTemplatesProps {
  onSuccess?: () => void;
  editMode?: {
    contractId: string;
    templateId: string;
    title: string;
    formData: Record<string, string>;
    contractText: string;
  };
}

export function ContractTemplates({
  onSuccess,
  editMode,
}: ContractTemplatesProps = {}) {
  const [step, setStep] = useState<"select" | "preview" | "customize" | "edit">(
    editMode ? "edit" : "select"
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(
      editMode
        ? contractTemplates.find((t) => t.id === editMode.templateId) || null
        : null
    );
  const [formData, setFormData] = useState<Record<string, string>>(
    editMode?.formData || {}
  );
  const [editableContract, setEditableContract] = useState<string>(
    editMode?.contractText || ""
  );
  const [editablePreview, setEditablePreview] = useState<string>(
    editMode?.contractText || ""
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContractId, setGeneratedContractId] = useState<string>(
    editMode?.contractId || ""
  );

  console.log(editMode, "editmode");

  useEffect(() => {
    if (editMode && selectedTemplate) {
      // Set the editable preview to the contract text for editing
      setEditablePreview(editMode.contractText);
      // Also set the editable contract
      setEditableContract(editMode.contractText);
    }
  }, [editMode, selectedTemplate]);

  const { generateContract, exportContractPdf, editContract } = useApiService();

  const handleSelectTemplate = (template: ContractTemplate) => {
    if (template.isPremium) {
      toast.info("This is a premium template. Upgrade to access it!");
      return;
    }
    setSelectedTemplate(template);
    setEditablePreview(template.previewContent);
    setStep("preview");
    // Initialize form data with empty values
    const initialData: Record<string, string> = {};
    template.fields.forEach((field) => {
      initialData[field.id] = "";
    });
    setFormData(initialData);
  };

  const handleContinueToCustomize = () => {
    setStep("customize");
  };

  const handleBack = () => {
    if (step === "edit") {
      setStep("customize");
    } else if (step === "customize") {
      setStep("preview");
    } else if (step === "preview") {
      setStep("select");
      setSelectedTemplate(null);
    }
  };

  const fillContractPlaceholders = () => {
    if (!selectedTemplate) return "";

    let contractText = editablePreview; // Change from selectedTemplate.previewContent

    // Replace all placeholders with actual values
    Object.keys(formData).forEach((fieldId) => {
      const value =
        formData[fieldId] || `[${fieldId.replace(/_/g, " ").toUpperCase()}]`;
      const placeholder = `[${fieldId.toUpperCase()}]`;
      contractText = contractText.replace(new RegExp(placeholder, "g"), value);
    });

    return contractText;
  };

  const handlePreviewAndEdit = () => {
    const filledContract = fillContractPlaceholders();
    setEditableContract(filledContract);
    setStep("edit");
  };

  // add mapping and content helpers near other handlers
  // const toCamel = (s: string) =>
  //   s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const mapDataForApi = (data: Record<string, string>) => {
    console.log(data, "data");

    const out: Record<string, string> = data;

    if (out["date"] && !out["agreementDate"])
      out["agreementDate"] = out["date"];
    return out;
  };
  console.log(editablePreview, "editablePreview");
  const handleGenerateContract = async () => {
    try {
      setIsGenerating(true);

      // If in edit mode, we're updating an existing contract
      if (editMode) {
        // Prepare the edit payload
        const editPayload = {
          templateId: editMode.templateId,
          originalData: editMode.formData, // Use the original data from editMode
          updates: {
            data: mapDataForApi(formData), // Use the updated form data
            customContent: editableContract, // Use the edited contract text
          },
          contractId: editMode.contractId, // Include the contract ID
          saveToDb: true, // Make sure to save to database
        };

        console.log("Edit payload:", editPayload);

        // Call the edit endpoint to save changes
        const editResponse = await editContract(editPayload);
        console.log("Contract updated:", editResponse);

        // Export the PDF with the updated content
        const pdfPayload = {
          templateId: editMode.templateId,
          data: mapDataForApi(formData), // Use updated form data
          customContent: editableContract, // Use edited contract text
        };

        console.log("PDF payload:", pdfPayload);

        const pdfBlob = await exportContractPdf(pdfPayload);

        // Download the PDF
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${editMode.title.replace(
          /\s+/g,
          "_"
        )}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Contract updated and downloaded!");
      } else {
        // Creating a new contract
        const contractPayload = {
          templateId: selectedTemplate!.id,
          data: mapDataForApi(formData),
          customContent: editablePreview,
        };

        const contractResponse = await generateContract(contractPayload);
        setGeneratedContractId(contractResponse.data.contractId);
        toast.success("Contract created successfully!");
      }

      // Reset state
      setStep("select");
      setSelectedTemplate(null);
      setFormData({});
      setEditableContract("");
      setEditablePreview("");
      setGeneratedContractId("");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error generating contract:", error);
      const msg =
        typeof error?.message === "string"
          ? error.message
          : "Failed to generate contract";
      toast.error(
        `Failed to ${editMode ? "update" : "generate"} contract: ${msg}`
      );
    } finally {
      setIsGenerating(false);
    }
  };
  const handleCopyText = () => {
    navigator.clipboard.writeText(editableContract);
    toast.success("Contract text copied to clipboard!");
  };

  const updateFormData = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  // Render template selection
  if (step === "select") {
    return (
      <div className=" space-y-6">
        {/* Breadcrumb */}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">Contract Templates</h1>
          <p className="text-gray-600">
            Professional legal templates for your startup
          </p>
        </div>

        {/* 2x2 Grid of Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contractTemplates.map((template) => (
            <Card
              key={template.id}
              className={`border shadow-sm hover:shadow-md transition-shadow ${
                template.isPremium
                  ? "border-purple-200 bg-purple-50/20"
                  : "border-gray-200 bg-white hover:border-blue-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      template.isPremium ? "bg-purple-100" : "bg-blue-100"
                    }`}
                  >
                    <FileText
                      className={`w-6 h-6 ${
                        template.isPremium
                          ? "text-premium-purple-700"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <Badge
                      variant="secondary"
                      className={`mb-2 text-xs ${
                        template.category === "Legal"
                          ? "bg-blue-100 text-blue-700"
                          : template.category === "Founding"
                          ? "bg-purple-100 text-purple-700"
                          : template.category === "HR"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {template.category}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{template.title}</h3>
                    {template.isPremium && (
                      <Badge className="bg-premium-purple-700 text-white text-xs px-2 py-0.5">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {template.downloads} downloads
                  </p>
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    size="sm"
                    className={
                      template.isPremium
                        ? "bg-premium-purple-700 hover:bg-premium-purple-800 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }
                  >
                    {template.isPremium ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Upgrade
                      </>
                    ) : (
                      "Use Template"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Friendly UX Copy */}
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Your ready-to-use legal template in minutes.</strong> Fill
            in your details to generate your contract.
          </p>
        </div>
      </div>
    );
  }

  // Render template preview
  if (step === "preview" && selectedTemplate) {
    return (
      <div className=" space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-start gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl mb-1">{selectedTemplate.title}</h1>
            <p className="text-gray-600">Preview and edit before customizing</p>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Template Preview</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Edit className="w-3 h-3 mr-1" />
                Editable
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              value={editablePreview}
              onChange={(e) => setEditablePreview(e.target.value)}
              className="w-full min-h-[450px] font-mono text-sm leading-relaxed resize-none"
              placeholder="Your template preview..."
            />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ready to customize?</p>
              <p className="text-sm text-gray-600">
                Fill in your details to generate the contract
              </p>
            </div>
          </div>
          <Button
            onClick={handleContinueToCustomize}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            Continue to Customize
          </Button>
        </div>
      </div>
    );
  }

  // Render customization form
  if (step === "customize" && selectedTemplate) {
    const allFieldsFilled = selectedTemplate.fields.every((field) =>
      formData[field.id]?.trim()
    );

    return (
      <TooltipProvider>
        <div className=" space-y-6">
          <div className="flex items-start gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="mt-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl mb-1">
                Customize {selectedTemplate.title}
              </h1>
              <p className="text-gray-600">Fill in the required information</p>
            </div>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.fields.map((field) => (
                  <div
                    key={field.id}
                    className={field.type === "textarea" ? "md:col-span-2" : ""}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="" htmlFor={field.id}>
                        {field.label}
                      </Label>
                      {field.tooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm max-w-xs">{field.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={(e) =>
                          updateFormData(field.id, e.target.value)
                        }
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full"
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={(e) =>
                          updateFormData(field.id, e.target.value)
                        }
                        placeholder={field.placeholder}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleGenerateContract}
              size="lg"
              disabled={!allFieldsFilled}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Create Contract
            </Button>
          </div>

          {!allFieldsFilled && (
            <p className="text-sm text-center text-gray-500">
              Please fill in all required fields to continue
            </p>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Render editable contract view
  if (step === "edit" && selectedTemplate) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl mb-1">
              vestingYears Review & Edit {selectedTemplate.title}
            </h1>
            <p className="text-gray-600">
              Make any final changes before generating your contract
            </p>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Editable Contract Text</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Fully Editable
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              value={editableContract}
              onChange={(e) => setEditableContract(e.target.value)}
              className="w-full min-h-[500px] font-mono text-sm leading-relaxed"
              placeholder="Your contract text will appear here..."
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Contract ready to finalize?
              </p>
              <p className="text-sm text-gray-600">
                Generate PDF or copy the text to use elsewhere
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleCopyText}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
            <Button
              onClick={handleGenerateContract}
              size="lg"
              disabled={isGenerating}
              className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editMode ? "Updating..." : "Generating..."}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {editMode ? "Update & Download" : "Generate Contract PDF"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
