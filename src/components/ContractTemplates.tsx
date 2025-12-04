import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Download,
  FileText,
  Lock,
  Check,
  Copy,
  Edit,
  Info,
} from "lucide-react";
import { useApiService } from "../services/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { contractTemplates } from "../constants";
import React from "react";

export type ContractTemplatesStep = "select" | "preview" | "customize" | "edit";

type Language = "en" | "alb";

interface ContractTemplate {
  id: string;
  title: {
    en: string;
    alb: string;
  };
  description: {
    en: string;
    alb: string;
  };
  category: {
    en: string;
    alb: string;
  };
  downloads: number;
  isPremium: boolean;
  previewContent: {
    en: string;
    alb: string;
  };
  fields: {
    id: string;
    label: string;
    placeholder: string;
    placeholderAlb?: string;
    type: string;
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
  onLanguageChange?: (language: Language) => void;
  initialLanguage?: Language;
}

export function ContractTemplates({
  onSuccess,
  editMode,
  onStepChange,
  onLanguageChange,
  initialLanguage = "en",
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  useEffect(() => {
    if (editMode && selectedTemplate) {
      // Set the editable preview to the contract text for editing
      setEditablePreview(editMode.contractText);
      // Also set the editable contract
      setEditableContract(editMode.contractText);
      // Reset validation state when entering edit mode
      setTouched({});
      setErrors({});
    }
  }, [editMode, selectedTemplate]);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // Update preview content when language changes
  useEffect(() => {
    if (selectedTemplate && step !== "edit") {
      setEditablePreview(selectedTemplate.previewContent[language]);
    }
  }, [language, selectedTemplate, step]);

  const { generateContract, exportContractPdf, editContract } = useApiService();

  const handleSelectTemplate = (template: ContractTemplate) => {
    if (template.isPremium) {
      toast.info("This is a premium template. Upgrade to access it!");
      return;
    }
    setSelectedTemplate(template);
    setEditablePreview(template.previewContent[language]);
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
    // Reset validation state
    setTouched({});
    setErrors({});
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
        // Prepare the edit payload
        const editPayload = {
          templateId: editMode.templateId,
          originalData: editMode.formData, // Use the original data from editMode
          updates: {
            data: mapDataForApi(formData), // Use the updated form data
            // Keep all placeholders (even if their values are empty) so they remain visible
            // in the saved contract text. Backend can decide how to handle them.
            customContent: editableContract,
            language: language,
          },
          contractId: editMode.contractId, // Include the contract ID
          saveToDb: true, // Make sure to save to database
        };

        // Call the edit endpoint to save changes
        const editResponse = await editContract(editPayload);

        toast.success("Contract updated successfully!");
      } else {
        // Creating a new contract
        const baseText =
          step === "edit" && editableContract.trim()
            ? editableContract
            : editablePreview;

        const contractPayload = {
          templateId: selectedTemplate!.id,
          data: mapDataForApi(formData),
          // Keep all placeholders in the content (even when values are empty)
          // so they stay visible in the generated contract.
          customContent: baseText,
          language: language,
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
      // Reset validation state
      setTouched({});
      setErrors({});

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
    // Mark field as touched when user starts typing
    if (!touched[fieldId]) {
      setTouched({ ...touched, [fieldId]: true });
    }
  };

  // Validation logic similar to InvoicesPage - validates ALL fields
  const validate = useMemo(() => {
    if (!selectedTemplate) {
      return { errs: {}, valid: true };
    }

    const errs: Record<string, string> = {};

    // Validate only required fields
    // Numeric fields that should allow 1 character minimum
    const numericFields = [
      "duration",
      "vesting_years",
      "cliff_months",
      "percentage_1",
      "percentage_2",
      "percentage_3",
      "decision_threshold",
      "salary_amount",
      "non_compete_duration",
      "amount",
      "interest_rate",
      "hours_per_week",
    ];

    selectedTemplate.fields.forEach((field) => {
      // Only validate required fields
      if (field.required === true) {
        const value = formData[field.id]?.trim() || "";

        // Special case: numeric fields allow 1 character minimum
        const minLength = numericFields.includes(field.id) ? 1 : 2;

        if (!value || value.length < minLength) {
          errs[field.id] = `This field is required (minimum ${minLength} ${
            minLength === 1 ? "character" : "characters"
          })`;
        } else if (value.length > 500) {
          errs[field.id] = "Maximum 500 characters allowed";
        }
      }
    });

    return { errs, valid: Object.keys(errs).length === 0 };
  }, [formData, selectedTemplate]);

  useEffect(() => {
    setErrors(validate.errs);
  }, [validate]);

  // Render template selection
  if (step === "select") {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Breadcrumb */}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl mb-2">
            {language === "en"
              ? "Contract Templates"
              : "Shabllonet e Kontratave"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {language === "en"
              ? "Professional legal templates for your startup"
              : "Shabllone profesionale ligjore për startup-in tuaj"}
          </p>
        </div>
        <div className="flex justify-end">
          <div>
            <Label
              htmlFor="language-select-template"
              className="text-xs text-gray-600 mb-1 block"
            >
              Language
            </Label>
            <Select
              value={language}
              onValueChange={(value) => handleLanguageChange(value as Language)}
            >
              <SelectTrigger
                id="language-select-template"
                className="w-40 h-10 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="alb">Albanian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Hint */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              {language === "en" ? (
                <>
                  <strong>Important:</strong> Values inside square brackets{" "}
                  <span className="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                    [LIKE THIS]
                  </span>{" "}
                  cannot be edited directly in the preview. Use the form fields
                  above to fill in the details, or remove the bracketed text
                  entirely if you don&apos;t need it.
                </>
              ) : (
                <>
                  <strong>E rëndësishme:</strong> Vlerat brenda kllapave katrore{" "}
                  <span className="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                    [SI KJO]
                  </span>{" "}
                  nuk mund të redaktohen drejtpërdrejt në parapamje. Përdorni
                  fushat e formularit më sipër për të plotësuar detajet, ose
                  hiqni tekstin e kllapave plotësisht nëse nuk ju nevojitet.
                </>
              )}
            </p>
          </div>
        </div>

        {/* 2x2 Grid of Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {contractTemplates.map((template) => (
            <Card
              key={template.id}
              className={`border shadow-sm hover:shadow-md transition-shadow ${
                template.isPremium
                  ? "border-blue-200 bg-blue-50/20"
                  : "border-gray-200 bg-white hover:border-blue-200"
              }`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      template.isPremium ? "bg-blue-100" : "bg-blue-100"
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        template.isPremium
                          ? "text-premium-blue-700"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs pb-1 bg-blue-100 text-blue-700`}
                    >
                      {template.category[language]}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {template.title[language]}
                    </h3>
                    {template.isPremium && (
                      <Badge className="bg-blue-700 text-white text-xs px-2 py-0.5 w-fit">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {template.description[language]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    size="sm"
                    className={"bg-[#252952] hover:bg-[#161930] text-white "}
                  >
                    {template.isPremium ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {language === "en" ? "Upgrade" : "Përmirëso"}
                      </>
                    ) : language === "en" ? (
                      "Use Template"
                    ) : (
                      "Përdor Shabllonin"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Friendly UX Copy */}
        <div className="text-center mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">
            <strong>
              {language === "en"
                ? "Your ready-to-use legal template in minutes."
                : "Shablloni juaj ligjor i gatshëm për përdorim në minuta."}
            </strong>{" "}
            {language === "en"
              ? "Fill in your details to generate your contract."
              : "Plotësoni detajet tuaja për të gjeneruar kontratën tuaj."}
          </p>
        </div>
      </div>
    );
  }

