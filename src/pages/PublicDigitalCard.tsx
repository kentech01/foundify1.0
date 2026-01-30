import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Linkedin, Twitter, Globe, Building, Briefcase, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

interface DigitalCard {
  id: string;
  fullName: string;
  role: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  viewCount: number;
}

export function PublicDigitalCard() {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<DigitalCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${apiUrl}digital-card/public/${cardId}`);
        
        if (!response.ok) {
          throw new Error('Card not found');
        }

        const data = await response.json();
        setCard(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load card');
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#4A90E2] mx-auto mb-4" />
          <p className="text-gray-600">Loading digital card...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-red-200 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Card Not Found</h2>
            <p className="text-gray-600">
              This digital card doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare company logo
  const companyLogo = card.companyLogo || '🚀';
  const isEmoji = companyLogo.length <= 4 && !companyLogo.includes('<');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Powered by Foundify badge */}
        <div className="text-center mb-6">
          <a 
            href="https://foundify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>Powered by</span>
            <span className="font-semibold text-[#252952]">Foundify</span>
          </a>
        </div>

        {/* Digital Card */}
        <Card className="border-2 border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
          <div 
            className="p-8 md:p-12 text-white"
            style={{
              background: `linear-gradient(to bottom right, ${card.primaryColor || '#252952'}, ${card.secondaryColor || '#4A90E2'}, ${card.secondaryColor || '#4A90E2'}dd)`
            }}
          >
            {/* Company Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                {card.companyName && (
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {card.companyName}
                  </div>
                )}
                {card.companyWebsite && (
                  <div className="text-sm md:text-base opacity-90">
                    {card.companyWebsite}
                  </div>
                )}
              </div>
              {companyLogo && (
                <div className="ml-4">
                  {isEmoji ? (
                    <div className="text-5xl md:text-6xl">{companyLogo}</div>
                  ) : (
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20"
                      dangerouslySetInnerHTML={{ __html: companyLogo }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{card.fullName}</div>
                <div className="text-xl md:text-2xl opacity-90">{card.role}</div>
              </div>

              {/* Contact Details */}
              <div className="pt-4 border-t border-white/20 space-y-3">
                {card.email && (
                  <a 
                    href={`mailto:${card.email}`}
                    className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-sm md:text-base">{card.email}</span>
                  </a>
                )}
                {card.phone && (
                  <a 
                    href={`tel:${card.phone}`}
                    className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-sm md:text-base">{card.phone}</span>
                  </a>
                )}
              </div>

              {/* Company Description */}
              {card.companyDescription && (
                <div className="pt-4 border-t border-white/20">
                  <div className="text-sm md:text-base opacity-90">
                    {card.companyDescription}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(card.linkedin || card.twitter) && (
                <div className="flex gap-3 pt-4">
                  {card.linkedin && (
                    <a
                      href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {card.twitter && (
                    <a
                      href={card.twitter.startsWith('http') ? card.twitter : `https://twitter.com/${card.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save Contact Button */}
          <div className="bg-white p-6 md:p-8">
            <button
              onClick={() => {
                // Create vCard data
                const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${card.fullName}
TITLE:${card.role}
${card.email ? `EMAIL:${card.email}` : ''}
${card.phone ? `TEL:${card.phone}` : ''}
${card.companyName ? `ORG:${card.companyName}` : ''}
${card.linkedin ? `URL:${card.linkedin}` : ''}
END:VCARD`;

                // Download vCard
                const blob = new Blob([vCard], { type: 'text/vcard' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${card.fullName.replace(/\s+/g, '_')}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="w-full bg-[#252952] hover:bg-[#1a1d3a] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Save Contact
            </button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Create your own smart digital card with{' '}
            <a 
              href="https://foundify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-[#4A90E2] hover:text-[#252952] transition-colors"
            >
              Foundify
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
