import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { Copy, Mail, Sparkles } from "lucide-react";
import styles from "../styles/toolsComponents.module.scss";
import { useApiService } from "../services/api";
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
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    investor: "",
    valueProp: "",
    traction: "",
    contact: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<
    Partial<{
      yourName: boolean;
      companyName: boolean;
      investorName: boolean;
      valueProposition: boolean;
      keyTraction: boolean;
    }>
  >({});
  const [generating, setGenerating] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const finalEmail = emailSubject
    ? `Subject: ${emailSubject}\n\n${emailBody}`
    : "";

  useEffect(() => {
    console.log("Component mounted, attempting to load templates");
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);
        console.log("Calling getEmailTemplates...");
        const res = await getEmailTemplates();
        console.log("Templates received:", res);
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
    const trimmed = {
      template: selectedTemplate.trim(),
      yourName: formData.name.trim(),
      companyName: formData.company.trim(),
      investorName: formData.investor.trim(),
      valueProposition: formData.valueProp.trim(),
      keyTraction: formData.traction.trim(),
    };

    const errs: Errors = {};
    // Template selection is optional

    if (
      !trimmed.yourName ||
      trimmed.yourName.length < 2 ||
      trimmed.yourName.length > 100
    ) {
      errs.yourName = "2-100 characters";
    }
    if (
      !trimmed.companyName ||
      trimmed.companyName.length < 2 ||
      trimmed.companyName.length > 120
    ) {
      errs.companyName = "2-120 characters";
    }
    if (
      !trimmed.investorName ||
      trimmed.investorName.length < 2 ||
      trimmed.investorName.length > 120
    ) {
      errs.investorName = "2-120 characters";
    }
    if (
      !trimmed.valueProposition ||
      trimmed.valueProposition.length < 5 ||
      trimmed.valueProposition.length > 280
    ) {
      errs.valueProposition = "5-280 characters";
    }
    if (
      !trimmed.keyTraction ||
      trimmed.keyTraction.length < 2 ||
      trimmed.keyTraction.length > 280
    ) {
      errs.keyTraction = "2-280 characters";
    }

    return { trimmed, errs, valid: Object.keys(errs).length === 0 };
  }, [selectedTemplate, formData]);

  useEffect(() => {
    setErrors(validate.errs);
  }, [validate]);

  const generateEmail = async () => {
    if (!validate.valid) return;
    try {
      setGenerating(true);
      const payload = {
        template: validate.trimmed.template,
        yourName: validate.trimmed.yourName,
        companyName: validate.trimmed.companyName,
        investorName: validate.trimmed.investorName,
        valueProposition: validate.trimmed.valueProposition,
        keyTraction: validate.trimmed.keyTraction,
      } as any;

      const res = await generateInvestorEmail(payload);
      setEmailSubject(res.subject || "");
      setEmailBody(res.body || "");
    } catch (e: any) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const copyEmail = () => {
    if (!finalEmail) return;
    navigator.clipboard.writeText(finalEmail);
  };

  const sendEmail = () => {
    if (!emailSubject && !emailBody) return;
    const mailto = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Investor Email Generator</h2>
        <p className="text-muted-foreground mt-1">
          Create professional investor outreach emails in minutes
        </p>
      </div>

      {/* Template Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTemplate}
            onValueChange={setSelectedTemplate}
            disabled={templatesLoading || !!templatesError}
          >
            <SelectTrigger>
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
            <div
              style={{
                color: "#b91c1c",
                fontSize: "0.8rem",
                marginTop: "0.375rem",
              }}
            >
              {errors.template}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTemplate && (
        <>
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className={styles.form}>
              <div className={styles.formGrid}>
                <div>
                  <Label className={styles.lableWrapper} htmlFor="name">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (!touched.yourName)
                        setTouched({ ...touched, yourName: true });
                    }}
                    onBlur={() => setTouched({ ...touched, yourName: true })}
                    placeholder="John Smith"
                    maxLength={100}
                  />
                  {touched.yourName &&
                    formData.name.trim().length > 0 &&
                    errors.yourName && (
                      <div
                        style={{
                          color: "#b91c1c",
                          fontSize: "0.8rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {errors.yourName}
                      </div>
                    )}
                </div>
                <div>
                  <Label className={styles.lableWrapper} htmlFor="company">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (!touched.companyName)
                        setTouched({ ...touched, companyName: true });
                    }}
                    onBlur={() => setTouched({ ...touched, companyName: true })}
                    placeholder="Your Startup Inc."
                    maxLength={120}
                  />
                  {touched.companyName &&
                    formData.company.trim().length > 0 &&
                    errors.companyName && (
                      <div
                        style={{
                          color: "#b91c1c",
                          fontSize: "0.8rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {errors.companyName}
                      </div>
                    )}
                </div>
              </div>

              <div>
                <Label className={styles.lableWrapper} htmlFor="investor">
                  Investor Name
                </Label>
                <Input
                  id="investor"
                  value={formData.investor}
                  onChange={(e) => {
                    setFormData({ ...formData, investor: e.target.value });
                    if (!touched.investorName)
                      setTouched({ ...touched, investorName: true });
                  }}
                  onBlur={() => setTouched({ ...touched, investorName: true })}
                  placeholder="Alex Johnson"
                  maxLength={120}
                />
                {touched.investorName &&
                  formData.investor.trim().length > 0 &&
                  errors.investorName && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors.investorName}
                    </div>
                  )}
              </div>

              <div>
                <Label className={styles.lableWrapper} htmlFor="value-prop">
                  Value Proposition
                </Label>
                <Input
                  id="value-prop"
                  value={formData.valueProp}
                  onChange={(e) => {
                    setFormData({ ...formData, valueProp: e.target.value });
                    if (!touched.valueProposition)
                      setTouched({ ...touched, valueProposition: true });
                  }}
                  onBlur={() =>
                    setTouched({ ...touched, valueProposition: true })
                  }
                  placeholder="AI-powered project management"
                  maxLength={280}
                />
                {touched.valueProposition &&
                  formData.valueProp.trim().length > 0 &&
                  errors.valueProposition && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors.valueProposition}
                    </div>
                  )}
              </div>

              <div>
                <Label className={styles.lableWrapper} htmlFor="traction">
                  Key Traction
                </Label>
                <Input
                  id="traction"
                  value={formData.traction}
                  onChange={(e) => {
                    setFormData({ ...formData, traction: e.target.value });
                    if (!touched.keyTraction)
                      setTouched({ ...touched, keyTraction: true });
                  }}
                  onBlur={() => setTouched({ ...touched, keyTraction: true })}
                  placeholder="$50K MRR, 1000+ users"
                  maxLength={280}
                />
                {touched.keyTraction &&
                  formData.traction.trim().length > 0 &&
                  errors.keyTraction && (
                    <div
                      style={{
                        color: "#b91c1c",
                        fontSize: "0.8rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {errors.keyTraction}
                    </div>
                  )}
              </div>

              {selectedTemplate === "warm_introduction" && (
                <div>
                  <Label className={styles.lableWrapper} htmlFor="contact">
                    Mutual Contact
                  </Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder="Sarah Wilson"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className={styles.ctaWrap}>
            <Button
              onClick={generateEmail}
              size="lg"
              disabled={generating || !validate.valid}
              className={styles.generateBtn}
            >
              <Sparkles className={styles.ctaIcon} />
              {generating ? "Generating..." : "Generate Email"}
            </Button>
          </div>
        </>
      )}

      {(emailSubject || emailBody) && (
        <Card>
          <CardHeader>
            <div className={styles.emailHeader}>
              <CardTitle>Your Email</CardTitle>
              <div className={styles.emailActions}>
                <Button onClick={copyEmail} size="sm" variant="outline">
                  <Copy className={styles.smallIcon} />
                  Copy
                </Button>
                <Button
                  size="sm"
                  className={styles.sendBtn}
                  onClick={sendEmail}
                >
                  <Mail className={styles.smallIcon} />
                  Send
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={styles.emailPreview}>
              <pre>{finalEmail}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className={styles.tipsCard}>
        <CardContent className={styles.tipsContent}>
          <div className={styles.tipsInner}>
            <h3 className={styles.tipsTitle}>Pro Tips</h3>
            <ul className={styles.tipsList}>
              <li>• Research the investor's portfolio first</li>
              <li>• Keep emails under 150 words</li>
              <li>• Always include specific metrics</li>
              <li>• Follow up in 1-2 weeks if no response</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