  // Render template preview
  if (step === "preview" && selectedTemplate) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl mb-1">
              {selectedTemplate.title[language]}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {language === "en"
                ? "Preview and edit before customizing"
                : "Parapamje dhe redakto para personalizimit"}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <div>
            <Label
              htmlFor="language-select"
              className="text-xs text-gray-600 mb-1 block"
            >
              {language === "en" ? "Language" : "Gjuha"}
            </Label>
            <Select
              value={language}
              onValueChange={(value) => handleLanguageChange(value as Language)}
            >
              <SelectTrigger id="language-select" className="w-40 h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="alb">Albanian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base sm:text-lg">
                {language === "en" ? "Template Preview" : "Parapamje Shablloni"}
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 w-fit"
              >
                <Edit className="w-3 h-3 mr-1" />
                {language === "en" ? "Editable" : "E Redaktueshme"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Textarea
              value={editablePreview}
              onChange={(e) => setEditablePreview(e.target.value)}
              className="w-full min-h-[300px] sm:min-h-[450px] font-mono text-xs sm:text-sm leading-relaxed resize-none"
              placeholder={
                language === "en"
                  ? "Your template preview..."
                  : "Parapamja e shabllonit tuaj..."
              }
            />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#252952] flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm sm:text-base text-gray-900">
                {language === "en"
                  ? "Ready to customize?"
                  : "Gati për personalizim?"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {language === "en"
                  ? "Fill in your details to generate the contract"
                  : "Plotësoni detajet tuaja për të gjeneruar kontratën"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleContinueToCustomize}
            className="bg-[#252952] hover:bg-[#161930]  text-white w-full sm:w-auto"
            size="lg"
          >
            {language === "en"
              ? "Continue to Customize"
              : "Vazhdo te Personalizimi"}
          </Button>
        </div>
      </div>
    );
  }

