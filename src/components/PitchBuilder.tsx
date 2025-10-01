import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface PitchData {
  startupName: string;
  problem: string;
  targetAudience: string;
  solution: string;
  uniqueValue: string;
  email: string;
}

interface PitchBuilderProps {
  onComplete: (data: PitchData) => void;
}

export function PitchBuilder({ onComplete }: PitchBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PitchData>({
    startupName: '',
    problem: '',
    targetAudience: '',
    solution: '',
    uniqueValue: '',
    email: '',
  });

  const questions = [
    {
      id: 'startupName',
      label: 'What is your startup name?',
      placeholder: 'Enter your startup name',
      type: 'input',
    },
    {
      id: 'problem',
      label: 'What problem are you solving?',
      placeholder: 'Describe the problem your startup addresses',
      type: 'textarea',
    },
    {
      id: 'targetAudience',
      label: 'Who is your target audience?',
      placeholder: 'Describe your ideal customers',
      type: 'textarea',
    },
    {
      id: 'solution',
      label: 'What is your solution?',
      placeholder: 'Explain how your product/service solves the problem',
      type: 'textarea',
    },
    {
      id: 'uniqueValue',
      label: 'What makes you unique?',
      placeholder: 'Describe your unique value proposition',
      type: 'textarea',
    },
    {
      id: 'email',
      label: 'Your email address',
      placeholder: 'Enter your email',
      type: 'input',
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleChange = (value: string) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepValid = formData[currentQuestion.id as keyof PitchData].trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-purple-50 via-white to-deep-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-gray-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create Your Pitch</CardTitle>
                <CardDescription>Step {currentStep + 1} of {questions.length}</CardDescription>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-premium-purple to-deep-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <Label className="text-xl font-semibold text-gray-900">
              {currentQuestion.label}
            </Label>
            
            {currentQuestion.type === 'input' ? (
              <Input
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-lg py-6 border-2 border-gray-200 focus:border-premium-purple rounded-xl"
                autoFocus
              />
            ) : (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id as keyof PitchData]}
                onChange={(e) => handleChange(e.target.value)}
                className="text-base min-h-[150px] border-2 border-gray-200 focus:border-premium-purple rounded-xl resize-none"
                autoFocus
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-6 rounded-xl border-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="px-8 py-6 rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white shadow-lg"
            >
              {currentStep === questions.length - 1 ? 'Generate Pitch' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}