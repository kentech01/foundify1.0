import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useApiService } from "../services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

type Errors = Partial<{
  candidateName: string;
  role: string;
  seniority: string;
  industry: string;
  interviewGoal: string;
}>;

export function AIHiringAssistant() {
  const navigate = useNavigate();
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
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState("");
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const { generateInterviewQuestions, exportInterviewPdf } = useApiService();

  const validate = useMemo(() => {
    const trimmed = {
      role: role.trim(),
      seniority: seniority.trim(),
      industry: industry.trim(),
      interviewGoal: interviewGoal.trim(),
    };

    const errs: Errors = {};

    if (!trimmed.role || trimmed.role.length < 2) {
      errs.role = "This field is required (minimum 2 characters)";
    } else if (trimmed.role.length > 120) {
      errs.role = "Maximum 120 characters allowed";
    }

    // Keep a lightweight version of the original validation so the backend
    // receives a meaningful description (at least 10 characters).
    if (!trimmed.interviewGoal || trimmed.interviewGoal.length < 10) {
      errs.interviewGoal = "Please add a bit more detail (at least 10 characters)";
    }

    return { trimmed, errs, valid: Object.keys(errs).length === 0 };
  }, [role, seniority, industry, interviewGoal]);

  useEffect(() => {
    if (submitted) {
      setErrors(validate.errs);
    }
  }, [validate, submitted]);

  const handleGenerateQuestions = async () => {
    // Mark form as submitted to show validation errors
    setSubmitted(true);

    if (!validate.valid) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await generateInterviewQuestions({
        candidateName: candidateName || "Candidate",
        role: validate.trimmed.role,
        seniority: validate.trimmed.seniority,
        industry: validate.trimmed.industry,
        interviewGoal: validate.trimmed.interviewGoal,
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
    setCurrentCategoryId(categoryId);
    setCustomQuestionInput("");
    setIsAddQuestionModalOpen(true);
  };

  const handleSaveCustomQuestion = () => {
    if (!customQuestionInput.trim() || !currentCategoryId) return;

    setCategories(
      categories.map((category) => {
        if (category.id === currentCategoryId) {
          return {
            ...category,
            questions: [
              ...category.questions,
              {
                id: `custom_${Date.now()}`,
                question: customQuestionInput.trim(),
                answer: "",
              },
            ],
          };
        }
        return category;
      })
    );

    setIsAddQuestionModalOpen(false);
    setCustomQuestionInput("");
    setCurrentCategoryId(null);
    toast.success("Custom question added successfully!");
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
    setCandidateName("");
    setRole("");
    setSeniority("");
    setIndustry("");
    setInterviewGoal("");
    setOpenCategories([]);
    setSubmitted(false);
    setErrors({});
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

  const canGenerate = validate.valid;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Small Header (matches second design) */}
      <div className="mb-8">
        <p className="text-gray-600">
          Generate structured interview templates and assessment criteria with AI
        </p>
      </div>

      {/* Top card styled like second image (tabs + form) */}
      <Card className="border-2 border-gray-100 rounded-2xl mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="generated">Generated</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="mb-1" htmlFor="role">
                    Position Title
                  </Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Senior Software Engineer"
                    maxLength={120}
                    className="rounded-xl bg-slate-50 border border-slate-200 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={industry}
                      onValueChange={(value) => setIndustry(value)}
                    >
                      <SelectTrigger className="rounded-xl bg-slate-50 border border-slate-200 data-[placeholder]:text-slate-400">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select
                      value={seniority}
                      onValueChange={(value) => setSeniority(value)}
                    >
                      <SelectTrigger className="rounded-xl bg-slate-50 border border-slate-200 data-[placeholder]:text-slate-400">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead/Principal">
                          Lead/Principal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Key Skills Required (comma-separated)</Label>
                  <Textarea
                    placeholder="React, Node.js, System Design, AWS"
                    className="rounded-xl bg-slate-50 border border-slate-200 placeholder:text-slate-400"
                    rows={2}
                    value={interviewGoal}
                    onChange={(e) => setInterviewGoal(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating Guide...
                    </>
                  ) : (
                    <>
                      Generate Interview Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="generated" className="space-y-4">
              {/* We keep functionality the same (questions below), so just show a hint here */}
              <div className="text-center py-8 text-gray-500 text-sm">
                Use the generated questions and notes in the section below after
                creating a guide.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-8">
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
                        <CardHeader className=" hover:bg-muted/50 transition-colors">
                          <div className="flex  justify-between">
                            <div className="flex items-center gap-3 mb-6">
                              <div
                                className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="text-left ">
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
                                <div className="w-7 h-7 mr-3 rounded-full bg-blue-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
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
                                      className="placeholder:text-gray-400"
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
            <Card className="bg-blue-50  border-blue-200">
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
                    className="border-blue-700 text-blue-600 hover:bg-gray-50 "
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-[linear-gradient(135deg,#1f1147_0%,#3b82f6_80%,#a5f3fc_100%)] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-101 hover:shadow-xl hover:brightness-110"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2 " />
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

      {/* Add Custom Question Modal */}
      <Dialog
        open={isAddQuestionModalOpen}
        onOpenChange={setIsAddQuestionModalOpen}
      >
        <DialogContent className="sm:max-w-[500px] w-full h-auto">
          <DialogHeader>
            <DialogTitle>Add Custom Question</DialogTitle>
            <DialogDescription>
              Enter your custom interview question below. This will be added to
              the selected category.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="custom-question" className="mb-4">
              Question
            </Label>
            <Textarea
              id="custom-question"
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              placeholder="Example: Can you describe a challenging project you've worked on?"
              rows={4}
              className="resize-none placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSaveCustomQuestion();
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Press Ctrl+Enter to save quickly
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddQuestionModalOpen(false);
                setCustomQuestionInput("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomQuestion}
              disabled={!customQuestionInput.trim()}
              className="bg-[#252952] hover:bg-[#161930] text-white"
            >
              Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
