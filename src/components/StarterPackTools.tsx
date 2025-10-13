import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  FileText,
  FileCheck,
  MessageSquare,
  Users,
  Mail,
  ClipboardList,
} from "lucide-react";
import React from "react";

const tools = [
  {
    id: 1,
    title: "Invoice Generator",
    description:
      "Create professional PDF invoices instantly with customizable templates",
    icon: FileText,
    premium: true,
  },
  {
    id: 2,
    title: "Contract Templates",
    description:
      "NDA, Founder Agreement, and essential legal templates ready to use",
    icon: FileCheck,
    premium: true,
  },
  {
    id: 3,
    title: "Feedback Coach",
    description: "Structure meaningful feedback for your team with AI guidance",
    icon: MessageSquare,
    premium: true,
  },
  {
    id: 4,
    title: "Founder Role Suggestions",
    description:
      "AI-powered role and responsibility mapping for your founding team",
    icon: Users,
    premium: true,
  },
  {
    id: 5,
    title: "Investor Email Draft",
    description:
      "Professional outreach email templates for investor communications",
    icon: Mail,
    premium: true,
  },
  {
    id: 6,
    title: "Customer Interview Guide",
    description:
      "Structured interview templates and questions for customer discovery",
    icon: ClipboardList,
    premium: true,
  },
];

export function StarterPackTools() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-premium-purple-100 px-4 py-2 border border-premium-purple mb-4">
            <span className="text-sm text-premium-purple-900 font-semibold">
              PREMIUM STARTER PACK
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Essential Tools for Every Founder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upgrade to Premium to unlock all six powerful tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className="shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-premium-purple/20 bg-gradient-to-br from-white to-premium-purple-50"
              >
                <CardHeader className="p-6">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-premium-purple text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
