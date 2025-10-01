import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  FileText, 
  Globe, 
  Download, 
  Eye, 
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { LoadingModal } from '../components/LoadingModal';
import { toast } from 'sonner@2.0.3';
import dashboardImage from 'figma:asset/25b992c91465c9da9b10643b1981a209bbc73d2d.png';

interface Pitch {
  id: string;
  name: string;
  createdAt: string;
  views: number;
  status: 'draft' | 'published';
  hasLanding: boolean;
  hasPDF: boolean;
}

interface PitchDashboardProps {
  initialPitch?: Pitch;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function PitchDashboard({ initialPitch, isPremium, onUpgrade }: PitchDashboardProps) {
  const [pitches, setPitches] = useState<Pitch[]>(
    initialPitch ? [initialPitch] : []
  );
  const [loadingModal, setLoadingModal] = useState<{
    isOpen: boolean;
    type: 'pdf' | 'landing' | 'generating';
  }>({
    isOpen: false,
    type: 'generating',
  });
  const [progress, setProgress] = useState(0);

  const handleGeneratePDF = async (pitchId: string) => {
    setLoadingModal({ isOpen: true, type: 'pdf' });
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoadingModal({ isOpen: false, type: 'pdf' });
            setPitches(pitches.map(p => 
              p.id === pitchId ? { ...p, hasPDF: true } : p
            ));
            toast.success('PDF Generated!', {
              description: 'Your pitch deck PDF is ready to download.',
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleGenerateLanding = async (pitchId: string) => {
    setLoadingModal({ isOpen: true, type: 'landing' });
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoadingModal({ isOpen: false, type: 'landing' });
            setPitches(pitches.map(p => 
              p.id === pitchId ? { ...p, hasLanding: true, status: 'published' } : p
            ));
            toast.success('Landing Page Live!', {
              description: 'Your landing page has been published successfully.',
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="p-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pitches</p>
                <p className="text-4xl font-bold text-gray-900">{pitches.length}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-premium-purple-50 flex items-center justify-center">
                <FileText className="h-7 w-7 text-premium-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-4xl font-bold text-gray-900">
                  {pitches.reduce((sum, p) => sum + p.views, 0)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-deep-blue-50 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-deep-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-4xl font-bold text-gray-900">
                  {pitches.filter(p => p.status === 'published').length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <Globe className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pitches List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Pitches</h3>

        {pitches.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pitches yet</h3>
              <p className="text-gray-600">Create your first pitch to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pitches.map((pitch) => (
              <Card key={pitch.id} className="border-2 border-gray-100 hover:shadow-lg transition-shadow rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Pitch Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{pitch.name}</h3>
                        <Badge 
                          variant={pitch.status === 'published' ? 'default' : 'secondary'}
                          className={pitch.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {pitch.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pitch.createdAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {pitch.views} views
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleGeneratePDF(pitch.id)}
                        className="border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {pitch.hasPDF ? 'Download PDF' : 'Generate PDF'}
                      </Button>
                      <Button
                        onClick={() => handleGenerateLanding(pitch.id)}
                        className="rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white"
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        {pitch.hasLanding ? 'View Landing' : 'Create Landing'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Premium Status */}
      {isPremium && (
        <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">Premium Active</h3>
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    ✓ Premium
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  You have full access to all premium features, AI assistance, and founder tools
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <LoadingModal 
        isOpen={loadingModal.isOpen} 
        type={loadingModal.type}
        progress={progress}
      />
    </div>
  );
}