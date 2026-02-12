import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import styles from "./InvoicesPage.module.scss";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import {
  FileText,
  Eye,
  Plus,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  Loader2,
  Send,
  Download,
  Search,
  ArrowLeft,
  AlertTriangle,
  Calendar1,
} from "lucide-react";
import {
  apiService,
  useApiService,
  type Invoice as ApiInvoice,
} from "../../services/api";
import { toast } from "sonner";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import React from "react";

interface InvoicesPageProps {
  isPremium?: boolean;
}

interface LineItem {
  description: string;
  quantity: string; // Change from number to string
  rate: string; // Change from number to string
}

type Errors = Partial<{
  companyName: string;
  clientName: string;
  lineItems: string;
}>;

export function InvoicesPage({ isPremium = false }: InvoicesPageProps) {
  const navigate = useNavigate();
  const [invoicesCounter, setInvoicesCounter] = useState(0);

  const [companyName, setCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Date.now().toString().slice(-6)}`,
  );
  const [currency, setCurrency] = useState<
    "USD" | "EUR" | "GBP" | "CAD" | "AUD"
  >("USD");
  const [notes, setNotes] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: "", rate: "" },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchedCompany, setFetchedCompany] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<ApiInvoice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<ApiInvoice | null>(
    null,
  );

  const {
    createInvoice,
    getInvoices,
    deleteInvoice,
    updateInvoice,
    downloadInvoicePdf,
    viewInvoicePdf,
    getInvoice,
  } = useApiService();
  const { currentUser } = useCurrentUser();

  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "$",
      AUD: "$",
    };
    return symbols[currencyCode] || "$";
  };

  const currencySymbol = getCurrencySymbol(currency);

  // Validation
  const validate = useMemo(() => {
    const trimmed = {
      companyName: companyName.trim(),
      clientName: clientName.trim(),
    };

    const errs: Errors = {};

    if (
      !trimmed.companyName ||
      trimmed.companyName.length < 2 ||
      trimmed.companyName.length > 100
    ) {
      errs.companyName = "This field is required (minimum 2 characters)";
    }
    if (
      !trimmed.clientName ||
      trimmed.clientName.length < 2 ||
      trimmed.clientName.length > 100
    ) {
      errs.clientName = "This field is required (minimum 2 characters)";
    }

    // Validate line items
    const hasValidLineItem = lineItems.some(
      (item) => item.description.trim().length > 0,
    );
    if (!hasValidLineItem) {
      errs.lineItems = "At least one item with description is required";
    } else {
      // Only validate quantity and rate if we have at least one valid line item
      const hasInvalidLineItem = lineItems.some((item) => {
        if (item.description.trim().length === 0) return false; // Skip empty items
        const qty = parseFloat(item.quantity);
        const rate = parseFloat(item.rate);
        return isNaN(qty) || qty <= 0 || isNaN(rate) || rate <= 0;
      });
      if (hasInvalidLineItem) {
        errs.lineItems =
          "Quantity and rate must be valid numbers greater than 0";
      }
    }

    return { trimmed, errs, valid: Object.keys(errs).length === 0 };
  }, [companyName, clientName, lineItems]);

  useEffect(() => {
    if (submitted) {
      setErrors(validate.errs);
    }
  }, [validate, submitted]);

  // Load invoices from API
  useEffect(() => {
    getCompanyName();
    loadInvoices();
  }, []);
  const getCompanyName = async () => {
    try {
      const result = await apiService.getPitchHistory();
      const firstStartupName = result?.data?.[0]?.startupName || "";
      setFetchedCompany(firstStartupName);

      // If the user hasn't typed anything yet, prefill the company name
      setCompanyName((prev) => (prev ? prev : firstStartupName));
    } catch (error) {
      // Silent fail – invoice creation still works without a prefilled company
      console.error("Failed to preload company name for invoices:", error);
    }
  };
  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, counter } = await getInvoices(50, 0);
      setInvoicesCounter(counter);
      if (data.success) {
        setInvoices(data.data);
      } else {
        toast.error("Failed to load invoices");
      }
    } catch (error: any) {
      console.error("Error loading invoices:", error);
      // Display the actual backend error message
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to load invoices";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + quantity * rate;
  }, 0);
  const total = subtotal;

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: "1", rate: "" }]);
    // Don't mark lineItems as touched when just adding an item
    // Only mark it as touched when user interacts with line item fields
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string,
  ) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setLineItems(updatedItems);
  };

  const resetForm = () => {
    // Default company name to fetchedCompany if available
    setCompanyName(fetchedCompany || "");
    setClientName("");
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    setCurrency("USD");
    setNotes("");
    setBankDetails("");
    setLineItems([{ description: "", quantity: "", rate: "" }]);
    setEditingInvoice(null);
    setSubmitted(false);
    setErrors({});
  };

  const requirePremiumForFounderEssentials = () => {
    if (isPremium) return true;

    toast.info(
      "Founder Essentials require a Premium plan to use. Please upgrade to continue."
    );
    navigate("/upgrade");
    return false;
  };

  const openEditModal = (invoice: ApiInvoice) => {
    if (!requirePremiumForFounderEssentials()) return;
    setEditingInvoice(invoice);
    setCompanyName(invoice.companyName || "");
    setClientName(invoice.clientName || "");
    setInvoiceNumber(invoice.invoiceNumber || `INV-${invoice.id.slice(-6)}`);
    setCurrency((invoice.currency as any) || "USD");
    setNotes(invoice.notes || "");
    setBankDetails(invoice.bankDetails || "");
    setLineItems(
      invoice.items.length > 0
        ? invoice.items.map((item) => ({
            description: item.description || "",
            quantity: String(item.quantity) || "1", // Use String
            rate: item.rate && item.rate > 0 ? String(item.rate) : "", // Use String, empty if 0 or invalid
          }))
        : [{ description: "", quantity: "1", rate: "" }],
    );
    setSubmitted(false);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const generateInvoice = async () => {
    setSubmitted(true);
    if (!validate.valid) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsGenerating(true);
    try {
      const invoiceData = {
        companyName: validate.trimmed.companyName,
        clientName: validate.trimmed.clientName,
        invoiceNumber,
        currency,
        items: lineItems
          .filter((item) => item.description.trim().length > 0)
          .map((item) => ({
            description: item.description.trim(),
            quantity: parseFloat(item.quantity) || 1,
            rate: parseFloat(item.rate) || 0,
            amount:
              (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0),
          })),
        subtotal,
        total,
        notes: notes || undefined,
        bankDetails: bankDetails || undefined,
        status: "draft" as const,
      };

      let response;
      if (editingInvoice) {
        // Update existing invoice
        response = await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        // Create new invoice
        response = await createInvoice(invoiceData);
      }

      if (response.success) {
        toast.success(
          editingInvoice
            ? "Invoice updated successfully!"
            : "Invoice created successfully!",
        );

        // Reset form and close modals
        resetForm();
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);

        // Reload invoices to show the updated/new one
        await loadInvoices();
      } else {
        toast.error(response.message || "Failed to save invoice");
      }
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        responseData: error.response?.data,
        status: error.response?.status,
      });
      // Display the actual backend error message
      // Check error.message first as the API service already extracts the backend message
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save invoice. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateInvoice = () => {
    if (!requirePremiumForFounderEssentials()) return;
    generateInvoice();
  };

  const handleUpdateInvoice = () => {
    generateInvoice();
  };

  const handleDeleteClick = (invoice: ApiInvoice) => {
    if (!requirePremiumForFounderEssentials()) return;
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      const response = await deleteInvoice(invoiceToDelete.id);
      if (response.success) {
        toast.success("Invoice deleted successfully");
        setInvoices(
          invoices.filter((invoice) => invoice.id !== invoiceToDelete.id),
        );
      } else {
        toast.error(response.message || "Failed to delete invoice");
      }
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      // Display the actual backend error message
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete invoice";
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleView = async (invoice: ApiInvoice) => {
    if (!requirePremiumForFounderEssentials()) return;
    setViewingId(invoice.id);
    try {
      await viewInvoicePdf(invoice.firebaseUid, invoice.id);
    } catch (error: any) {
      console.error("Error viewing invoice:", error);
      // Display the actual backend error message
      const errorMessage = error.message || "Failed to preview invoice";
      toast.error(errorMessage);
    } finally {
      setViewingId(null);
    }
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.companyName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Update stats calculation to remove overdue-specific stat
  // const totalInvoices = invoices.length;
  // const paidInvoices = invoices.filter((i) => i.status === "paid").length;
  // const pendingInvoices = invoices.filter(
  //   (i) => i.status === "pending" || i.status === "draft"
  // ).length;

  // const totalRevenue = invoices.reduce((sum, i) => {
  //   // Convert all currencies to USD for consistent calculation
  //   const conversionRates: Record<string, number> = {
  //     USD: 1,
  //     EUR: 1.1,
  //     GBP: 1.25,
  //     CAD: 0.75,
  //     AUD: 0.65,
  //   };

  //   const rate = conversionRates[i.currency] || 1;
  //   return sum + i.total * rate;
  // }, 0);

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString();
  // };

  const handleDownload = async (invoice: ApiInvoice) => {
    if (!requirePremiumForFounderEssentials()) return;
    setDownloadingId(invoice.id);
    try {
      await downloadInvoicePdf(invoice.firebaseUid, invoice.id);
      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      console.error("Error downloading invoice:", error);
      // Display the actual backend error message
      const errorMessage = error.message || "Failed to download invoice";
      toast.error(errorMessage);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading invoices...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header: Back + Title on left, Action button on right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Invoice Generator
            </h2>
            <p className="text-gray-600">
              Create and manage professional invoices for your company
            </p>
          </div>
        </div>
        <Dialog
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            // Allow closing even during generation
            if (!open && isGenerating) {
              // User wants to close during generation - allow it
              setIsGenerating(false);
            }
            setIsCreateModalOpen(open);
            if (open) {
              resetForm();
              setSubmitted(false);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className=" bg-[#252952] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110 "
              disabled={invoicesCounter > 20}
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent
            className="!w-[calc(100%-3rem)] lg:!w-full max-w-5xl overflow-y-auto rounded-2xl sm:mx-auto"
            onEscapeKeyDown={(e) => {
              // Allow closing with Escape even during generation
              if (isGenerating) {
                setIsGenerating(false);
              }
            }}
            onInteractOutside={(e) => {
              // Allow closing by clicking outside even during generation
              if (isGenerating) {
                setIsGenerating(false);
              }
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Create New Invoice
              </DialogTitle>
              <DialogDescription>
                Generate a professional invoice for your client
              </DialogDescription>
            </DialogHeader>

            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className={styles.details}>
                <div className={styles.twoCol}>
                  <div>
                    <Label className={styles.lableWrapper} htmlFor="company">
                      Your Company
                      <span className="text-red-500 ml-[-4px]">*</span>
                    </Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your Company Inc."
                      autoComplete="off"
                      required
                      maxLength={100}
                      className="placeholder:text-gray-400"
                    />
                    {submitted && errors.companyName && (
                      <div
                        style={{
                          color: "#b91c1c",
                          fontSize: "0.8rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {errors.companyName}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className={styles.lableWrapper} htmlFor="client">
                      Client Name
                      <span className="text-red-500 ml-[-4px]">*</span>
                    </Label>
                    <Input
                      id="client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client Company"
                      required
                      maxLength={100}
                      className="placeholder:text-gray-400"
                      autoComplete="off"
                    />
                    {submitted && errors.clientName && (
                      <div
                        style={{
                          color: "#b91c1c",
                          fontSize: "0.8rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {errors.clientName}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <Label
                      className={styles.lableWrapper}
                      htmlFor="invoice-num"
                    >
                      Invoice Number
                    </Label>
                    <Input
                      id="invoice-num"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label className={styles.lableWrapper}>Currency</Label>
                    <Select
                      value={currency}
                      onValueChange={(v) => setCurrency(v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className={styles.itemsHeader}>
                  <CardTitle>Items</CardTitle>
                  <Button onClick={addLineItem} size="sm" variant="outline">
                    <Plus className={styles.smallIcon} />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={styles.items}>
                {lineItems.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <div className={styles.flexGrow}>
                      <Label className={styles.lableWrapper}>
                        Description
                        <span className="text-red-500 ml-[-4px]">*</span>
                      </Label>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(index, "description", e.target.value)
                        }
                        placeholder="Service or product name"
                        required
                        className="placeholder:text-gray-400"
                        autoComplete="off"
                      />
                    </div>
                    <div className={styles.amountCol}>
                      <Label className={styles.lableWrapper}>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(index, "quantity", e.target.value)
                        }
                        placeholder="1"
                        className="placeholder:text-gray-400"
                        autoComplete="off"
                      />
                    </div>
                    <div className={styles.amountCol}>
                      <Label className={styles.lableWrapper}>
                        Rate ({currencySymbol})
                      </Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          updateLineItem(index, "rate", e.target.value)
                        }
                        placeholder="0.00"
                        autoComplete="off"
                      />
                    </div>
                    <div className={styles.amountCol}>
                      <Label className={styles.lableWrapper}>Amount</Label>
                      <Input
                        readOnly
                        tabIndex={-1}
                        onClick={(e) => e.preventDefault()}
                        onFocus={(e) => e.target.blur()}
                        style={{ pointerEvents: "none", cursor: "default" }}
                        value={`${currencySymbol}${(
                          (parseFloat(item.quantity) || 0) *
                          (parseFloat(item.rate) || 0)
                        ).toFixed(2)}`}
                      />
                    </div>

                    {lineItems.length > 1 && (
                      <Button
                        onClick={() => removeLineItem(index)}
                        size="sm"
                        variant="outline"
                        className={styles.removeBtn}
                      >
                        <Trash2 className={styles.smallIcon} />
                      </Button>
                    )}
                  </div>
                ))}
                {submitted && errors.lineItems && (
                  <div
                    style={{
                      color: "#b91c1c",
                      fontSize: "0.8rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {errors.lineItems}
                  </div>
                )}

                <div className={styles.summarySection}>
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total:</span>
                    <span className={styles.totalValue}>
                      {currencySymbol}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className={styles.details}>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes or terms (e.g., payment terms, thank you message)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    autoComplete="off"
                    className="placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="bank-details">Bank Account Details</Label>
                  <Textarea
                    id="bank-details"
                    placeholder="Bank name, account number, routing number, SWIFT/BIC code"
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                    autoComplete="off"
                    className="placeholder:text-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                onClick={handleCreateInvoice}
                className=" bg-[#252952]  px-4 hover:to-deep-blue-dark text-white rounded-xl"
                disabled={isGenerating}
              >
                {isGenerating ? "Creating..." : "Create Invoice"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Invoice Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          // Allow closing even during generation
          if (!open && isGenerating) {
            // User wants to close during generation - allow it
            setIsGenerating(false);
          }
          setIsEditModalOpen(open);
          if (!open) {
            resetForm();
            setSubmitted(false);
          }
        }}
      >
        <DialogContent
          className="!w-[calc(100%-3rem)] lg:!w-full max-w-5xl overflow-y-auto rounded-2xl mx-4 sm:mx-auto"
          onEscapeKeyDown={(e) => {
            // Allow closing with Escape even during generation
            if (isGenerating) {
              setIsGenerating(false);
            }
          }}
          onInteractOutside={(e) => {
            // Allow closing by clicking outside even during generation
            if (isGenerating) {
              setIsGenerating(false);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Invoice
            </DialogTitle>
            <DialogDescription>Update your invoice details</DialogDescription>
          </DialogHeader>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className={styles.details}>
              <div className={styles.twoCol}>
                <div>
                  <Label htmlFor="edit-company">
                    Your Company
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="edit-company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Inc."
                    required
                    maxLength={100}
                    autoComplete="off"
                  />
                  {submitted && errors.companyName && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors.companyName}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-client">
                    Client Name
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="edit-client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client Company"
                    required
                    maxLength={100}
                    autoComplete="off"
                  />
                  {submitted && errors.clientName && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors.clientName}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <Label htmlFor="edit-invoice-num">Invoice Number</Label>
                  <Input
                    id="edit-invoice-num"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={currency}
                    onValueChange={(v) => setCurrency(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className={styles.itemsHeader}>
                <CardTitle>Items</CardTitle>
                <Button onClick={addLineItem} size="sm" variant="outline">
                  <Plus className={styles.smallIcon} />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className={styles.items}>
              {submitted && errors.lineItems && (
                <div
                  style={{
                    color: "#b91c1c",
                    fontSize: "0.8rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {errors.lineItems}
                </div>
              )}
              {lineItems.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.flexGrow}>
                    <Label>
                      Description
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(index, "description", e.target.value)
                      }
                      placeholder="Service or product name"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className={styles.amountCol}>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(index, "quantity", e.target.value)
                      }
                      placeholder={item.quantity === "" ? "1" : undefined}
                      autoComplete="off"
                    />
                  </div>
                  <div className={styles.amountCol}>
                    <Label>Rate ({currencySymbol})</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(index, "rate", e.target.value)
                      }
                      placeholder="0.00"
                      autoComplete="off"
                    />
                  </div>
                  <div className={styles.amountCol}>
                    <Label>Amount</Label>
                    <Input
                      readOnly
                      tabIndex={-1}
                      onClick={(e) => e.preventDefault()}
                      onFocus={(e) => e.target.blur()}
                      style={{ pointerEvents: "none", cursor: "default" }}
                      value={`${currencySymbol}${(
                        (parseFloat(item.quantity) || 0) *
                        (parseFloat(item.rate) || 0)
                      ).toFixed(2)}`}
                    />
                  </div>
                  {lineItems.length > 1 && (
                    <Button
                      onClick={() => removeLineItem(index)}
                      size="sm"
                      variant="outline"
                      className={styles.removeBtn}
                    >
                      <Trash2 className={styles.smallIcon} />
                    </Button>
                  )}
                </div>
              ))}

              <div className={styles.summarySection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalValue}>
                    {currencySymbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className={styles.details}>
              <div className="flex flex-col gap-4">
                <Label className={styles.lableWrapper} htmlFor="edit-notes">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add any additional notes or terms (e.g., payment terms, thank you message)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-4"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label
                  className={styles.lableWrapper}
                  htmlFor="edit-bank-details"
                >
                  Bank Account Details
                </Label>
                <Textarea
                  id="edit-bank-details"
                  placeholder="Bank name, account number, routing number, SWIFT/BIC code"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className="mt-4"
                  autoComplete="off"
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              onClick={handleUpdateInvoice}
              className="bg-[#252952] px-6  text-white rounded-xl"
              disabled={!validate.valid || isGenerating}
            >
              {isGenerating ? "Updating..." : "Update Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalInvoices}
              </p>
            </div>
          </CardContent>
        </Card> */}

      {/* <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {paidInvoices}
              </p>
            </div>
          </CardContent>
        </Card> */}

      {/* <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingInvoices}
              </p>
            </div>
          </CardContent>
        </Card> */}

      {/* <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card> 
      </div>*/}

      {/* Search Bar */}
      <div className="mb-6">
        {invoices.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              className="pl-10 border-2 border-gray-200 rounded-xl placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Recent Invoices</h3>

        {filteredInvoices.length === 0 ? (
          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm
                  ? "No invoices found"
                  : "No invoices yet - create your first one"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm && "Try adjusting your search terms"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl"
            >
              <CardContent className="p-4 sm:p-6 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-7">
                  {/* Invoice Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-deep-blue-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-deep-blue" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {invoice.invoiceNumber ||
                            `INV-${invoice.id.slice(-6)}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {invoice.clientName || "Unknown Client"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0 mb-4 lg:mb-0">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {getCurrencySymbol(invoice.currency)}
                        {invoice.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0 mb-4 lg:mb-0">
                    <div>
                      <p className="text-sm text-gray-600">Date Created</p>
                      <p className="text-sm sm:text-sm flex items-center gap-2 font-medium text-gray-600 h-[29px]">
                        <Calendar className="h-4 w-[14px] text-gray-600" />
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "en-GB",
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
                    <Button
                      onClick={() => handleView(invoice)}
                      variant="outline"
                      size="sm"
                      className="sm:h-8 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none"
                      disabled={viewingId === invoice.id}
                    >
                      {viewingId === invoice.id ? (
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
                      onClick={() => openEditModal(invoice)}
                      variant="outline"
                      size="sm"
                      className="sm:h-8 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    {/* {invoice.status === "pending" && (
                      <Button
                        size="sm"
                        className="sm:h-8 bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1 sm:flex-none"
                      >
                        <Send className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">Send</span>
                      </Button>
                    )} */}
                    <Button
                      size="sm"
                      className="sm:h-8 bg-[#4a90e2] hover:bg-[#618dc0] text-white rounded-xl flex-1 sm:flex-none"
                      onClick={() => handleDownload(invoice)}
                      disabled={downloadingId === invoice.id}
                    >
                      {downloadingId === invoice.id ? (
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
                      onClick={() => handleDeleteClick(invoice)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-2 border-red-100 shadow-xl max-w-md">
          <AlertDialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                Delete Invoice
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base text-gray-600 mt-2">
              Are you sure you want to delete invoice{" "}
              <span className="font-semibold text-gray-900">
                "
                {invoiceToDelete?.invoiceNumber ||
                  `INV-${invoiceToDelete?.id.slice(-6)}`}
                "
              </span>
              ? This action cannot be undone and all invoice data will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:justify-end mt-6">
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className="rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
