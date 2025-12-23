import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Copy, Mail, Sparkles, ChevronUp, Info } from "lucide-react";
import styles from "../styles/toolsComponents.module.scss";
import { useApiService } from "../services/api";
import { useNavigate } from "react-router-dom";
import React from "react";

type EmailTemplate = { id: string; title: string };

type Errors = Partial<{
  template: string;
  yourName: string;
  companyName: string;
  investorName: string;
  valueProposition: string;
  keyTraction: string;
}>;

export function InvestorEmailDraft() {
  const { getEmailTemplates, generateInvestorEmail } = useApiService();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    investor: "",
    valueProp: "",
    traction: "",
    contact: "",
    // Cold Outreach specific
    recentMilestone: "",
    fundraisingAmount: "",
    // Meeting Follow-Up specific
    whereMet: "",
    whatTalkedAbout: "",
    updatedMetric: "",
    nextStep: "",
    // Warm Introduction specific
    whoIntroduced: "",
    whyThisInvestor: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);
        const res = await getEmailTemplates();
        setTemplates(res.templates || []);
      } catch (e: any) {
        console.error("Failed to load templates:", e);
        setTemplatesError(e.message || "Failed to load templates");
      } finally {
        setTemplatesLoading(false);
      }
    };
    loadTemplates();
  }, [getEmailTemplates]);

  const validate = useMemo(() => {
    const errs: Errors = {};

    // Always required
    if (
      !formData.name.trim() ||
      formData.name.trim().length < 2 ||
      formData.name.trim().length > 100
    ) {
      errs.yourName = "2-100 characters";
    }
    if (
      !formData.company.trim() ||
      formData.company.trim().length < 2 ||
      formData.company.trim().length > 120
    ) {
      errs.companyName = "2-120 characters";
    }
    if (
      !formData.investor.trim() ||
      formData.investor.trim().length < 2 ||
      formData.investor.trim().length > 120
    ) {
      errs.investorName = "2-120 characters";
    }

    // Template-specific validation
    if (selectedTemplate === "cold_outreach") {
      if (
        !formData.valueProp.trim() ||
        formData.valueProp.trim().length < 5 ||
        formData.valueProp.trim().length > 280
      ) {
        errs.valueProposition = "5-280 characters";
      }
      if (
        !formData.traction.trim() ||
        formData.traction.trim().length < 2 ||
        formData.traction.trim().length > 280
      ) {
        errs.keyTraction = "2-280 characters";
      }
    } else if (selectedTemplate === "meeting_followup") {
      // For meeting follow-up, whatTalkedAbout is the main field
      const hasContent =
        formData.whatTalkedAbout.trim().length > 0 ||
        formData.valueProp.trim().length > 0;
      if (!hasContent) {
        errs.valueProposition = "Please provide what you talked about";
      }
    } else if (selectedTemplate === "warm_introduction") {
      if (
        !formData.valueProp.trim() ||
        formData.valueProp.trim().length < 5 ||
        formData.valueProp.trim().length > 280
      ) {
        errs.valueProposition = "5-280 characters";
      }
    }

    return { errs, valid: Object.keys(errs).length === 0 };
  }, [selectedTemplate, formData]);

  useEffect(() => {
    if (submitted) {
      setErrors(validate.errs);
    }
  }, [validate, submitted]);

  const generateEmail = async () => {
    setSubmitted(true);
    if (!validate.valid) return;
    try {
      setGenerating(true);

      // Map fields based on template type
      let valueProposition = "";
      let keyTraction = "";

      if (selectedTemplate === "cold_outreach") {
        valueProposition = formData.valueProp.trim();
        keyTraction = formData.traction.trim();
      } else if (selectedTemplate === "meeting_followup") {
        valueProposition =
          formData.whatTalkedAbout.trim() || formData.valueProp.trim();
        keyTraction = formData.updatedMetric.trim() || formData.traction.trim();
      } else if (selectedTemplate === "warm_introduction") {
        valueProposition = formData.valueProp.trim();
        keyTraction = formData.traction.trim();
      }

      const payload = {
        template: selectedTemplate,
        yourName: formData.name.trim(),
        companyName: formData.company.trim(),
        investorName: formData.investor.trim(),
        valueProposition: valueProposition,
        keyTraction: keyTraction,
      } as any;

      const res = await generateInvestorEmail(payload);
      setEmailSubject(res.subject || "");
      setEmailBody(res.body || "");

      // Don't clear form fields after successful generation
      // setFormData({
      //   name: "",
      //   company: "",
      //   investor: "",
      //   valueProp: "",
      //   traction: "",
      //   contact: "",
      // });
      // setSelectedTemplate("");
      // setTouched({});
    } catch (e: any) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const copyEmail = () => {
    if (!emailSubject && !emailBody) return;
    const emailText = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(emailText);
  };

  const sendEmail = () => {
    if (!emailSubject && !emailBody) return;
    const mailto = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  };

  const getTemplateFields = () => {
    if (selectedTemplate === "cold_outreach") {
      return {
        mainFields: [
          {
            id: "investor",
            label: "Investor Name",
            helper: "Who are you reaching out to?",
            value: formData.investor,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, investor: e.target.value });
            },
            placeholder: "e.g., Alex Johnson",
            required: true,
            error: errors.investorName,
            submitted: submitted,
          },
          {
            id: "valueProp",
            label: "What does your startup do?",
            helper: "Describe it in one simple sentence",
            value: formData.valueProp,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, valueProp: e.target.value });
            },
            placeholder: "e.g., AI-powered project management for remote teams",
            required: true,
            error: errors.valueProposition,
            submitted: submitted,
          },
          {
            id: "traction",
            label: "Your strongest metric",
            helper: "Show your traction with numbers",
            value: formData.traction,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, traction: e.target.value });
            },
            placeholder: "e.g., $50K MRR, 1000+ users",
            required: true,
            error: errors.keyTraction,
            submitted: submitted,
          },
        ],
        optionalFields: [
          {
            id: "recentMilestone",
            label: "Recent milestone",
            helper: "Something exciting you just achieved",
            value: formData.recentMilestone,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, recentMilestone: e.target.value }),
            placeholder: "e.g., Just closed our Series A",
          },
          {
            id: "fundraisingAmount",
            label: "Fundraising amount",
            helper: "How much are you raising?",
            value: formData.fundraisingAmount,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, fundraisingAmount: e.target.value }),
            placeholder: "e.g., $2M seed round",
          },
        ],
      };
    } else if (selectedTemplate === "meeting_followup") {
      return {
        mainFields: [
          {
            id: "investor",
            label: "Investor Name",
            helper: "Who are you reaching out to?",
            value: formData.investor,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, investor: e.target.value });
            },
            placeholder: "e.g., Alex Johnson",
            required: true,
            error: errors.investorName,
            submitted: submitted,
          },
          {
            id: "whereMet",
            label: "Where did you meet?",
            helper: "Event, coffee shop, video call, etc.",
            value: formData.whereMet,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, whereMet: e.target.value }),
            placeholder: "e.g., TechCrunch Disrupt",
            required: false,
          },
          {
            id: "whatTalkedAbout",
            label: "What did you talk about?",
            helper: "Quick summary of your conversation",
            value: formData.whatTalkedAbout,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFormData({ ...formData, whatTalkedAbout: e.target.value });
            },
            placeholder:
              "e.g., We discussed our go-to-market strategy and customer acquisition costs",
            required: false,
            isTextarea: true,
          },
        ],
        optionalFields: [
          {
            id: "updatedMetric",
            label: "Updated metric",
            helper: "Any new numbers since you met?",
            value: formData.updatedMetric,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, updatedMetric: e.target.value }),
            placeholder: "e.g., We've grown to $75K MRR",
          },
          {
            id: "nextStep",
            label: "Next step",
            helper: "What would you like to happen next?",
            value: formData.nextStep,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, nextStep: e.target.value }),
            placeholder:
              "e.g., Would you be open to a partner meeting next week?",
          },
        ],
      };
    } else if (selectedTemplate === "warm_introduction") {
      return {
        mainFields: [
          {
            id: "investor",
            label: "Investor Name",
            helper: "Who are you reaching out to?",
            value: formData.investor,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, investor: e.target.value });
            },
            placeholder: "e.g., Alex Johnson",
            required: true,
            error: errors.investorName,
            submitted: submitted,
          },
          {
            id: "whoIntroduced",
            label: "Who introduced you?",
            helper: "Your mutual connection's name",
            value: formData.whoIntroduced,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, whoIntroduced: e.target.value }),
            placeholder: "e.g., Michael Chen",
            required: false,
          },
          {
            id: "valueProp",
            label: "What does your startup do?",
            helper: "Describe it in one simple sentence",
            value: formData.valueProp,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, valueProp: e.target.value });
            },
            placeholder: "e.g., AI-powered project management for remote teams",
            required: true,
            error: errors.valueProposition,
            submitted: submitted,
          },
        ],
        optionalFields: [
          {
            id: "traction",
            label: "Your strongest metric",
            helper: "Show your traction with numbers",
            value: formData.traction,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, traction: e.target.value }),
            placeholder: "e.g., $50K MRR, 1000+ users",
          },
          {
            id: "whyThisInvestor",
            label: "Why this investor?",
            helper: "What makes them a great fit?",
            value: formData.whyThisInvestor,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, whyThisInvestor: e.target.value }),
            placeholder:
              "e.g., I noticed your investment in Shopify and our product serves a similar market",
            isTextarea: true,
          },
        ],
      };
    }
    return { mainFields: [], optionalFields: [] };
  };

  const templateFields = getTemplateFields();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div>
          <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">
            Investor Email Generator
          </h2>
          <p className="text-center text-gray-600">
            Create professional investor outreach emails in minutes
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Choose Email Type */}
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle>Choose Email Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => {
                setSelectedTemplate(value);
                setShowMoreDetails(false);
              }}
              disabled={templatesLoading || !!templatesError}
            >
              <SelectTrigger className="data-[placeholder]:text-gray-400">
                <SelectValue
                  placeholder={
                    templatesLoading
                      ? "Loading templates..."
                      : "Select email type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.template && (
              <div className="text-red-700 text-sm mt-1.5">
                {errors.template}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTemplate && (
          <>
            {/* About You Section */}
            <Card className="mx-auto">
              <CardHeader>
                <CardTitle>About You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">
                    What should we call you?
                  </p>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., John Smith"
                    maxLength={100}
                    className="placeholder:text-gray-400"
                  />
                  {submitted && errors.yourName && (
                    <div className="text-red-700 text-sm mt-1.5">
                      {errors.yourName}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    Your Startup Name
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">
                    The company you're building
                  </p>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="e.g., TechStart Inc."
                    maxLength={120}
                    className="placeholder:text-gray-400"
                  />
                  {submitted && errors.companyName && (
                    <div className="text-red-700 text-sm mt-1.5">
                      {errors.companyName}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About This Email Section */}
            <Card className="mx-auto">
              <CardHeader>
                <CardTitle>About This Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templateFields.mainFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2">
                      {field.helper}
                    </p>
                    {field.isTextarea ? (
                      <Textarea
                        id={field.id}
                        value={field.value}
                        onChange={field.onChange as any}
                        placeholder={field.placeholder}
                        className="placeholder:text-gray-400 min-h-[100px]"
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        value={field.value}
                        onChange={field.onChange as any}
                        placeholder={field.placeholder}
                        className="placeholder:text-gray-400"
                        maxLength={280}
                      />
                    )}
                    {(field as any).submitted && field.error && (
                      <div className="text-red-700 text-sm mt-1.5">
                        {field.error}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add more details (optional) */}
                {templateFields.optionalFields.length > 0 && (
                  <Collapsible
                    open={showMoreDetails}
                    onOpenChange={setShowMoreDetails}
                  >
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 w-full">
                      <ChevronUp
                        className={`h-4 w-4 transition-transform ${
                          showMoreDetails ? "" : "rotate-180"
                        }`}
                      />
                      Add more details (optional)
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      {templateFields.optionalFields.map((field) => (
                        <div key={field.id}>
                          <Label
                            htmlFor={field.id}
                            className="text-sm font-medium"
                          >
                            {field.label}
                          </Label>
                          <p className="text-xs text-gray-500 mt-0.5 mb-2">
                            {field.helper}
                          </p>
                          {field.isTextarea ? (
                            <Textarea
                              id={field.id}
                              value={field.value}
                              onChange={field.onChange as any}
                              placeholder={field.placeholder}
                              className="placeholder:text-gray-400 min-h-[100px]"
                              rows={4}
                            />
                          ) : (
                            <Input
                              id={field.id}
                              value={field.value}
                              onChange={field.onChange as any}
                              placeholder={field.placeholder}
                              className="placeholder:text-gray-400"
                              maxLength={280}
                            />
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </CardContent>
            </Card>

            {/* Generate Email Button */}
            <div className="flex justify-center">
              <Button
                onClick={generateEmail}
                disabled={generating}
                className="bg-[#252952] hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generating ? "Generating..." : "Generate Email"}
              </Button>
            </div>
          </>
        )}

        {/* Your Email Output */}
        {(emailSubject || emailBody) && (
          <Card className="mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Email</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={copyEmail} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={sendEmail}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2">Subject:</div>
                  <div className="text-sm text-gray-700 font-mono bg-gray-50 p-3 rounded border">
                    {emailSubject}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Body:</div>
                  <div className="text-sm text-gray-700 font-mono bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                    {emailBody}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pro Tips */}
        <Card className="mx-auto bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Pro Tips
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    • Research the investor's portfolio before reaching out
                  </li>
                  <li>
                    • Keep emails under 150 words for better response rates
                  </li>
                  <li>• Always include specific metrics that show traction</li>
                  <li>
                    • Follow up politely in 1-2 weeks if you don't hear back
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
