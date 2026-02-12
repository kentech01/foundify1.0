import { useState } from 'react';
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

// Mock startup data (this would come from user's pitch/profile)
const mockStartupData = {
  name: 'TechVenture AI',
  industry: 'AI/ML',
  description: 'An AI-powered platform that helps startups automate their pitch creation and investor outreach',
  traction: '1,200 active users, $15K MRR, 40% month-over-month growth',
  fundingStage: 'Seed',
  founderName: 'Sarah Chen',
  founderTitle: 'Founder & CEO'
};

interface EmailTemplatesPageProps {
  isPremium?: boolean;
}

export function EmailTemplatesPage({ isPremium = false }: EmailTemplatesPageProps) {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [savedEmails, setSavedEmails] = useState<Array<{ template: string; content: string; date: string }>>([]);

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
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    let emailContent = '';

    // Generate email based on template using startup data
    switch (selectedTemplate.id) {
      case 'cold-investor':
        emailContent = `Subject: ${mockStartupData.name} - ${mockStartupData.industry} Investment Opportunity

Dear ${formData.investorName || '[Investor Name]'},

I hope this email finds you well. My name is ${mockStartupData.founderName}, ${mockStartupData.founderTitle} of ${mockStartupData.name}.

We've built ${mockStartupData.description}. Based on your portfolio's focus on ${mockStartupData.industry}, I believe we'd be a strong fit for your investment thesis.

Key highlights:
• ${mockStartupData.traction}
• Solving a critical pain point in the startup ecosystem
• Strong product-market fit with proven retention metrics

We're currently raising our ${mockStartupData.fundingStage} round. I'd love to share our pitch deck and discuss how ${mockStartupData.name} aligns with your investment strategy.

Would you be available for a 15-minute introductory call next week?

Best regards,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'warm-intro':
        emailContent = `Subject: Introduction via ${formData.mutualContact || '[Mutual Contact]'}

Dear ${formData.investorName || '[Investor Name]'},

${formData.mutualContact || '[Mutual Contact]'} suggested I reach out to you regarding ${mockStartupData.name}.

I'm ${mockStartupData.founderName}, and we've developed ${mockStartupData.description}. We're currently seeing ${mockStartupData.traction}.

${formData.mutualContact} mentioned your interest in ${mockStartupData.industry} companies and thought our work might align well with your investment focus.

I'd love to share our story and get your insights. Would you have 20 minutes for a quick call in the coming weeks?

Looking forward to connecting,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'meeting-followup':
        emailContent = `Subject: Thank You - Following Up on Our Conversation

Dear ${formData.investorName || '[Investor Name]'},

Thank you for taking the time to meet with me yesterday. I really enjoyed our conversation about ${mockStartupData.name} and hearing your insights on the ${mockStartupData.industry} space.

As discussed, here are the key points we covered:
• Our current traction: ${mockStartupData.traction}
• The ${mockStartupData.fundingStage} round we're raising
• Next milestones and growth strategy

I've attached our pitch deck and financial projections as promised. ${formData.note ? `\n\n${formData.note}` : ''}

Please let me know if you need any additional information. I'm happy to arrange a follow-up call or product demo at your convenience.

Thank you again for your time and consideration.

Best regards,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'investor-update':
        emailContent = `Subject: ${mockStartupData.name} - Q4 2024 Update

Dear Investors,

I wanted to share our latest progress and key metrics from this quarter.

📊 Metrics Update:
• ${mockStartupData.traction}
• Expanding into new market segments
• Strong unit economics and improving retention

🎯 Recent Achievements:
• Launched major product features
• Onboarded key enterprise customers
• Strengthened our team with strategic hires

📅 Next Quarter Focus:
• Scaling growth channels
• Product expansion
• Team building in engineering and sales

As always, we're grateful for your support and partnership. Please feel free to reach out if you'd like to discuss anything in detail.

Best,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'demo-request':
        emailContent = `Subject: ${mockStartupData.name} - Product Demo Invitation

Dear ${formData.investorName || '[Investor Name]'},

Following our recent conversation, I'd like to invite you to a personalized demo of ${mockStartupData.name}.

The demo will showcase:
• Our core platform and key features
• Real-world use cases and customer success stories
• Our technology stack and competitive advantages
• Growth roadmap and market opportunity

Current traction: ${mockStartupData.traction}

I can walk you through the product in about 30 minutes and leave time for Q&A. Would any of these times work for you?
• [Time Option 1]
• [Time Option 2]
• [Time Option 3]

Or feel free to suggest a time that works better for your schedule.

Looking forward to showing you what we've built!

Best,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'partnership':
        emailContent = `Subject: Partnership Opportunity - ${mockStartupData.name} × ${formData.companyName || '[Company]'}

Dear ${formData.recipientName || 'Team'},

I'm reaching out from ${mockStartupData.name}, where we're ${mockStartupData.description}.

I've been following ${formData.companyName || '[Company]'}'s work and believe there's a strong opportunity for collaboration. Our user bases and missions align well, and I think we could create significant value together.

About us: ${mockStartupData.traction}

I'd love to explore potential partnership opportunities. Would you be open to a brief exploratory call?

Best regards,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'hiring':
        emailContent = `Subject: ${formData.position || '[Position]'} Opportunity at ${mockStartupData.name}

Hi ${formData.candidateName || '[Name]'},

I came across your profile and was impressed by your background. I'm ${mockStartupData.founderName}, ${mockStartupData.founderTitle} at ${mockStartupData.name}.

We're ${mockStartupData.description}, and we're currently growing our team. Given your experience, I think you'd be a great fit for our ${formData.position || '[Position]'} role.

What we're building:
• ${mockStartupData.traction}
• Backed by top-tier investors
• Solving real problems for founders and startups

Why join us:
• Early-stage equity opportunity
• High-impact role with autonomy
• Mission-driven team and culture

Would you be open to learning more? I'd love to share our vision and hear about what you're looking for in your next opportunity.

Best,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'customer-followup':
        emailContent = `Subject: Following Up - ${mockStartupData.name}

Hi ${formData.recipientName || 'there'},

Thank you for taking the time to explore ${mockStartupData.name} with us! I wanted to follow up and see if you had any questions about how we can help ${formData.companyName || '[your company]'}.

Quick recap of what ${mockStartupData.name} offers:
• ${mockStartupData.description}
• Currently helping ${mockStartupData.traction.split(',')[0]}
• Easy implementation with immediate value

I'd be happy to:
• Answer any questions you might have
• Set up a custom demo for your team
• Discuss pricing and implementation timeline

What would be most helpful for you at this stage?

Best,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'accelerator':
        emailContent = `Subject: ${mockStartupData.name} - Application to ${formData.programName || '[Program]'}

Dear ${formData.programName || '[Program]'} Team,

I'm ${mockStartupData.founderName}, ${mockStartupData.founderTitle} of ${mockStartupData.name}, and I'm excited to apply for ${formData.programName || 'your program'}.

We've built ${mockStartupData.description}, and we're currently seeing strong traction: ${mockStartupData.traction}.

Why we're a great fit:
• Addressing a significant market opportunity in ${mockStartupData.industry}
• Strong early indicators of product-market fit
• Experienced team ready to accelerate growth
• Clear vision for scaling

We're at the perfect stage to benefit from ${formData.programName || 'your program'}'s mentorship, network, and resources. We're committed to making the most of this opportunity and becoming a standout portfolio company.

I've attached our pitch deck and application materials. Happy to provide any additional information needed.

Thank you for considering ${mockStartupData.name}!

Best,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;

      case 'business-intro':
        emailContent = `Subject: Introduction - ${mockStartupData.name}

Hi ${formData.recipientName || '[Name]'},

I'm ${mockStartupData.founderName}, ${mockStartupData.founderTitle} at ${mockStartupData.name}.

We're ${mockStartupData.description}. I've been following your work and would love to connect and learn more about what you're building.

A bit about us: ${mockStartupData.traction}

I believe there could be interesting opportunities to exchange ideas or even collaborate. Would you be open to a brief virtual coffee chat?

Looking forward to connecting!

Best,
${mockStartupData.founderName}
${mockStartupData.founderTitle}
${mockStartupData.name}`;
        break;
    }

    setGeneratedEmail(emailContent);
    setIsGenerating(false);
    toast.success('Email generated successfully!');
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setGeneratedEmail('');
    setFormData({});
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

                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-3">
                        ✨ We'll use your startup data from Foundify to complete the email
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
