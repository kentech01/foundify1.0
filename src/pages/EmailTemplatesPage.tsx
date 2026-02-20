import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Mail,
  Sparkles,
  Copy,
  Send,
  RefreshCw,
  Save,
  Zap,
  Users,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Target,
  Rocket,
  Heart,
  Award,
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useApiService } from '../services/api';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'investor' | 'partnership' | 'hiring' | 'customer';
  requiredFields: string[];
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'cold-investor',
    name: 'Cold Investor Outreach',
    description: 'First contact with potential investors',
    icon: TrendingUp,
    category: 'investor',
    requiredFields: ['investorName']
  },
  {
    id: 'warm-intro',
    name: 'Warm Introduction',
    description: 'Follow-up after a mutual connection',
    icon: Users,
    category: 'investor',
    requiredFields: ['investorName', 'mutualContact']
  },
  {
    id: 'meeting-followup',
    name: 'Meeting Follow-up',
    description: 'After an investor meeting or call',
    icon: MessageSquare,
    category: 'investor',
    requiredFields: ['investorName']
  },
  {
    id: 'investor-update',
    name: 'Investor Update',
    description: 'Monthly or quarterly progress update',
    icon: Rocket,
    category: 'investor',
    requiredFields: []
  },
  {
    id: 'demo-request',
    name: 'Demo Request',
    description: 'Invite investors to see your product',
    icon: Target,
    category: 'investor',
    requiredFields: ['investorName']
  },
  {
    id: 'partnership',
    name: 'Partnership Outreach',
    description: 'Explore collaboration opportunities',
    icon: Briefcase,
    category: 'partnership',
    requiredFields: ['companyName']
  },
  {
    id: 'hiring',
    name: 'Hiring Outreach',
    description: 'Reach out to potential candidates',
    icon: Award,
    category: 'hiring',
    requiredFields: ['candidateName', 'position']
  },
  {
    id: 'customer-followup',
    name: 'Customer Follow-up',
    description: 'Check in with customers post-demo',
    icon: Heart,
    category: 'customer',
    requiredFields: ['companyName']
  },
  {
    id: 'accelerator',
    name: 'Accelerator Application',
    description: 'Introduction to accelerator programs',
    icon: Rocket,
    category: 'investor',
    requiredFields: ['programName']
  },
  {
    id: 'business-intro',
    name: 'General Business Intro',
    description: 'General networking and introduction',
    icon: Building,
    category: 'partnership',
    requiredFields: ['recipientName']
  }
];

// Map frontend template IDs to backend API template IDs
const TEMPLATE_TO_BACKEND_ID: Record<string, string> = {
  'cold-investor': 'cold_outreach',
  'warm-intro': 'warm_introduction',
  'meeting-followup': 'meeting_followup',
  'investor-update': 'investor_update',
  'demo-request': 'demo_request',
  'partnership': 'cold_outreach',
  'hiring': 'cold_outreach',
  'customer-followup': 'cold_outreach',
  'accelerator': 'cold_outreach',
  'business-intro': 'cold_outreach',
};

interface StartupData {
  companyName: string;
  founderName: string;
  valueProposition: string;
  keyTraction: string;
  problemSolved?: string;
  targetAudience?: string;
  industry?: string;
  teamSize?: string;
}

interface EmailTemplatesPageProps {
  isPremium?: boolean;
}

