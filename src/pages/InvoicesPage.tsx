import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  FileText, 
  Download, 
  Eye,
  Plus,
  Search,
  Calendar,
  Edit,
  Trash2,
  Send,
  DollarSign,
  User,
  Building
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-001',
      client: 'Acme Corp',
      amount: 2500,
      status: 'paid',
      date: 'Oct 1, 2025',
      dueDate: 'Oct 15, 2025',
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      client: 'TechStart Inc',
      amount: 1200,
      status: 'pending',
      date: 'Oct 15, 2025',
      dueDate: 'Oct 30, 2025',
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      client: 'StartupXYZ',
      amount: 850,
      status: 'overdue',
      date: 'Sep 20, 2025',
      dueDate: 'Sep 30, 2025',
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client: '',
    amount: '',
    description: '',
    dueDate: '',
  });

  const handleCreateInvoice = () => {
    const invoice: Invoice = {
      id: (invoices.length + 1).toString(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      client: newInvoice.client,
      amount: parseFloat(newInvoice.amount),
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: new Date(newInvoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    
    setInvoices([...invoices, invoice]);
    setNewInvoice({ client: '', amount: '', description: '', dueDate: '' });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Invoice Generator</h2>
          <p className="text-gray-600">
            Create and manage professional invoices for your business
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Invoice</DialogTitle>
              <DialogDescription>
                Generate a professional invoice for your client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  placeholder="Enter client name"
                  value={newInvoice.client}
                  onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                  className="rounded-xl border-2 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  className="rounded-xl border-2 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter service description"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  className="rounded-xl border-2 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  className="rounded-xl border-2 border-gray-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateInvoice}
                className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl"
                disabled={!newInvoice.client || !newInvoice.amount}
              >
                Create Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'paid').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {invoices.filter(i => i.status === 'pending').length}
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
                  ${invoices.reduce((sum, i) => i.status === 'paid' ? sum + i.amount : sum, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-10 border-2 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Recent Invoices</h3>
        
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Invoice Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-deep-blue-50 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-deep-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">{invoice.client}</p>
                    </div>
                  </div>
                </div>

                {/* Amount & Status */}
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${invoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge 
                      className={
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Due Date</p>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {invoice.dueDate}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="border-2 border-gray-200 rounded-xl hover:bg-gray-50">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-200 rounded-xl hover:bg-gray-50">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {invoice.status === 'pending' && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  )}
                  <Button className="bg-deep-blue hover:bg-deep-blue-dark text-white rounded-xl">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}