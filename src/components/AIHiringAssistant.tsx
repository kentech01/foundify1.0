import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Briefcase,
  Sparkles,
  Settings,
  MessageSquare,
  Sprout,
  ChevronDown,
  Plus,
  Download,
  Copy,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useApiService } from "../services/api";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface QuestionCategory {
  id: string;
  title: string;
  icon: typeof Settings;
  color: string;
  questions: Question[];
}

export function AIHiringAssistant() {
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("");
  const [seniority, setSeniority] = useState("");
  const [industry, setIndustry] = useState("");
  const [interviewGoal, setInterviewGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const { generateInterviewQuestions, exportInterviewPdf } = useApiService();

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);

    try {
      const response = await generateInterviewQuestions({
        candidateName,
        role,
        seniority,
        industry,
        interviewGoal,
      });

      const generatedCategories: QuestionCategory[] = [
        {
          id: "technical",
          title: "Technical Questions",
          icon: Settings,
          color: "bg-blue-50 border-blue-200 text-blue-700",
          questions: response.data.questions.technical.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
          })),
        },
        {
          id: "soft-skills",
          title: "Soft Skills Questions",
          icon: MessageSquare,
          color: "bg-purple-50 border-purple-200 text-purple-700",
          questions: response.data.questions.softSkills.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
          })),
        },
        {
          id: "culture-fit",
          title: "Culture Fit Questions",
          icon: Sprout,
          color: "bg-green-50 border-green-200 text-green-700",
          questions: response.data.questions.cultureFit.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
          })),
        },
      ];

      setCategories(generatedCategories);
      setOpenCategories(["technical", "soft-skills", "culture-fit"]);
      setQuestionsGenerated(true);
      toast.success("Interview questions generated successfully!");
    } catch (error: any) {
      console.error("Error generating questions:", error);
      toast.error(error.message || "Failed to generate interview questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (
    categoryId: string,
    questionId: string,
    answer: string
  ) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: category.questions.map((q) =>
              q.id === questionId ? { ...q, answer } : q
            ),
          };
        }
        return category;
      })
    );
  };

  const handleAddCustomQuestion = (categoryId: string) => {
    const customQuestion = prompt("Enter your custom question:");
    if (!customQuestion) return;

    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: [
              ...category.questions,
              {
                id: `custom_${Date.now()}`,
                question: customQuestion,
                answer: "",
              },
            ],
          };
        }
        return category;
      })
    );
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleRegenerate = () => {
    setQuestionsGenerated(false);
    setCategories([]);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const technicalCategory = categories.find((c) => c.id === "technical");
      const softSkillsCategory = categories.find((c) => c.id === "soft-skills");
      const cultureFitCategory = categories.find((c) => c.id === "culture-fit");

      const pdfBlob = await exportInterviewPdf({
        candidateName,
        role,
        seniority,
        industry,
        interviewGoal,
        technicalQuestions: technicalCategory?.questions || [],
        softSkillsQuestions: softSkillsCategory?.questions || [],
        cultureFitQuestions: cultureFitCategory?.questions || [],
      });

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Interview_${candidateName.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF exported successfully!");
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      toast.error(error.message || "Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToNotion = () => {
    const content = `AI Hiring Assistant - ${candidateName}

Role: ${role}
Seniority: ${seniority}
Industry: ${industry}
Goal: ${interviewGoal}

${categories
  .map(
    (category) => `
${category.title}
${category.questions
  .map(
    (q, i) => `
${i + 1}. ${q.question}
   Answer/Notes: ${q.answer || "[No notes yet]"}
`
  )
  .join("\n")}
`
  )
  .join("\n")}`;

    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard! You can now paste into Notion.");
  };

  const canGenerate =
    candidateName && role && seniority && industry && interviewGoal;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Briefcase className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl font-semibold">AI Hiring Assistant</h2>
          <Badge className="bg-purple-600 text-white">Premium</Badge>
        </div>
        <p className="text-muted-foreground">
          Generate smart interview questions, evaluate candidates, and make
          better hiring decisions
        </p>
      </div>

      {/* Candidate & Interview Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate & Interview Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="candidate-name">Candidate Name</Label>
              <Input
                id="candidate-name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g., Sarah Johnson"
              />
            </div>
            <div>
              <Label htmlFor="role">Role / Position</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seniority">Level of Seniority</Label>
              <Select value={seniority} onValueChange={setSeniority}>
                <SelectTrigger id="seniority">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid-level">Mid-level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="interview-goal">Interview Goal / Focus</Label>
            <Textarea
              id="interview-goal"
              value={interviewGoal}
              onChange={(e) => setInterviewGoal(e.target.value)}
              placeholder="Example: Evaluate problem-solving and teamwork in real-world projects."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Questions CTA */}
      {!questionsGenerated && (
        <div className="text-center">
          <Button
            onClick={handleGenerateQuestions}
            disabled={!canGenerate || isGenerating}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Questions with AI
              </>
            )}
          </Button>
        </div>
      )}

      {/* Generated Questions Section */}
      {questionsGenerated && (
        <>
          <div className="space-y-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isOpen = openCategories.includes(category.id);

              return (
                <Card
                  key={category.id}
                  className={`border ${
                    category.color.includes("blue")
                      ? "border-blue-200"
                      : category.color.includes("purple")
                      ? "border-purple-200"
                      : "border-green-200"
                  }`}
                >
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <CardTitle className="text-lg">
                                {category.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {category.questions.length} questions
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="space-y-6 pt-0">
                        {category.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="space-y-3 pb-6 border-b last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                                {index + 1}
                              </div>
                              <div className="flex-1 space-y-3">
                                <p className="font-medium">
                                  {question.question}
                                </p>

                                {/* Answer/Notes */}
                                <div>
                                  <Label
                                    htmlFor={`answer-${question.id}`}
                                    className="text-sm text-muted-foreground mb-2"
                                  >
                                    Candidate Answer & Your Notes
                                  </Label>
                                  <Textarea
                                    id={`answer-${question.id}`}
                                    value={question.answer}
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        category.id,
                                        question.id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Record the candidate's answer and add your observations..."
                                    rows={3}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Custom Question */}
                        <Button
                          onClick={() => handleAddCustomQuestion(category.id)}
                          variant="outline"
                          size="sm"
                          className="w-full border-dashed"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Custom Question
                        </Button>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>

          {/* Export Actions */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center">
                Export Interview Guide
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Save all questions and candidate answers as PDF or copy to
                Notion
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export as PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
