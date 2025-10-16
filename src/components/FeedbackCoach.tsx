import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Download,
  User,
  Star,
  Target,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { useApiService } from "../services/api";
import { toast } from "sonner";

interface FeedbackForm {
  employeeName: string;
  employeeRole: string;
  feedbackCycle: string;
  strengths: string;
  improvements: string;
  collaboration: string;
  goals: string;
  additionalNotes: string;
}

const roles = [
  "Engineer",
  "Designer",
  "Product Manager",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Customer Success",
  "Data Analyst",
  "Other",
];

const cycles = [
  "Mid-Year Review",
  "Annual Review",
  "Quarterly Check-in",
  "Probation Review",
  "Promotion Review",
  "Project Review",
];

export function FeedbackCoach({
  setActiveModal,
}: {
  setActiveModal: (modal: string) => void;
}) {
  const { exportFeedbackPdf } = useApiService();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FeedbackForm>({
    employeeName: "",
    employeeRole: "",
    feedbackCycle: "",
    strengths: "",
    improvements: "",
    collaboration: "",
    goals: "",
    additionalNotes: "",
  });

  const updateField = (field: keyof FeedbackForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const generatePDF = async () => {
    if (
      !formData.employeeName ||
      !formData.employeeRole ||
      !formData.feedbackCycle
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const pdfBlob = await exportFeedbackPdf({
        employeeName: formData.employeeName,
        role: formData.employeeRole,
        feedbackCycle: formData.feedbackCycle,
        strengthsObserved: formData.strengths,
        areasForGrowth: formData.improvements,
        teamCollaboration: formData.collaboration,
        goalsNext6Months: formData.goals,
        additionalNotes: formData.additionalNotes,
      });

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Feedback_${formData.employeeName.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Feedback report generated successfully!");
      setActiveModal("");
    } catch (error: any) {
      console.error("Error generating feedback PDF:", error);
      toast.error(error.message || "Failed to generate feedback report");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid =
    formData.employeeName && formData.employeeRole && formData.feedbackCycle;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl font-semibold">Feedback Coach</h2>
          <Badge className="bg-purple-100 text-purple-600">Premium</Badge>
        </div>
        <p className="text-muted-foreground">
          Structure meaningful feedback conversations with your team
        </p>
      </div>

      {/* Employee & Review Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Review Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2" htmlFor="employee-name">
                Employee Name
              </Label>
              <Input
                id="employee-name"
                value={formData.employeeName}
                onChange={(e) => updateField("employeeName", e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="employee-role">
                Role
              </Label>
              <Select
                value={formData.employeeRole}
                onValueChange={(value) => updateField("employeeRole", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-2" htmlFor="feedback-cycle">
              Feedback Cycle
            </Label>
            <Select
              value={formData.feedbackCycle}
              onValueChange={(value) => updateField("feedbackCycle", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select review type" />
              </SelectTrigger>
              <SelectContent>
                {cycles.map((cycle) => (
                  <SelectItem key={cycle} value={cycle}>
                    {cycle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Sections */}
      {isFormValid && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Strengths Observed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.strengths}
                onChange={(e) => updateField("strengths", e.target.value)}
                placeholder="What has John done exceptionally well? What are their key strengths you've observed?

Examples:
• Consistently delivers high-quality code on time
• Great problem-solving skills and attention to detail
• Takes initiative on challenging projects"
                rows={5}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Areas for Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.improvements}
                onChange={(e) => updateField("improvements", e.target.value)}
                placeholder="What areas could John focus on improving? Be specific and constructive.

Examples:
• Communication during project updates could be more frequent
• Consider asking more questions when requirements are unclear
• Time management on multiple concurrent projects"
                rows={5}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Team Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.collaboration}
                onChange={(e) => updateField("collaboration", e.target.value)}
                placeholder="How does John work with others? How do they contribute to team dynamics?

Examples:
• Always willing to help teammates with technical challenges
• Actively participates in team discussions and planning
• Could improve on providing more detailed handoffs"
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Goals for Next 6 Months
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.goals}
                onChange={(e) => updateField("goals", e.target.value)}
                placeholder="What specific goals should John focus on? How will you support their growth?

Examples:
• Lead the new feature development project
• Mentor junior developer joining the team
• Complete advanced React certification
• Improve presentation skills for client demos"
                rows={5}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.additionalNotes}
                onChange={(e) => updateField("additionalNotes", e.target.value)}
                placeholder="Any additional feedback, context, or discussion points for your conversation with John..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={generatePDF}
              size="lg"
              disabled={
                !formData.strengths || !formData.improvements || isGenerating
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Feedback Report
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {/* How it works */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4 text-center">
            How to Use Feedback Coach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <p className="font-medium">Fill the Form</p>
              <p className="text-muted-foreground">
                Structure your thoughts before the conversation
              </p>
            </div>
            <div>
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <p className="font-medium">Have the Conversation</p>
              <p className="text-muted-foreground">
                Use this as your talking points guide
              </p>
            </div>
            <div>
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <p className="font-medium">Share the Report</p>
              <p className="text-muted-foreground">
                Give them a written summary to reference
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              💡 <strong>Pro tip:</strong> Schedule the feedback conversation
              first, then fill this out as preparation. Your team member will
              appreciate the structure!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
