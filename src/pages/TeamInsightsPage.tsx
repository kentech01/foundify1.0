import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Users,
  Plus,
  Eye,
  Calendar,
  Sparkles,
  TrendingUp,
  FileText,
  X,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface FeedbackEntry {
  id: string;
  date: string;
  type: "Quarterly" | "Yearly" | "Probation" | "Custom";
  summary: string;
  strengths: string;
  improvements: string;
  goals: string;
}

interface RecordItem {
  id: string;
  date: string;
  startDate: string;
  endDate: string;
  type: "Vacation" | "Leave" | "Other";
  description: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Probation" | "Contractor";
  lastFeedback: string;
  feedbackType: "Quarterly" | "Yearly" | "Probation" | "Custom";
  feedbackHistory: FeedbackEntry[];
  records: RecordItem[];
}

export function TeamInsightsPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Engineer",
      status: "Active",
      lastFeedback: "Dec 15, 2024",
      feedbackType: "Quarterly",
      feedbackHistory: [
        {
          id: "f1",
          date: "Dec 15, 2024",
          type: "Quarterly",
          summary:
            "Excellent performance on Q4 projects. Strong technical leadership and mentorship.",
          strengths:
            "Consistently delivers high-quality code, excellent problem-solving skills, great team collaboration and mentorship to junior developers.",
          improvements:
            "Time management on multiple concurrent projects could be improved. Consider using task prioritization frameworks.",
          goals:
            "Lead architecture for new platform migration, mentor 2 junior developers, improve code review turnaround time.",
        },
        {
          id: "f2",
          date: "Sep 10, 2024",
          type: "Quarterly",
          summary:
            "Strong quarter with consistent delivery and quality improvements.",
          strengths:
            "Technical expertise in backend systems, proactive in identifying potential issues.",
          improvements: "Documentation practices could be more thorough.",
          goals:
            "Improve system documentation, take ownership of critical infrastructure projects.",
        },
      ],
      records: [
        {
          id: "r1",
          date: "Dec 1, 2024",
          startDate: "Dec 20, 2024",
          endDate: "Jan 3, 2025",
          type: "Vacation",
          description: "2 weeks annual leave - Holiday break",
        },
        {
          id: "r2",
          date: "Aug 15, 2024",
          startDate: "Aug 20, 2024",
          endDate: "Aug 22, 2024",
          type: "Leave",
          description: "Personal leave",
        },
      ],
    },
    {
      id: "2",
      name: "Marcus Chen",
      role: "Product Designer",
      status: "Active",
      lastFeedback: "Nov 30, 2024",
      feedbackType: "Yearly",
      feedbackHistory: [
        {
          id: "f3",
          date: "Nov 30, 2024",
          type: "Yearly",
          summary:
            "Outstanding design work throughout the year. Consistently delivers user-centric solutions.",
          strengths:
            "Strong user research skills, beautiful visual design, excellent cross-functional collaboration with engineering team.",
          improvements:
            "Could be more proactive in stakeholder communication, especially during early design phases.",
          goals:
            "Establish comprehensive design system, mentor junior designers, lead major product redesign initiative.",
        },
      ],
      records: [],
    },
    {
      id: "3",
      name: "Emma Williams",
      role: "Junior Developer",
      status: "Probation",
      lastFeedback: "Dec 10, 2024",
      feedbackType: "Probation",
      feedbackHistory: [
        {
          id: "f4",
          date: "Dec 10, 2024",
          type: "Probation",
          summary:
            "Good progress during first 60 days. Shows eagerness to learn and adapt.",
          strengths:
            "Quick learner, asks good questions, proactive in seeking feedback, positive attitude.",
          improvements:
            "Understanding of code review process, testing practices need development.",
          goals:
            "Complete onboarding modules, ship first feature independently, improve test coverage knowledge.",
        },
      ],
      records: [],
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    status: "Active" as const,
  });

  const [newFeedback, setNewFeedback] = useState({
    type: "Quarterly" as const,
    strengths: "",
    improvements: "",
    goals: "",
  });

  const [newRecord, setNewRecord] = useState({
    type: "Vacation" as const,
    startDate: "",
    endDate: "",
    description: "",
  });

  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      role: newEmployee.role,
      status: newEmployee.status,
      lastFeedback: "Not yet",
      feedbackType: "Quarterly",
      feedbackHistory: [],
      records: [],
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: "", role: "", status: "Active" });
    setShowAddEmployee(false);
    toast.success("Team member added successfully");
  };

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);

    setTimeout(() => {
      const summary = `${newFeedback.type} Review - ${new Date().toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      )}

${selectedEmployee?.name} has demonstrated ${
        newFeedback.strengths.toLowerCase().includes("strong")
          ? "exceptional"
          : "solid"
      } performance this period. Key strengths include ${newFeedback.strengths
        .toLowerCase()
        .substring(0, 50)}...

Areas for continued growth: ${newFeedback.improvements
        .toLowerCase()
        .substring(0, 50)}...

Looking ahead, focus on: ${newFeedback.goals
        .toLowerCase()
        .substring(0, 50)}...`;

      setGeneratedSummary(summary);
      setIsGeneratingSummary(false);
      toast.success("AI summary generated!");
    }, 1500);
  };

  const handleSaveFeedback = () => {
    if (
      !selectedEmployee ||
      !newFeedback.strengths ||
      !newFeedback.improvements ||
      !newFeedback.goals
    ) {
      toast.error("Please fill in all required feedback fields");
      return;
    }

    const feedback: FeedbackEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      type: newFeedback.type,
      summary:
        generatedSummary ||
        `${newFeedback.type} feedback for ${selectedEmployee.name}`,
      strengths: newFeedback.strengths,
      improvements: newFeedback.improvements,
      goals: newFeedback.goals,
    };

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              lastFeedback: feedback.date,
              feedbackType: feedback.type,
              feedbackHistory: [feedback, ...emp.feedbackHistory],
            }
          : emp
      )
    );

    setNewFeedback({
      type: "Quarterly",
      strengths: "",
      improvements: "",
      goals: "",
    });
    setGeneratedSummary("");
    setShowAddFeedback(false);
    setShowEmployeeProfile(true);
    toast.success("Feedback saved successfully");
  };

  const handleSaveRecord = () => {
    if (!selectedEmployee || !newRecord.startDate || !newRecord.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const record: RecordItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      startDate: newRecord.startDate,
      endDate: newRecord.endDate,
      type: newRecord.type,
      description: newRecord.description,
    };

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              records: [record, ...emp.records],
            }
          : emp
      )
    );

    setNewRecord({
      type: "Vacation",
      startDate: "",
      endDate: "",
      description: "",
    });
    setShowAddRecord(false);
    setShowEmployeeProfile(true);
    toast.success("Record added successfully");
  };

  const handleDeleteRecord = (recordId: string) => {
    if (!selectedEmployee) return;

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              records: emp.records.filter((r) => r.id !== recordId),
            }
          : emp
      )
    );

    setSelectedEmployee({
      ...selectedEmployee,
      records: selectedEmployee.records.filter((r) => r.id !== recordId),
    });

    toast.success("Record deleted");
  };

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200";
      case "Probation":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Contractor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "";
    }
  };

  const getFeedbackTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Quarterly":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "Yearly":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "Probation":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "Custom":
        return "border-gray-200 bg-gray-50 text-gray-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600 mt-2 text-base">
          Structured feedback, growth tracking, and team records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-gray-100 rounded-[10px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Team Members</p>
                <p className="text-[50px] font-bold text-[#252952] leading-none">
                  {employees.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-[10px] bg-[#eef0ff] flex items-center justify-center">
                <Users className="h-7 w-7 text-[#252952]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-[10px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-[50px] font-bold text-[#252952] leading-none">
                  {employees.filter((e) => e.status === "Active").length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-[10px] bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 rounded-[10px] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Recent Feedback</p>
                <p className="text-[50px] font-bold text-[#252952] leading-none">
                  {employees.filter((e) => e.feedbackHistory.length > 0).length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-[10px] bg-purple-50 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team List */}
      <Card className="border-2 border-gray-100 rounded-[10px] shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[20px] font-semibold text-[#252952]">
              Team Overview
            </CardTitle>
            <Button
              onClick={() => setShowAddEmployee(true)}
              className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px] h-[48px] px-6"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                className="border border-gray-200 hover:border-[#252952]/20 hover:shadow-md transition-all rounded-[10px]"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Employee Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-[10px] bg-[#eef0ff] flex items-center justify-center text-[#252952] font-bold text-base flex-shrink-0">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#252952] text-[18px] mb-1">
                          {employee.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {employee.role}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={`${getStatusColor(
                              employee.status
                            )} border text-xs px-2 py-0.5`}
                          >
                            {employee.status}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            Last feedback: {employee.lastFeedback}
                          </div>
                          {employee.feedbackHistory.length > 0 && (
                            <Badge
                              variant="outline"
                              className={`${getFeedbackTypeBadgeColor(
                                employee.feedbackType
                              )} border text-xs px-2 py-0.5`}
                            >
                              {employee.feedbackType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowEmployeeProfile(true);
                        }}
                        className="rounded-[10px] border-2 border-gray-200 hover:border-[#252952] hover:bg-[#eef0ff]"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowAddFeedback(true);
                          setShowEmployeeProfile(false);
                        }}
                        className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Feedback
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {employees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="font-semibold text-[#252952] mb-2 text-[18px]">
                  No team members yet
                </h3>
                <p className="text-sm mb-6">
                  Add your first team member to start tracking feedback and
                  growth
                </p>
                <Button
                  onClick={() => setShowAddEmployee(true)}
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
        <DialogContent className="sm:max-w-md h-auto max-h-[90vh] overflow-y-auto rounded-[10px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-[#252952]">
              Add Team Member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input
                placeholder="Sarah Johnson"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Role *</Label>
              <Input
                placeholder="Senior Engineer"
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
                className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <select
                value={newEmployee.status}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    status: e.target.value as typeof newEmployee.status,
                  })
                }
                className="w-full p-2 border-2 border-gray-200 rounded-[10px] focus:border-[#252952] focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddEmployee(false)}
                className="flex-1 rounded-[10px] border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEmployee}
                className="flex-1 bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
              >
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Feedback Dialog */}
      <Dialog open={showAddFeedback} onOpenChange={setShowAddFeedback}>
        <DialogContent className="sm:max-w-2xl h-auto max-h-[90vh] overflow-y-auto rounded-[10px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-[#252952]">
              Add Feedback
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Provide structured feedback for {selectedEmployee?.name}
            </p>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Feedback Type</Label>
              <select
                value={newFeedback.type}
                onChange={(e) =>
                  setNewFeedback({
                    ...newFeedback,
                    type: e.target.value as typeof newFeedback.type,
                  })
                }
                className="w-full p-2 border-2 border-gray-200 rounded-[10px] focus:border-[#252952] focus:outline-none"
              >
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="Probation">Probation</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Strengths *</Label>
              <Textarea
                placeholder="What has this person done exceptionally well? Key strengths observed..."
                value={newFeedback.strengths}
                onChange={(e) =>
                  setNewFeedback({ ...newFeedback, strengths: e.target.value })
                }
                className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952] min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Areas to Improve *</Label>
              <Textarea
                placeholder="What areas could they focus on? Be specific and constructive..."
                value={newFeedback.improvements}
                onChange={(e) =>
                  setNewFeedback({
                    ...newFeedback,
                    improvements: e.target.value,
                  })
                }
                className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952] min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Goals for Next Period *</Label>
              <Textarea
                placeholder="What should they focus on in the coming period?..."
                value={newFeedback.goals}
                onChange={(e) =>
                  setNewFeedback({ ...newFeedback, goals: e.target.value })
                }
                className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952] min-h-[100px]"
              />
            </div>

            {generatedSummary && (
              <div className="p-4 bg-[#f8fafc] rounded-[10px] border border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-[#252952] flex-shrink-0 mt-0.5" />
                  <Label className="text-sm font-medium">AI Summary</Label>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {generatedSummary}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleGenerateSummary}
                disabled={
                  isGeneratingSummary ||
                  !newFeedback.strengths ||
                  !newFeedback.improvements
                }
                className="flex-1 rounded-[10px] border-2 border-[#252952] text-[#252952] hover:bg-[#eef0ff]"
              >
                {isGeneratingSummary ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#252952] border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Summary
                  </>
                )}
              </Button>
              <Button
                onClick={handleSaveFeedback}
                className="flex-1 bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
              >
                Save Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
        <DialogContent className="sm:max-w-md h-auto max-h-[90vh] overflow-y-auto rounded-[10px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-[#252952]">
              Add Record
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Add administrative record for {selectedEmployee?.name}
            </p>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Record Type</Label>
              <select
                value={newRecord.type}
                onChange={(e) =>
                  setNewRecord({
                    ...newRecord,
                    type: e.target.value as typeof newRecord.type,
                  })
                }
                className="w-full p-2 border-2 border-gray-200 rounded-[10px] focus:border-[#252952] focus:outline-none"
              >
                <option value="Vacation">Vacation / Time Off</option>
                <option value="Leave">Leave</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date *</Label>
                <Input
                  type="date"
                  value={newRecord.startDate}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, startDate: e.target.value })
                  }
                  className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date *</Label>
                <Input
                  type="date"
                  value={newRecord.endDate}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, endDate: e.target.value })
                  }
                  className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description (optional)</Label>
              <Textarea
                placeholder="Add notes about this record..."
                value={newRecord.description}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, description: e.target.value })
                }
                className="rounded-[10px] border-2 border-gray-200 focus:border-[#252952]"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddRecord(false)}
                className="flex-1 rounded-[10px] border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRecord}
                className="flex-1 bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
              >
                Save Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Profile Dialog */}
      <Dialog
        open={showEmployeeProfile}
        onOpenChange={setShowEmployeeProfile}
      >
        <DialogContent className="sm:max-w-4xl h-auto max-h-[80vh] overflow-y-auto rounded-[10px] p-0">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <button
              onClick={() => setShowEmployeeProfile(false)}
              className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </button>

            <div className="flex items-center gap-4 pr-8">
              <div className="w-16 h-16 rounded-[10px] bg-[#eef0ff] flex items-center justify-center text-[#252952] font-bold text-xl flex-shrink-0">
                {selectedEmployee?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-[25px] font-bold text-[#252952]">
                  {selectedEmployee?.name}
                </h2>
                <p className="text-base text-gray-600">
                  {selectedEmployee?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="feedback" className="px-6 pb-6">
            <TabsList className="grid w-full grid-cols-2 rounded-[10px] bg-[#f8fafc] p-1 mb-6">
              <TabsTrigger
                value="feedback"
                className="rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#252952] data-[state=active]:shadow-sm text-gray-600 font-medium"
              >
                Feedback
              </TabsTrigger>
              <TabsTrigger
                value="records"
                className="rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#252952] data-[state=active]:shadow-sm text-gray-600 font-medium"
              >
                Records
              </TabsTrigger>
            </TabsList>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4 mt-0">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => {
                    setShowEmployeeProfile(false);
                    setShowAddFeedback(true);
                  }}
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feedback
                </Button>
              </div>

              {selectedEmployee?.feedbackHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No feedback history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEmployee?.feedbackHistory.map((feedback) => (
                    <Card
                      key={feedback.id}
                      className="border border-gray-200 rounded-[10px] bg-[#f8fafc]"
                    >
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`${getFeedbackTypeBadgeColor(
                                feedback.type
                              )} border text-xs px-2 py-1`}
                            >
                              {feedback.type}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {feedback.date}
                            </span>
                          </div>
                        </div>

                        {/* AI Summary */}
                        <p className="text-sm text-gray-600 italic mb-6 border-l-2 border-[#252952] pl-4">
                          {feedback.summary}
                        </p>

                        {/* Feedback Sections */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-[#252952] mb-2">
                              Strengths
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {feedback.strengths}
                            </p>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-semibold text-[#252952] mb-2">
                              Areas to Improve
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {feedback.improvements}
                            </p>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-semibold text-[#252952] mb-2">
                              Goals
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {feedback.goals}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Records Tab */}
            <TabsContent value="records" className="space-y-4 mt-0">
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => {
                    setShowEmployeeProfile(false);
                    setShowAddRecord(true);
                  }}
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </div>

              {selectedEmployee?.records.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEmployee?.records.map((record) => (
                    <Card
                      key={record.id}
                      className="border border-gray-200 rounded-[10px] bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 bg-gray-50"
                              >
                                {record.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(record.startDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(record.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            {record.description && (
                              <p className="text-sm text-gray-700">
                                {record.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[8px]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}