  // Render customization form
  if (step === "customize" && selectedTemplate) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="mt-1 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl mb-1">
              Customize {selectedTemplate.title[language]}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {language === "en"
                ? "Fill in the required information"
                : "Plotësoni informacionin e kërkuar"}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <div>
            <Label
              htmlFor="language-select-customize"
              className="text-xs text-gray-600 mb-1 block"
            >
              {language === "en" ? "Language" : "Gjuha"}
            </Label>
            <Select
              value={language}
              onValueChange={(value) => handleLanguageChange(value as Language)}
            >
              <SelectTrigger
                id="language-select-customize"
                className="w-40 h-10 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="alb">Albanian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              {language === "en" ? "Contract Details" : "Detajet e Kontratës"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplate.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="" htmlFor={field.id}>
                      {field.label}
                      {field.required === true && (
                        <span className="text-red-500 ml-[-4px]">*</span>
                      )}
                    </Label>
                  </div>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      onBlur={() =>
                        setTouched({ ...touched, [field.id]: true })
                      }
                      placeholder={
                        language === "en"
                          ? field.placeholder
                          : field.placeholderAlb ?? field.placeholder
                      }
                      rows={3}
                      className="w-full placeholder:text-gray-400"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ""}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      onBlur={() =>
                        setTouched({ ...touched, [field.id]: true })
                      }
                      placeholder={
                        language === "en"
                          ? field.placeholder
                          : field.placeholderAlb ?? field.placeholder
                      }
                      className="w-full placeholder:text-gray-400"
                    />
                  )}
                  {touched[field.id] && errors[field.id] && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors[field.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => {
              // Mark all fields as touched when trying to submit
              const allFields = selectedTemplate.fields.map((f) => f.id);
              const newTouched: Record<string, boolean> = { ...touched };
              allFields.forEach((fieldId) => {
                newTouched[fieldId] = true;
              });
              setTouched(newTouched);

              if (validate.valid) {
                handleGenerateContract();
              } else {
                toast.error(
                  language === "en"
                    ? "Please fix the validation errors"
                    : "Ju lutemi korrigjoni gabimet e validimit"
                );
              }
            }}
            size="lg"
            disabled={isGenerating}
            className="bg-[#252952] hover:bg-[#161930] text-white w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">
                  {language === "en" ? "Creating..." : "Duke krijuar..."}
                </span>
                <span className="sm:hidden">
                  {language === "en" ? "Creating..." : "Duke krijuar..."}
                </span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                <span className="sm:inline">
                  {language === "en" ? "Create Contract" : "Krijo Kontratën"}
                </span>
              </>
            )}
          </Button>
        </div>

        {!validate.valid && (
          <p className="text-xs sm:text-sm text-center text-gray-500">
            {language === "en"
              ? "Please fill in all required fields (marked with *) to continue"
              : "Ju lutemi plotësoni të gjitha fushat e kërkuara (të shënuara me *) për të vazhduar"}
          </p>
        )}
      </div>
    );
  }

  // Render editable contract view
  if (step === "edit" && selectedTemplate) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl mb-1">
              Review & Edit {selectedTemplate.title[language]}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Edit the contract details and preview text
            </p>
          </div>
        </div>

        {/* Form Inputs Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              {language === "en" ? "Contract Details" : "Detajet e Kontratës"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTemplate.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="" htmlFor={field.id}>
                      {field.label}
                      {field.required === true && (
                        <span className="text-red-500 ml-[-4px]">*</span>
                      )}
                    </Label>
                  </div>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      onBlur={() =>
                        setTouched({ ...touched, [field.id]: true })
                      }
                      placeholder={
                        language === "en"
                          ? field.placeholder
                          : field.placeholderAlb ?? field.placeholder
                      }
                      rows={3}
                      className="w-full placeholder:text-gray-400"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ""}
                      onChange={(e) => updateFormData(field.id, e.target.value)}
                      onBlur={() =>
                        setTouched({ ...touched, [field.id]: true })
                      }
                      placeholder={
                        language === "en"
                          ? field.placeholder
                          : field.placeholderAlb ?? field.placeholder
                      }
                      className="w-full placeholder:text-gray-400"
                    />
                  )}
                  {touched[field.id] && errors[field.id] && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors[field.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contract Preview Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-blue-50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base sm:text-lg">
                Editable Contract Text
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 w-fit"
              >
                Fully Editable
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Textarea
              value={editableContract}
              onChange={(e) => setEditableContract(e.target.value)}
              className="w-full min-h-[300px] sm:min-h-[500px] font-mono text-xs sm:text-sm leading-relaxed placeholder:text-gray-400"
              placeholder="Your contract text will appear here..."
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm sm:text-base text-gray-900">
                Contract ready to finalize?
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Save your changes or copy the text to use elsewhere
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCopyText}
              size="lg"
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
            <Button
              onClick={() => {
                // Mark all fields as touched when trying to submit
                const allFields = selectedTemplate.fields.map((f) => f.id);
                const newTouched: Record<string, boolean> = { ...touched };
                allFields.forEach((fieldId) => {
                  newTouched[fieldId] = true;
                });
                setTouched(newTouched);

                if (validate.valid) {
                  handleGenerateContract();
                } else {
                  toast.error("Please fix the validation errors");
                }
              }}
              size="lg"
              disabled={!validate.valid || isGenerating}
              className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] text-white rounded-xl shadow-lg w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">
                    {editMode ? "Updating..." : "Generating..."}
                  </span>
                  <span className="sm:hidden">
                    {editMode ? "Updating..." : "Generating..."}
                  </span>
                </>
              ) : (
                <>
                  {editMode ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Update Contract</span>
                      <span className="sm:hidden">Update</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        Generate Contract PDF
                      </span>
                      <span className="sm:hidden">Generate PDF</span>
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
        {!validate.valid && (
          <p className="text-xs sm:text-sm text-center text-gray-500">
            {language === "en"
              ? "Please fill in all required fields (marked with *) to continue"
              : "Ju lutemi plotësoni të gjitha fushat e kërkuara (të shënuara me *) për të vazhduar"}
          </p>
        )}
      </div>
    );
  }

  return null;
}
