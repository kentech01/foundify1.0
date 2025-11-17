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
  Edit,
} from "lucide-react";

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

export type ContractTemplatesStep = "select" | "preview" | "customize" | "edit";

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
    type: string;
    tooltip?: string;
    required?: boolean;
    defaultValue?: string | (() => string);
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
  onStepChange?: (step: ContractTemplatesStep) => void;
}

export function ContractTemplates({
  onSuccess,
  editMode,
  onStepChange,
}: ContractTemplatesProps = {}) {
  const [step, setStep] = useState<ContractTemplatesStep>(
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

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const { generateContract, exportContractPdf, editContract } = useApiService();

  const handleSelectTemplate = (template: ContractTemplate) => {
    if (template.isPremium) {
      toast.info("This is a premium template. Upgrade to access it!");
      return;
    }
    setSelectedTemplate(template);
    setEditablePreview(template.previewContent);
    setStep("preview");
    // Initialize form data with default values
    const initialData: Record<string, string> = {};
    template.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] =
          typeof field.defaultValue === "function"
            ? field.defaultValue()
            : field.defaultValue;
      } else {
        initialData[field.id] = "";
      }
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

  // Remove placeholders for falsy fields, wrap truthy placeholders in bold tags
  // This keeps placeholders intact so backend can fill them from the data object
  const removeFalsyPlaceholders = (baseText?: string) => {
    if (!selectedTemplate) return "";

    let contractText = baseText || editablePreview;

    // Helper function to remove common phrases around placeholders
    const removePlaceholderWithContext = (
      text: string,
      placeholder: string,
      fieldId: string
    ): string => {
      const placeholderPattern = `\\[${fieldId.toUpperCase()}\\]`;

      // Common patterns to remove with context
      const removalPatterns = [
        // "for the purpose of [PURPOSE]"
        new RegExp(
          `\\s*for\\s+the\\s+purpose\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "as of [DATE]"
        new RegExp(`\\s*as\\s+of\\s+${placeholderPattern}\\s*`, "gi"),
        // "[DURATION] years"
        new RegExp(`\\s*${placeholderPattern}\\s+years?\\s*`, "gi"),
        // "[DURATION] months?"
        new RegExp(`\\s*${placeholderPattern}\\s+months?\\s*`, "gi"),
        // "per [PAYMENT_UNIT]"
        new RegExp(`\\s*per\\s+${placeholderPattern}\\s*`, "gi"),
        // "payable [PAYMENT_TERMS]"
        new RegExp(`\\s*payable\\s+${placeholderPattern}\\s*`, "gi"),
        // "at [INTEREST_RATE]%"
        new RegExp(`\\s*at\\s+${placeholderPattern}\\s*%?\\s*`, "gi"),
        // "with [CLIFF_MONTHS] month"
        new RegExp(`\\s*with\\s+${placeholderPattern}\\s+month\\s*`, "gi"),
        // "over a period of [VESTING_YEARS] years"
        new RegExp(
          `\\s*over\\s+a\\s+period\\s+of\\s+${placeholderPattern}\\s+years?\\s*`,
          "gi"
        ),
        // "until [END_DATE]"
        new RegExp(`\\s*until\\s+${placeholderPattern}\\s*`, "gi"),
        // "from [START_DATE]"
        new RegExp(`\\s*from\\s+${placeholderPattern}\\s*`, "gi"),
        // "on [DATE]"
        new RegExp(`\\s*on\\s+${placeholderPattern}\\s*`, "gi"),
        // "in the position of [JOB_TITLE]"
        new RegExp(
          `\\s*in\\s+the\\s+position\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "in the State of [JURISDICTION]"
        new RegExp(
          `\\s*in\\s+the\\s+State\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "under the name [COMPANY_NAME]"
        new RegExp(
          `\\s*under\\s+the\\s+name\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "engaged in the business of [BUSINESS_DESCRIPTION]"
        new RegExp(
          `\\s*engaged\\s+in\\s+the\\s+business\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "as a [TYPE_OF_ENTITY]"
        new RegExp(`\\s*as\\s+a\\s+${placeholderPattern}\\s*`, "gi"),
        // "with [NOTICE_PERIOD] written notice"
        new RegExp(
          `\\s*with\\s+${placeholderPattern}\\s+written\\s+notice\\s*`,
          "gi"
        ),
        // "For [NON_COMPETE_DURATION] months"
        new RegExp(`\\s*[Ff]or\\s+${placeholderPattern}\\s+months?\\s*`, "gi"),
        // "including [KEY_RESPONSIBILITIES]"
        new RegExp(`\\s*including\\s+${placeholderPattern}\\s*`, "gi"),
        // "as described below: [SERVICE_DESCRIPTION]"
        new RegExp(
          `\\s*as\\s+described\\s+below:\\s*${placeholderPattern}\\s*`,
          "gi"
        ),
        // "primarily from [WORK_LOCATION]"
        new RegExp(`\\s*primarily\\s+from\\s+${placeholderPattern}\\s*`, "gi"),
        // "entitled to [BENEFITS]"
        new RegExp(`\\s*entitled\\s+to\\s+${placeholderPattern}\\s*`, "gi"),
        // "shall receive a salary of [SALARY_AMOUNT]"
        new RegExp(
          `\\s*shall\\s+receive\\s+a\\s+salary\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "shall be reimbursed for [EXPENSES]"
        new RegExp(
          `\\s*shall\\s+be\\s+reimbursed\\s+for\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "at least [DECISION_THRESHOLD]%"
        new RegExp(`\\s*at\\s+least\\s+${placeholderPattern}\\s*%?\\s*`, "gi"),
        // "shall vest over a period of [VESTING_YEARS] years"
        new RegExp(
          `\\s*shall\\s+vest\\s+over\\s+a\\s+period\\s+of\\s+${placeholderPattern}\\s+years?\\s*`,
          "gi"
        ),
        // Just the placeholder itself as fallback
        new RegExp(`\\s*${placeholderPattern}\\s*`, "g"),
      ];

      let result = text;
      for (const pattern of removalPatterns) {
        result = result.replace(pattern, " ");
      }
      return result;
    };

    // Process all fields: remove falsy placeholders, wrap truthy placeholders in bold
    selectedTemplate.fields.forEach((field) => {
      const fieldId = field.id;
      let value = formData[fieldId];

      // If empty and field has a default value, use it
      if (!value?.trim() && field.defaultValue !== undefined) {
        value =
          typeof field.defaultValue === "function"
            ? field.defaultValue()
            : field.defaultValue;
      }

      // Check if value is falsy (empty, null, undefined, or just whitespace)
      const isFalsy = !value || !value.toString().trim();

      // For falsy values, remove the placeholder and its context
      if (isFalsy) {
        const placeholder = `[${fieldId.toUpperCase()}]`;
        contractText = removePlaceholderWithContext(
          contractText,
          placeholder,
          fieldId
        );
        return;
      }

      // For truthy values, wrap placeholder in <strong> tags
      // Backend will replace [PLACEHOLDER] with value, leaving <strong>value</strong>
      const placeholderPattern = `\\[${fieldId.toUpperCase()}\\]`;
      const boldPlaceholder = `<strong>[${fieldId.toUpperCase()}]</strong>`;
      contractText = contractText.replace(
        new RegExp(placeholderPattern, "g"),
        boldPlaceholder
      );
    });

    // Clean up spacing while preserving paragraph breaks
    contractText = contractText
      // First, normalize line breaks (convert \r\n to \n)
      .replace(/\r\n/g, "\n")
      // Preserve paragraph breaks (double newlines) by converting to a temporary marker
      .replace(/\n\n+/g, "{{PARAGRAPH_BREAK}}")
      // Remove single newlines that aren't paragraph breaks (convert to space)
      .replace(/\n/g, " ")
      // Clean up multiple spaces within paragraphs
      .replace(/[ \t]+/g, " ")
      // Clean up spacing around punctuation
      .replace(/\s+\./g, ".")
      .replace(/\s+,/g, ",")
      .replace(/\s+:/g, ":")
      .replace(/\s+;/g, ";")
      // Restore paragraph breaks with proper spacing (double line break)
      .replace(/{{PARAGRAPH_BREAK}}/g, "\n\n")
      // Clean up any remaining multiple spaces
      .replace(/[ \t]{2,}/g, " ")
      // Remove trailing spaces from lines
      .replace(/[ \t]+$/gm, "")
      // Ensure proper spacing between paragraphs (add blank line if needed)
      .replace(/\n\n/g, "\n\n")
      .trim();

    return contractText;
  };

  const fillContractPlaceholders = (baseText?: string) => {
    if (!selectedTemplate) return "";

    let contractText = baseText || editablePreview; // Use provided text or fallback to editablePreview

    // Helper function to remove common phrases around placeholders
    const removePlaceholderWithContext = (
      text: string,
      placeholder: string,
      fieldId: string
    ): string => {
      const placeholderPattern = `\\[${fieldId.toUpperCase()}\\]`;

      // Common patterns to remove with context
      const removalPatterns = [
        // "for the purpose of [PURPOSE]"
        new RegExp(
          `\\s*for\\s+the\\s+purpose\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "as of [DATE]"
        new RegExp(`\\s*as\\s+of\\s+${placeholderPattern}\\s*`, "gi"),
        // "[DURATION] years"
        new RegExp(`\\s*${placeholderPattern}\\s+years?\\s*`, "gi"),
        // "[DURATION] months?"
        new RegExp(`\\s*${placeholderPattern}\\s+months?\\s*`, "gi"),
        // "per [PAYMENT_UNIT]"
        new RegExp(`\\s*per\\s+${placeholderPattern}\\s*`, "gi"),
        // "payable [PAYMENT_TERMS]"
        new RegExp(`\\s*payable\\s+${placeholderPattern}\\s*`, "gi"),
        // "at [INTEREST_RATE]%"
        new RegExp(`\\s*at\\s+${placeholderPattern}\\s*%?\\s*`, "gi"),
        // "with [CLIFF_MONTHS] month"
        new RegExp(`\\s*with\\s+${placeholderPattern}\\s+month\\s*`, "gi"),
        // "over a period of [VESTING_YEARS] years"
        new RegExp(
          `\\s*over\\s+a\\s+period\\s+of\\s+${placeholderPattern}\\s+years?\\s*`,
          "gi"
        ),
        // "until [END_DATE]"
        new RegExp(`\\s*until\\s+${placeholderPattern}\\s*`, "gi"),
        // "from [START_DATE]"
        new RegExp(`\\s*from\\s+${placeholderPattern}\\s*`, "gi"),
        // "on [DATE]"
        new RegExp(`\\s*on\\s+${placeholderPattern}\\s*`, "gi"),
        // "in the position of [JOB_TITLE]"
        new RegExp(
          `\\s*in\\s+the\\s+position\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "in the State of [JURISDICTION]"
        new RegExp(
          `\\s*in\\s+the\\s+State\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "under the name [COMPANY_NAME]"
        new RegExp(
          `\\s*under\\s+the\\s+name\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "engaged in the business of [BUSINESS_DESCRIPTION]"
        new RegExp(
          `\\s*engaged\\s+in\\s+the\\s+business\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "as a [TYPE_OF_ENTITY]"
        new RegExp(`\\s*as\\s+a\\s+${placeholderPattern}\\s*`, "gi"),
        // "with [NOTICE_PERIOD] written notice"
        new RegExp(
          `\\s*with\\s+${placeholderPattern}\\s+written\\s+notice\\s*`,
          "gi"
        ),
        // "For [NON_COMPETE_DURATION] months"
        new RegExp(`\\s*[Ff]or\\s+${placeholderPattern}\\s+months?\\s*`, "gi"),
        // "including [KEY_RESPONSIBILITIES]"
        new RegExp(`\\s*including\\s+${placeholderPattern}\\s*`, "gi"),
        // "as described below: [SERVICE_DESCRIPTION]"
        new RegExp(
          `\\s*as\\s+described\\s+below:\\s*${placeholderPattern}\\s*`,
          "gi"
        ),
        // "primarily from [WORK_LOCATION]"
        new RegExp(`\\s*primarily\\s+from\\s+${placeholderPattern}\\s*`, "gi"),
        // "entitled to [BENEFITS]"
        new RegExp(`\\s*entitled\\s+to\\s+${placeholderPattern}\\s*`, "gi"),
        // "shall receive a salary of [SALARY_AMOUNT]"
        new RegExp(
          `\\s*shall\\s+receive\\s+a\\s+salary\\s+of\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "shall be reimbursed for [EXPENSES]"
        new RegExp(
          `\\s*shall\\s+be\\s+reimbursed\\s+for\\s+${placeholderPattern}\\s*`,
          "gi"
        ),
        // "at least [DECISION_THRESHOLD]%"
        new RegExp(`\\s*at\\s+least\\s+${placeholderPattern}\\s*%?\\s*`, "gi"),
        // "shall vest over a period of [VESTING_YEARS] years"
        new RegExp(
          `\\s*shall\\s+vest\\s+over\\s+a\\s+period\\s+of\\s+${placeholderPattern}\\s+years?\\s*`,
          "gi"
        ),
        // Just the placeholder itself as fallback
        new RegExp(`\\s*${placeholderPattern}\\s*`, "g"),
      ];

      let result = text;
      for (const pattern of removalPatterns) {
        result = result.replace(pattern, " ");
      }
      return result;
    };

    // Replace all placeholders with actual values
    // Process ALL fields to ensure no placeholders remain for backend to process
    selectedTemplate.fields.forEach((field) => {
      const fieldId = field.id;
      let value = formData[fieldId];

      // If empty and field has a default value, use it
      if (!value?.trim() && field.defaultValue !== undefined) {
        value =
          typeof field.defaultValue === "function"
            ? field.defaultValue()
            : field.defaultValue;
      }

      // Check if value is falsy (empty, null, undefined, or just whitespace)
      const isFalsy = !value || !value.toString().trim();

      // For ALL falsy values, remove the placeholder and its context (don't render in PDF)
      if (isFalsy) {
        const placeholder = `[${fieldId.toUpperCase()}]`;
        contractText = removePlaceholderWithContext(
          contractText,
          placeholder,
          fieldId
        );
        return;
      }

      // For truthy values, wrap in <strong> tags for bold formatting in PDF
      value = `<strong>${value}</strong>`;

      // Replace placeholder with value - escape brackets in placeholder pattern
      const placeholderPattern = `\\[${fieldId.toUpperCase()}\\]`;
      contractText = contractText.replace(
        new RegExp(placeholderPattern, "g"),
        value
      );
    });

    // Clean up spacing while preserving paragraph breaks
    contractText = contractText
      // First, normalize line breaks (convert \r\n to \n)
      .replace(/\r\n/g, "\n")
      // Preserve paragraph breaks (double newlines) by converting to a temporary marker
      .replace(/\n\n+/g, "{{PARAGRAPH_BREAK}}")
      // Remove single newlines that aren't paragraph breaks (convert to space)
      .replace(/\n/g, " ")
      // Clean up multiple spaces within paragraphs
      .replace(/[ \t]+/g, " ")
      // Clean up spacing around punctuation
      .replace(/\s+\./g, ".")
      .replace(/\s+,/g, ",")
      .replace(/\s+:/g, ":")
      .replace(/\s+;/g, ";")
      // Restore paragraph breaks with proper spacing (double line break)
      .replace(/{{PARAGRAPH_BREAK}}/g, "\n\n")
      // Clean up any remaining multiple spaces
      .replace(/[ \t]{2,}/g, " ")
      // Remove trailing spaces from lines
      .replace(/[ \t]+$/gm, "")
      // Ensure proper spacing between paragraphs (add blank line if needed)
      .replace(/\n\n/g, "\n\n")
      .trim();

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

  const handleGenerateContract = async () => {
    try {
      setIsGenerating(true);

      // If in edit mode, we're updating an existing contract
      if (editMode) {
        // Remove placeholders for falsy fields, but keep placeholders for truthy fields
        // so backend can fill them from the data object
        const processedContract = removeFalsyPlaceholders(editableContract);

        // Prepare the edit payload
        const editPayload = {
          templateId: editMode.templateId,
          originalData: editMode.formData, // Use the original data from editMode
          updates: {
            data: mapDataForApi(formData), // Use the updated form data
            customContent: processedContract, // Keep placeholders for backend to fill
          },
          contractId: editMode.contractId, // Include the contract ID
          saveToDb: true, // Make sure to save to database
        };

        // Call the edit endpoint to save changes
        const editResponse = await editContract(editPayload);

        toast.success("Contract updated successfully!");
      } else {
        // Creating a new contract
        // Remove placeholders for falsy fields, but keep placeholders for truthy fields
        // so backend can fill them from the data object
        const baseText =
          step === "edit" && editableContract.trim()
            ? editableContract
            : editablePreview;

        // Remove placeholders for falsy fields only, keep others for backend to fill
        const processedContract = removeFalsyPlaceholders(baseText);

        const contractPayload = {
          templateId: selectedTemplate!.id,
          data: mapDataForApi(formData),
          customContent: processedContract, // Keep placeholders for backend to fill
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
                      className={` text-xs pb-1 bg-blue-100 text-blue-700`}
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
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    size="sm"
                    className={
                      template.isPremium
                        ? "bg-premium-purple-700 hover:bg-premium-purple-800 text-white"
                        : "bg-[#252952] hover:bg-[#161930] text-white"
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
            <div className="w-12 h-12 rounded-full bg-[#252952] flex items-center justify-center flex-shrink-0">
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
            className="bg-[#252952] hover:bg-[#161930] text-white"
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
    // Only check required fields (explicitly marked as required: true)
    const allRequiredFieldsFilled = selectedTemplate.fields
      .filter((field) => field.required === true)
      .every((field) => formData[field.id]?.trim());

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
              disabled={!allRequiredFieldsFilled || isGenerating}
              className="bg-[#252952] hover:bg-[#161930] text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Create Contract
                </>
              )}
            </Button>
          </div>

          {!allRequiredFieldsFilled && (
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
      <TooltipProvider>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl mb-1">
                Review & Edit {selectedTemplate.title}
              </h1>
              <p className="text-gray-600">
                Edit the contract details and preview text
              </p>
            </div>
          </div>

          {/* Form Inputs Section */}
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
                        {field.required !== false && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
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

          {/* Contract Preview Section */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Editable Contract Text
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
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

          <div className="flex items-center justify-between gap-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Contract ready to finalize?
                </p>
                <p className="text-sm text-gray-600">
                  Save your changes or copy the text to use elsewhere
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCopyText}
                size="lg"
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
                className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)]  text-white rounded-xl shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editMode ? "Updating..." : "Generating..."}
                  </>
                ) : (
                  <>
                    {editMode ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Contract
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Contract PDF
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return null;
}
