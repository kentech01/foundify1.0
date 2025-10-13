import { useState, useEffect } from "react";
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
import styles from "../../pages/invoices/InvoicesPage.module.scss";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
} from "lucide-react";
import { useApiService, type Invoice as ApiInvoice } from "../../services/api";
import { toast } from "sonner";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export function InvoicesPage() {
  const [companyName, setCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Date.now().toString().slice(-6)}`
  );
  const [currency, setCurrency] = useState<
    "USD" | "EUR" | "GBP" | "CAD" | "AUD"
  >("USD");
  const [notes, setNotes] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<ApiInvoice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    createInvoice,
    getInvoices,
    deleteInvoice,
    updateInvoice,
    downloadInvoicePdf,
  } = useApiService();
  const { user } = useCurrentUser();

  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // Load invoices from API
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await getInvoices(50, 0);
      if (response.success) {
        setInvoices(response.data);
      } else {
        toast.error("Failed to load invoices");
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updatedItems = [...lineItems];
    if (field === "quantity") {
      const numValue = typeof value === "string" ? parseInt(value, 10) : value;
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: isNaN(numValue) ? 1 : Math.max(1, numValue),
      };
    } else if (field === "rate") {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: isNaN(numValue) ? 0 : Math.max(0, numValue),
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setLineItems(updatedItems);
  };

  const resetForm = () => {
    setCompanyName("");
    setClientName("");
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    setCurrency("USD");
    setNotes("");
    setBankDetails("");
    setLineItems([{ description: "", quantity: 1, rate: 0 }]);
    setEditingInvoice(null);
  };

  const openEditModal = (invoice: ApiInvoice) => {
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
            quantity: Number(item.quantity) || 1,
            rate: Number(item.rate) || 0,
          }))
        : [{ description: "", quantity: 1, rate: 0 }]
    );
    setIsEditModalOpen(true);
  };

  const generateInvoice = async () => {
    if (
      !companyName ||
      !clientName ||
      lineItems.some((item) => !item.description)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const invoiceData = {
        companyName,
        clientName,
        invoiceNumber,
        currency,
        items: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        })),
        subtotal,
        tax,
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
            : "Invoice created successfully!"
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
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateInvoice = () => {
    generateInvoice();
  };

  const handleUpdateInvoice = () => {
    generateInvoice();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await deleteInvoice(id);
      if (response.success) {
        toast.success("Invoice deleted successfully");
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
      } else {
        toast.error(response.message || "Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (invoice: ApiInvoice) => {
    try {
      downloadInvoicePdf(invoice.firebaseUid, invoice.id);
    } catch (error) {
      console.error("Error previewing invoice:", error);
      toast.error("Failed to preview invoice");
    }
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update stats calculation to remove overdue-specific stat
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === "paid").length;
  const pendingInvoices = invoices.filter(
    (i) => i.status === "pending" || i.status === "draft"
  ).length;
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "pending":
      case "draft":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "overdue":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Invoice Generator
          </h2>
          <p className="text-gray-600">
            Create and manage professional invoices for your business
          </p>
        </div>
        <Dialog
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            setIsCreateModalOpen(open);
            if (open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-y-auto ">
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
                    <Label htmlFor="company">Your Company *</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your Company Inc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Client Name *</Label>
                    <Input
                      id="client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client Company"
                      required
                    />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <Label htmlFor="invoice-num">Invoice Number</Label>
                    <Input
                      id="invoice-num"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
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
                {lineItems.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <div className={styles.flexGrow}>
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(index, "description", e.target.value)
                        }
                        placeholder="Service or product name"
                        required
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
                      />
                    </div>
                    <div className={styles.amountCol}>
                      <Label>Rate ({currencySymbol})</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          updateLineItem(index, "rate", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className={styles.amountCol}>
                      <Label>Amount</Label>
                      <Input
                        readOnly
                        value={`${currencySymbol}${(
                          item.quantity * item.rate
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
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Subtotal:</span>
                    <span className={styles.summaryValue}>
                      {currencySymbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Tax (10%):</span>
                    <span className={styles.summaryValue}>
                      {currencySymbol}
                      {tax.toFixed(2)}
                    </span>
                  </div>
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
                  />
                </div>
                <div>
                  <Label htmlFor="bank-details">Bank Account Details</Label>
                  <Textarea
                    id="bank-details"
                    placeholder="Bank name, account number, routing number, SWIFT/BIC code"
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                onClick={handleCreateInvoice}
                className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
                disabled={!companyName || !clientName || isGenerating}
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
          setIsEditModalOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent className="!max-w-4xl !max-h-[90vh] overflow-y-auto rounded-2xl">
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
                  <Label htmlFor="edit-company">Your Company *</Label>
                  <Input
                    id="edit-company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Inc."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-client">Client Name *</Label>
                  <Input
                    id="edit-client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client Company"
                    required
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <Label htmlFor="edit-invoice-num">Invoice Number</Label>
                  <Input
                    id="edit-invoice-num"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
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
              {lineItems.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.flexGrow}>
                    <Label>Description *</Label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(index, "description", e.target.value)
                      }
                      placeholder="Service or product name"
                      required
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
                    />
                  </div>
                  <div className={styles.amountCol}>
                    <Label>Rate ({currencySymbol})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(index, "rate", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className={styles.amountCol}>
                    <Label>Amount</Label>
                    <Input
                      readOnly
                      value={`${currencySymbol}${(
                        item.quantity * item.rate
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
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal:</span>
                  <span className={styles.summaryValue}>
                    {currencySymbol}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tax (10%):</span>
                  <span className={styles.summaryValue}>
                    {currencySymbol}
                    {tax.toFixed(2)}
                  </span>
                </div>
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
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add any additional notes or terms (e.g., payment terms, thank you message)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-bank-details">Bank Account Details</Label>
                <Textarea
                  id="edit-bank-details"
                  placeholder="Bank name, account number, routing number, SWIFT/BIC code"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              onClick={handleUpdateInvoice}
              className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
              disabled={!companyName || !clientName || isGenerating}
            >
              {isGenerating ? "Updating..." : "Update Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalInvoices}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {paidInvoices}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingInvoices}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            className="pl-10 border-2 border-gray-200 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Recent Invoices</h3>

        {filteredInvoices.length === 0 ? (
          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No invoices found" : "No invoices yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first invoice to get started"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Invoice Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-deep-blue-50 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-deep-blue" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
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
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${invoice.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <Badge className={getStatusBadgeColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Due Date</p>
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="h-4 w-4" />
                        {invoice.dueDate ? formatDate(invoice.dueDate) : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleView(invoice)}
                      variant="outline"
                      className="border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      onClick={() => openEditModal(invoice)}
                      variant="outline"
                      className="border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {invoice.status === "pending" && (
                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    )}
                    <Button
                      onClick={() => handleView(invoice)}
                      className="bg-deep-blue hover:bg-deep-blue-dark text-white rounded-xl"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
