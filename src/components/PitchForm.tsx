import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StartupFormData {
  startupName: string;
  problem: string;
  audience: string;
  description: string;
  usp: string;
  email: string;
}

interface PitchFormProps {
  formData: StartupFormData;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PitchForm({ formData, onInputChange, onSubmit }: PitchFormProps) {
  // Defensive programming: provide fallback values if formData is somehow undefined
  const safeFormData = formData || {
    startupName: '',
    problem: '',
    audience: '',
    description: '',
    usp: '',
    email: ''
  };

  return (
    <section id="pitch-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Let's Build Your Pitch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in the details about your startup, and we'll generate a professional pitch deck tailored to your needs.
          </p>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-deep-blue-50 border-b border-deep-blue-100">
            <CardTitle className="text-2xl text-deep-blue-900">Startup Information</CardTitle>
            <CardDescription className="text-deep-blue-700">
              Provide key details about your startup to generate your custom pitch deck
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startupName">Startup Name</Label>
                  <Input
                    id="startupName"
                    type="text"
                    placeholder="Enter your startup name"
                    value={safeFormData.startupName}
                    onChange={(e) => onInputChange('startupName', e.target.value)}
                    className="rounded-xl border-2 focus:border-deep-blue focus:ring-deep-blue/20 h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={safeFormData.email}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    className="rounded-xl border-2 focus:border-deep-blue focus:ring-deep-blue/20 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">Problem Statement</Label>
                <Textarea
                  id="problem"
                  placeholder="What problem does your startup solve?"
                  value={safeFormData.problem}
                  onChange={(e) => onInputChange('problem', e.target.value)}
                  className="rounded-xl border-2 focus:border-deep-blue focus:ring-deep-blue/20 min-h-24 resize-y"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  type="text"
                  placeholder="Who are your target customers?"
                  value={safeFormData.audience}
                  onChange={(e) => onInputChange('audience', e.target.value)}
                  className="rounded-xl border-2 focus:border-deep-blue focus:ring-deep-blue/20 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Startup Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your startup in detail..."
                  value={safeFormData.description}
                  onChange={(e) => onInputChange('description', e.target.value)}
                  className="rounded-xl border-2 focus:border-deep-blue focus:ring-deep-blue/20 min-h-32 resize-y"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usp">Unique Selling Proposition (USP)</Label>
                <Textarea
                  id="usp"
                  placeholder="What makes your startup unique?"
                  value={safeFormData.usp}
                  onChange={(e) => onInputChange('usp', e.target.value)}
                  className="rounded-xl border-2 focus:border-deep-blue focus:ring-deep-blue/20 min-h-24 resize-y"
                  required
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-deep-blue hover:bg-deep-blue-dark text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Pitch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}