export function EmailTemplatesPage({ isPremium = false }: EmailTemplatesPageProps) {
  const navigate = useNavigate();
  const {
    generateInvestorEmail,
    getFirstPitch,
    getPitchDetails,
    getCurrentUserProfile,
  } = useApiService();

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [savedEmails, setSavedEmails] = useState<Array<{ template: string; content: string; date: string }>>([]);
  const [startupData, setStartupData] = useState<StartupData | null>(null);
  const [startupDataLoading, setStartupDataLoading] = useState(true);

  useEffect(() => {
    const loadStartupData = async () => {
      try {
        setStartupDataLoading(true);
        const [pitch, profile] = await Promise.all([
          getFirstPitch().then((p) => (p ? getPitchDetails(p.id) : null)),
          getCurrentUserProfile().catch(() => null),
        ]);
        const data = pitch?.data;
        const companyName = data?.startupName || '';
        const founderName = profile?.displayName || 'Founder';
        const valueProposition =
          data?.mainProduct || data?.uniqueSellingPoint
            ? [data.mainProduct, data.uniqueSellingPoint].filter(Boolean).join('. ')
            : '';
        const keyTraction = data?.traction || '';
        const problemSolved = data?.problemSolved?.trim() || '';
        const targetAudience = data?.targetAudience?.trim() || '';
        const industry = data?.industry?.trim() || '';
        const teamSize = data?.teamSize?.trim() || '';
        if (companyName || valueProposition || keyTraction || problemSolved || targetAudience || industry) {
          setStartupData({
            companyName: companyName || 'My Startup',
            founderName,
            valueProposition,
            keyTraction,
            ...(problemSolved && { problemSolved }),
            ...(targetAudience && { targetAudience }),
            ...(industry && { industry }),
            ...(teamSize && { teamSize }),
          });
        } else if (profile?.displayName) {
          setStartupData({
            companyName: 'My Startup',
            founderName: profile.displayName,
            valueProposition: '',
            keyTraction: '',
          });
        }
      } catch {
        setStartupData(null);
      } finally {
        setStartupDataLoading(false);
      }
    };
    loadStartupData();
  }, [getFirstPitch, getPitchDetails, getCurrentUserProfile]);

  useEffect(() => {
    if (!startupData) return;
    setFormData((prev) => ({
      ...prev,
      ...(prev.valueProposition === undefined && startupData.valueProposition && { valueProposition: startupData.valueProposition }),
      ...(prev.keyTraction === undefined && startupData.keyTraction && { keyTraction: startupData.keyTraction }),
      ...(prev.companyName === undefined && startupData.companyName && { companyName: startupData.companyName }),
      ...(prev.yourName === undefined && startupData.founderName && { yourName: startupData.founderName }),
    }));
  }, [startupData]);

  const requirePremiumForFounderEssentials = () => {
    if (isPremium) return true;

    toast.info(
      "Founder Essentials require a Premium plan to use. Please upgrade to continue."
    );
    navigate("/upgrade");
    return false;
  };

  const generateEmail = async () => {
    if (!selectedTemplate) return;
    if (!requirePremiumForFounderEssentials()) return;

    const backendTemplateId = TEMPLATE_TO_BACKEND_ID[selectedTemplate.id] ?? 'cold_outreach';
    const companyName =
      startupData?.companyName || formData.companyName || 'My Startup';
    const yourName = startupData?.founderName || formData.yourName || 'Founder';
    const investorName = formData.investorName || formData.recipientName || formData.candidateName || 'Investor';
    const valueProposition =
      formData.valueProposition?.trim() ||
      startupData?.valueProposition?.trim() ||
      '';
    const keyTraction =
      formData.keyTraction?.trim() || startupData?.keyTraction?.trim() || '';

    if (backendTemplateId === 'cold_outreach' && !keyTraction) {
      toast.error('Key traction is required for this template', {
        description: 'Add your key metrics or traction in the form below.',
      });
      return;
    }
    if (backendTemplateId !== 'investor_update' && backendTemplateId !== 'demo_request' && valueProposition.length < 5) {
      toast.error('Company description is required', {
        description: 'Add "What does your startup do?" (at least 5 characters) or complete your pitch in Foundify.',
      });
      return;
    }
    if (investorName.length < 2) {
      toast.error('Recipient name is required', {
        description: 'Add the investor or recipient name.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateInvestorEmail({
        template: backendTemplateId,
        yourName,
        companyName,
        investorName,
        valueProposition: valueProposition || `${companyName} - see pitch for details.`,
        ...(keyTraction && { keyTraction }),
        ...(startupData?.problemSolved && { problemSolved: startupData.problemSolved }),
        ...(startupData?.targetAudience && { targetAudience: startupData.targetAudience }),
        ...(startupData?.industry && { industry: startupData.industry }),
        ...(startupData?.teamSize && { teamSize: startupData.teamSize }),
        ...(formData.mutualContact?.trim() && { mutualContact: formData.mutualContact.trim() }),
      });
      const emailContent =
        (res.subject ? `Subject: ${res.subject}\n\n` : '') + (res.body || '');
      setGeneratedEmail(emailContent);
      toast.success('Email generated with AI');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to generate email. Please try again.';
      toast.error('Email generation failed', { description: message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setGeneratedEmail('');
    setFormData((prev) => {
      const next: Record<string, string> = {};
      if (startupData?.valueProposition) next.valueProposition = startupData.valueProposition;
      if (startupData?.keyTraction) next.keyTraction = startupData.keyTraction;
      if (startupData?.companyName) next.companyName = startupData.companyName;
      if (startupData?.founderName) next.yourName = startupData.founderName;
      return { ...next };
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard!');
  };

  const handleSave = () => {
    if (selectedTemplate && generatedEmail) {
      setSavedEmails([
        {
          template: selectedTemplate.name,
          content: generatedEmail,
          date: new Date().toLocaleDateString()
        },
        ...savedEmails
      ]);
      toast.success('Email saved!');
    }
  };

  const handleSend = () => {
    if (!generatedEmail) return;
    const subject = generatedEmail.split('\n')[0].replace('Subject: ', '');
    const body = generatedEmail.split('\n').slice(1).join('\n').trim();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'investor': return 'bg-purple-100 text-purple-700';
      case 'partnership': return 'bg-blue-100 text-blue-700';
      case 'hiring': return 'bg-green-100 text-green-700';
      case 'customer': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600 mt-2">
          Ready-to-send emails generated from your startup data
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-8 border-2 border-[#4A90E2]/20 bg-gradient-to-r from-[#252952]/5 to-[#4A90E2]/5 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#252952] to-[#4A90E2] flex items-center justify-center flex-shrink-0 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Smart Email Generation</h3>
              <p className="text-sm text-gray-600">
                Select a template and we'll generate a professional email using your startup information from Foundify. 
                Minimal input required—just add recipient details and we handle the rest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Template Selection */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-gray-100 rounded-2xl sticky top-4">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">Choose Template</CardTitle>
            </CardHeader>
            <CardContent className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-2">
                {emailTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-[#4A90E2] bg-[#4A90E2]/5 shadow-lg'
                          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedTemplate?.id === template.id
                            ? 'bg-[#4A90E2] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{template.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                          <Badge className={`${getCategoryColor(template.category)} text-xs border-0`}>
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Form & Generated Email */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedTemplate ? (
            <Card className="border-2 border-dashed border-gray-300 rounded-2xl">
              <CardContent className="p-12 text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="font-semibold text-gray-900 mb-2">Select a Template</h3>
                <p className="text-gray-500">Choose an email template from the list to get started</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Input Fields */}
              <Card className="border-2 border-gray-100 rounded-2xl">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedTemplate.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
                    </div>
                    <Badge className={`${getCategoryColor(selectedTemplate.category)} border-0`}>
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Show required fields based on template */}
                    {selectedTemplate.requiredFields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label className="text-sm">
                          {field === 'investorName' && 'Investor / Recipient Name'}
                          {field === 'mutualContact' && 'Mutual Contact Name'}
                          {field === 'companyName' && 'Company Name'}
                          {field === 'candidateName' && 'Candidate Name'}
                          {field === 'position' && 'Position'}
                          {field === 'programName' && 'Program Name'}
                          {field === 'recipientName' && 'Recipient Name'}
                          {' '}
                          <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Input
                          placeholder={
                            field === 'investorName' ? 'Jane Smith' :
                            field === 'mutualContact' ? 'John Doe' :
                            field === 'companyName' ? 'Acme Corp' :
                            field === 'candidateName' ? 'Alex Johnson' :
                            field === 'position' ? 'Senior Engineer' :
                            field === 'programName' ? 'Y Combinator' :
                            field === 'recipientName' ? 'Sarah' :
                            ''
                          }
                          value={formData[field] || ''}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                          autoComplete="off"
                        />
                      </div>
                    ))}

                    {/* Optional note field for some templates */}
                    {selectedTemplate.id === 'meeting-followup' && (
                      <div className="space-y-2">
                        <Label className="text-sm">
                          Additional Note <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Textarea
                          placeholder="Any specific points you'd like to mention..."
                          value={formData.note || ''}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                          rows={3}
                          autoComplete="off"
                        />
                      </div>
                    )}

                    {/* Startup context - prefilled from Foundify pitch when available */}
                    <div className="space-y-2">
                      <Label className="text-sm">
                        What does your startup do? <span className="text-gray-400 text-xs">(used in email, optional if you have a pitch)</span>
                      </Label>
                      <Textarea
                        placeholder="e.g., AI-powered project management for remote teams"
                        value={formData.valueProposition ?? startupData?.valueProposition ?? ''}
                        onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })}
                        className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                        rows={2}
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">
                        Key traction / metrics <span className="text-gray-400 text-xs">(optional, required for Cold Outreach)</span>
                      </Label>
                      <Input
                        placeholder="e.g., $50K MRR, 1000+ users"
                        value={formData.keyTraction ?? startupData?.keyTraction ?? ''}
                        onChange={(e) => setFormData({ ...formData, keyTraction: e.target.value })}
                        className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                        autoComplete="off"
                      />
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-3">
                        ✨ We use your startup data from Foundify when available; you can edit above.
                      </p>
                      <Button
                        onClick={generateEmail}
                        disabled={isGenerating}
                        className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-xl"
                      >
                        {isGenerating ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Generating Email...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Email
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Email */}
              {generatedEmail && (
                <Card className="border-2 border-gray-100 rounded-2xl">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle>Generated Email</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateEmail}
                          className="rounded-lg border-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSave}
                          className="rounded-lg border-2"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 mb-4">
                      <Textarea
                        value={generatedEmail}
                        onChange={(e) => setGeneratedEmail(e.target.value)}
                        className="min-h-[400px] border-0 bg-transparent resize-none focus:ring-0 p-0 font-mono text-sm"
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="flex-1 rounded-xl border-2"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Email
                      </Button>
                      <Button
                        onClick={handleSend}
                        className="flex-1 bg-[#4A90E2] hover:bg-[#3a7bc8] text-white rounded-xl"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Open in Email Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
