import { useState, useEffect } from 'react';
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
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useApiService } from '../services/api';
import { UserAuth } from '../context/AuthContext';

export function QRVisitCardPage() {
  const { user } = UserAuth();
  const apiService = useApiService();
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    role: '',
    email: user?.email || '',
    phone: '',
    linkedin: '',
    twitter: ''
  });

  const [startupData, setStartupData] = useState({
    name: '',
    description: '',
    website: '',
    logo: '🚀',
    primaryColor: '#252952',
    secondaryColor: '#4A90E2',
  });

  const [existingCard, setExistingCard] = useState<any>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(true);

  // Derived brand colors for the Smart Digital Card UI, with safe defaults.
  const primaryColor = startupData.primaryColor || '#252952';
  const secondaryColor = startupData.secondaryColor || '#4A90E2';

  // Load existing card and startup data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingCard(true);
        
        // Try to load existing digital card (silently fail if not found)
        try {
          const cardResponse = await apiService.getDigitalCard();
          if (cardResponse.success && cardResponse.data) {
            setExistingCard(cardResponse.data);
            setFormData({
              fullName: cardResponse.data.fullName,
              role: cardResponse.data.role,
              email: cardResponse.data.email || '',
              phone: cardResponse.data.phone || '',
              linkedin: cardResponse.data.linkedin || '',
              twitter: cardResponse.data.twitter || '',
            });
            setStartupData({
              name: cardResponse.data.companyName || '',
              description: cardResponse.data.companyDescription || '',
              website: cardResponse.data.companyWebsite || '',
              logo: cardResponse.data.companyLogo || '🚀',
              primaryColor: cardResponse.data.primaryColor || '#252952',
              secondaryColor: cardResponse.data.secondaryColor || '#4A90E2',
            });
            setIsGenerated(true);
          }
        } catch (err: any) {
          // Silently handle 404 (no card exists yet)
          // Only log other errors
          if (err?.response?.status !== 404) {
            console.error('Error loading digital card:', err);
          }
        }

        // Always refresh brand data from the latest pitch so that
        // Smart Digital Card colors & UI stay in sync with the pitch.
        try {
          const pitchResponse = await apiService.getFirstPitch();
          if (pitchResponse) {
            setStartupData((prev) => ({
              // Prefer pitch for logo, colors & company info (source of truth for brand).
              name: prev.name || pitchResponse.startupName || '',
              description:
                prev.description ||
                pitchResponse.pitchContent?.mainProduct ||
                '',
              website:
                prev.website || pitchResponse.pitchContent?.email || '',
              logo: pitchResponse.logo || prev.logo || '🚀',
              primaryColor:
                pitchResponse.primaryColor ||
                prev.primaryColor ||
                '#252952',
              secondaryColor:
                pitchResponse.secondaryColor ||
                prev.secondaryColor ||
                '#4A90E2',
            }));
          }
        } catch (err) {
          // No pitch data, keep whatever we already have
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingCard(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!formData.fullName || !formData.role) {
      toast.error('Please fill in your name and role');
      return;
    }

    try {
      setIsLoading(true);
      
      const cardData = {
        fullName: formData.fullName,
        role: formData.role,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        linkedin: formData.linkedin || undefined,
        twitter: formData.twitter || undefined,
        companyName: startupData.name || undefined,
        companyDescription: startupData.description || undefined,
        companyWebsite: startupData.website || undefined,
        companyLogo: startupData.logo || undefined,
        primaryColor: startupData.primaryColor || undefined,
        secondaryColor: startupData.secondaryColor || undefined,
      };

      const response = existingCard
        ? await apiService.updateDigitalCard(existingCard.id, cardData)
        : await apiService.createDigitalCard(cardData);

      if (response.success) {
        setExistingCard(response.data);
        setIsGenerated(true);
        toast.success(existingCard ? 'Digital card updated!' : 'Smart Digital Card generated!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate digital card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!existingCard?.qrCode) {
      toast.error('No QR code available');
      return;
    }

    // Convert base64 to blob and download
    const link = document.createElement('a');
    link.href = existingCard.qrCode;
    link.download = `${formData.fullName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const handleShare = () => {
    if (!existingCard?.publicUrl) {
      toast.error('No card URL available');
      return;
    }

    navigator.clipboard.writeText(existingCard.publicUrl);
    toast.success('Card link copied to clipboard!');
  };

  // Show loading state while fetching data
  if (isLoadingCard) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#4A90E2] mx-auto mb-4" />
            <p className="text-gray-600">Loading your information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#252952] mb-2">Smart Digital Card</h1>
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
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Input
                    placeholder="Founder & CEO"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 focus:border-[#4A90E2]"
                    autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
                    />
                  </div>
                </div>

                {startupData.name && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Auto-filled from your Foundify profile:</span>
                    </div>
                    <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{startupData.name}</span>
                      </div>
                      {startupData.description && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{startupData.description}</span>
                        </div>
                      )}
                      {startupData.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{startupData.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {existingCard ? 'Updating...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      {existingCard ? 'Update Smart Digital Card' : 'Generate Smart Digital Card'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview & QR */}
        <div className="space-y-6">
          {!isGenerated ? (
            <>
              {/* Live preview with logo-derived colors */}
              <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden gap-0">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-700 text-sm">Card Preview</h3>
                </div>
                <div
                  className="p-8 pt-6 text-white"
                  style={{
                    background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor}, ${secondaryColor}dd)`,
                  }}
                >
                  <div className="mb-8">
                    <div className="text-3xl font-bold mb-1">{startupData.name || 'Company'}</div>
                    {startupData.website && (
                      <div className="text-sm opacity-90">{startupData.website}</div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold mb-1">{formData.fullName || 'Your Name'}</div>
                      <div className="text-xl opacity-90">{formData.role || 'Your Role'}</div>
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
                      {!formData.email && !formData.phone && (
                        <div className="text-sm opacity-70">Add email & phone to see them here</div>
                      )}
                    </div>

                    {startupData.description && (
                      <div className="pt-4 border-t border-white/20">
                        <div className="text-sm opacity-90 mb-2">{startupData.description}</div>
                      </div>
                    )}

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
              <p className="text-sm text-gray-500 text-center">
                Generate your card to get the QR code and shareable link
              </p>
            </>
          ) : (
            <>
              {/* Digital Card Preview */}
              <Card className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                <div
                  className="p-8 text-white"
                  style={{
                    background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor}, ${secondaryColor}dd)`,
                  }}
                >
                  <div className="mb-8">
                    <div className="text-3xl font-bold mb-1">{startupData.name}</div>
                    {startupData.website && (
                      <div className="text-sm opacity-90">{startupData.website}</div>
                    )}
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
                    
                    {startupData.description && (
                      <div className="pt-4 border-t border-white/20">
                        <div className="text-sm opacity-90 mb-2">{startupData.description}</div>
                      </div>
                    )}

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
                    {existingCard?.qrCode ? (
                      <img 
                        src={existingCard.qrCode} 
                        alt="QR Code" 
                        className="w-full h-auto rounded-2xl border-4 border-gray-900"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                        <QrCode className="h-20 w-20 text-gray-300" />
                      </div>
                    )}
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

