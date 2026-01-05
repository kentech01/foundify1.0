import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  QrCode,
  Download,
  Share2,
  Mail,
  Phone,
  Briefcase,
  Building,
  Globe,
  Linkedin,
  Twitter,
  Check,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// Mock startup data (from Foundify)
const mockStartupData = {
  name: 'TechVenture AI',
  description: 'AI-powered startup toolkit for founders',
  website: 'techventure.ai',
  logo: '🚀'
};

export function QRVisitCardPage() {
  const [formData, setFormData] = useState({
    fullName: 'Sarah Chen',
    role: 'Founder & CEO',
    email: 'sarah@techventure.ai',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/sarahchen',
    twitter: '@sarahchen'
  });

  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    if (!formData.fullName || !formData.role) {
      toast.error('Please fill in your name and role');
      return;
    }
    setIsGenerated(true);
    toast.success('QR Visit Card generated!');
  };

  const handleDownload = () => {
    toast.success('QR code downloaded!');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  // Generate a simple QR code placeholder (in production, use a real QR library)
  const QRCodePlaceholder = () => (
    <div className="w-full h-full bg-white p-6 rounded-2xl border-4 border-gray-900">
      <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 aspect-square">
        {/* Simplified QR code pattern */}
        {Array.from({ length: 225 }).map((_, i) => {
          const shouldFill = Math.random() > 0.5;
          return (
            <div
              key={i}
              className={`${shouldFill ? 'bg-gray-900' : 'bg-white'} rounded-sm`}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#252952] mb-2">QR Visit Card</h1>
        <p className="text-gray-600 mt-2">
          Share your identity and startup instantly
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-8 border-2 border-[#4A90E2]/20 bg-gradient-to-r from-[#252952]/5 to-[#4A90E2]/5 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#252952] to-[#4A90E2] flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Smart Digital Card</h3>
              <p className="text-sm text-gray-600">
                Just add your personal details—we'll automatically include your startup information from Foundify. 
                Perfect for networking events, meetings, and conferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left: Input Form */}
        <div>
          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Your Information</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Enter your details below
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Sarah Chen"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Input
                    placeholder="Founder & CEO"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="sarah@startup.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="linkedin.com/in/yourname"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="pl-10 rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Twitter</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="@yourhandle"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="pl-10 rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Auto-filled from your Foundify profile:</span>
                  </div>
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{mockStartupData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{mockStartupData.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{mockStartupData.website}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-xl"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Visit Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview & QR */}
        <div className="space-y-6">
          {!isGenerated ? (
            <Card className="border-2 border-dashed border-gray-300 rounded-2xl">
              <CardContent className="p-12 text-center">
                <QrCode className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                <h3 className="font-semibold text-gray-900 mb-2">Preview Your Card</h3>
                <p className="text-gray-500">
                  Fill in your details and generate your QR visit card
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Digital Card Preview */}
              <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#252952] via-[#4A90E2] to-[#7DD3FC] p-8 text-white">
                  <div className="flex items-start justify-between mb-8">
                    <div className="text-5xl">{mockStartupData.logo}</div>
                    <div className="text-right">
                      <div className="text-3xl font-bold mb-1">{mockStartupData.name}</div>
                      <div className="text-sm opacity-90">{mockStartupData.website}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold mb-1">{formData.fullName}</div>
                      <div className="text-xl opacity-90">{formData.role}</div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/20 space-y-2 text-sm">
                      {formData.email && (
                        <div className="flex items-center gap-2 opacity-90">
                          <Mail className="h-4 w-4" />
                          <span>{formData.email}</span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex items-center gap-2 opacity-90">
                          <Phone className="h-4 w-4" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-white/20">
                      <div className="text-sm opacity-90 mb-2">{mockStartupData.description}</div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      {formData.linkedin && (
                        <div className="flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-lg">
                          <Linkedin className="h-3.5 w-3.5" />
                          <span className="opacity-90">LinkedIn</span>
                        </div>
                      )}
                      {formData.twitter && (
                        <div className="flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1.5 rounded-lg">
                          <Twitter className="h-3.5 w-3.5" />
                          <span className="opacity-90">Twitter</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* QR Code */}
              <Card className="border-2 border-gray-100 rounded-2xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-center">Your QR Code</CardTitle>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    Scan to view digital card
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="max-w-xs mx-auto">
                    <QRCodePlaceholder />
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-xl"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full rounded-xl border-2"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Card Link
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 text-center">
                      💡 Print this QR code on business cards, event badges, or display it on your phone
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

