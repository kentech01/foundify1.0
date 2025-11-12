// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import {
//   FileText,
//   FileCheck,
//   MessageSquare,
//   Users,
//   Mail,
//   ArrowRight,
//   Loader2,
// } from "lucide-react";
// import { toast } from "sonner";
// import { useApiService } from "../services/api";
// import { useRecoilValue } from "recoil";
// import { currentUserAtom } from "../atoms/userAtom";
// import { useNavigate } from "react-router-dom";
// import { AIHiringAssistant } from "./AIHiringAssistant";
// import { InvestorEmailDraft } from "./InvestorEmailDraft";

// import React from "react";
// import { FeedbackCoach } from "./FeedbackCoach";
// import { LandingPageGenerator } from "./LandingPageGenerator";

// const tools = [
//   {
//     id: "invoice",
//     title: "Invoice Generator",
//     description: "Create professional PDF invoices instantly",
//     icon: FileText,
//     color: "bg-purple-500",
//     colorLight: "bg-purple-50",
//     buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
//     buttonText: "Generate Invoice",
//   },
//   {
//     id: "contracts",
//     title: "Contract Templates",
//     description: "NDA, Founder Agreement, and legal templates",
//     icon: FileCheck,
//     color: "bg-purple-500",
//     colorLight: "bg-purple-50",
//     buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
//     buttonText: "Browse Templates",
//   },
//   {
//     id: "feedback",
//     title: "360° Feedback Coach",
//     description: "Structure meaningful feedback for your team",
//     icon: MessageSquare,
//     color: "bg-purple-500",
//     colorLight: "bg-purple-50",
//     buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
//     buttonText: "Create Feedback",
//   },
//   {
//     id: "investor",
//     title: "Investor Email Draft",
//     description: "Professional outreach email templates",
//     icon: Mail,
//     color: "bg-purple-500",
//     colorLight: "bg-purple-50",
//     buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
//     buttonText: "Draft Email",
//   },
//   {
//     id: "ai-hiring",
//     title: "AI Hiring Assistant",
//     description: "Generate interview questions and evaluate candidates",
//     icon: Users,
//     color: "bg-pink-500",
//     colorLight: "bg-purple-50",
//     buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
//     buttonText: "AI Hiring Assistant",
//   },
//   {
//     id: "landing-page",
//     title: "Landing Page Generator",
//     description: "Generate a premium landing page for your startup",
//     icon: FileCheck,
//     color: "bg-pink-500",
//     colorLight: "bg-purple-50",
//     buttonColor: "bg-premium-purple hover:bg-premium-purple-dark",
//     buttonText: "Generate Landing Page",
//   },
// ];

// interface FounderEssentialsPageProps {
//   isPremium: boolean;
//   onUpgrade: () => void;
// }

// export function FounderEssentialsPage({
//   isPremium,
//   onUpgrade,
// }: FounderEssentialsPageProps) {
//   const navigate = useNavigate();
//   const [activeModal, setActiveModal] = useState<string | null>(null);
//   const apiService = useApiService();
//   const currentUser = useRecoilValue<any>(currentUserAtom);
//   const isLocked = false;

//   // Loading state while fetching the first pitch for Landing Page
//   const [isFetchingFirstPitch, setIsFetchingFirstPitch] = useState(false);

//   // Landing page generator modal state

//   const [selectedPitch, setSelectedPitch] = useState<any>(null);

//   const modalContentClass = "overflow-y-auto w-3/4 ";

//   // First pitch meta and premium landing status
//   const [firstPitchMeta, setFirstPitchMeta] = useState<any>(null);
//   const [firstPitchHasPremiumLanding, setFirstPitchHasPremiumLanding] =
//     useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const fp = await apiService.getFirstPitch();
//         if (fp) {
//           setFirstPitchMeta(fp);
//           setFirstPitchHasPremiumLanding(!!fp.hasLandingPagePremium);
//         }
//       } catch (_e) {}
//     })();
//   }, []);

//   // Refresh first pitch data after landing page generation
//   const refreshFirstPitch = async () => {
//     try {
//       const refreshed = await apiService.getFirstPitch();
//       if (refreshed) {
//         setFirstPitchMeta(refreshed);
//         setFirstPitchHasPremiumLanding(!!refreshed.hasLandingPagePremium);
//       }
//     } catch (_e) {
//       // no-op: keep previous state if refresh fails
//     }
//   };

//   const handleToolAction = async (toolId: string) => {
//     if (toolId === "invoice") {
//       navigate("/dashboard/invoices");
//       return;
//     }

//     if (toolId === "contracts") {
//       navigate("/dashboard/contracts");
//       return;
//     }

//     if (toolId === "investor") {
//       setActiveModal("investor");
//       return;
//     }

//     if (toolId === "feedback") {
//       setActiveModal("feedback");
//       return;
//     }

//     if (toolId === "landing-page") {
//       try {
//         if (firstPitchHasPremiumLanding) {
//           navigate(`/${firstPitchMeta.startupName}`);
//           return;
//         }

//         setIsFetchingFirstPitch(true);

//         const firstPitch = await apiService.getFirstPitch();

//         if (!firstPitch) {
//           toast.error("No first pitch found", {
//             description:
//               "Please create your first pitch to generate a premium landing page.",
//           });
//           return;
//         }

//         if (isLocked) {
//           onUpgrade();
//           return;
//         }

//         // Open landing page generator modal
//         setSelectedPitch(firstPitch);
//         setShowLandingPageGenerator(true);
//       } finally {
//         setIsFetchingFirstPitch(false);
//       }

//       return;
//     }

//     if (toolId === "ai-hiring") {
//       if (isLocked) {
//         onUpgrade();
//         return;
//       }
//       setActiveModal("ai-hiring");
//       return;
//     }
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           {/* <div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               Founder Essentials
//             </h2>
//             <p className="text-gray-600">
//               Essential tools to launch and grow your startup
//             </p>
//           </div>
//           {!isPremium && (
//             <Button
//               onClick={onUpgrade}
//               className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg"
//             >
//               Upgrade to Premium
//             </Button>
//           )} */}
//         </div>
//       </div>

//       {/* Tools Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {tools.map((tool) => {
//           const Icon = tool.icon;

//           return (
//             <Card
//               key={tool.id}
//               className={`border-2 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
//                 isLocked
//                   ? "border-gray-200 opacity-75"
//                   : "border-gray-100 hover:shadow-xl hover:-translate-y-1"
//               }`}
//             >
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`w-14 h-14 rounded-xl ${tool.colorLight} flex items-center justify-center`}
//                   >
//                     <Icon
//                       className={`h-7 w-7 ${tool.color.replace(
//                         "bg-",
//                         "text-"
//                       )}`}
//                     />
//                   </div>
//                 </div>
//                 <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
//                 <CardDescription className="text-sm text-gray-600">
//                   {tool.description}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button
//                   className={`w-full rounded-xl text-white ${
//                     isLocked
//                       ? "bg-gray-300 hover:bg-gray-400 cursor-not-allowed"
//                       : tool.buttonColor
//                   }`}
//                   onClick={() =>
//                     isLocked ? onUpgrade() : handleToolAction(tool.id)
//                   }
//                   disabled={
//                     isLocked ||
//                     (tool.id === "landing-page" && isFetchingFirstPitch)
//                   }
//                 >
//                   {isLocked ? (
//                     <>
//                       Unlock with Premium
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </>
//                   ) : tool.id === "landing-page" && isFetchingFirstPitch ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Loading...
//                     </>
//                   ) : (
//                     <>
//                       {tool.id === "landing-page" && firstPitchHasPremiumLanding
//                         ? "View Landing Page"
//                         : tool.buttonText}
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </>
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Investor Email Modal */}
//       <Dialog
//         open={activeModal === "investor"}
//         onOpenChange={() => setActiveModal(null)}
//       >
//         <DialogContent className={modalContentClass}>
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold flex items-center gap-2">
//               <Mail className="h-5 w-5 text-blue-600" />
//               Investor Email Generator
//             </DialogTitle>
//           </DialogHeader>
//           <InvestorEmailDraft />
//         </DialogContent>
//       </Dialog>

//       {/* Feedback Coach Modal */}
//       <Dialog
//         open={activeModal === "feedback"}
//         onOpenChange={() => setActiveModal(null)}
//       >
//         <DialogContent className={modalContentClass}>
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold flex items-center gap-2">
//               <MessageSquare className="h-5 w-5 text-pink-600" />
//               360° Feedback Coach
//             </DialogTitle>
//           </DialogHeader>
//           <FeedbackCoach />
//         </DialogContent>
//       </Dialog>

//       {/* AI Hiring Assistant Modal */}
//       <Dialog
//         open={activeModal === "ai-hiring"}
//         onOpenChange={() => setActiveModal(null)}
//       >
//         <DialogContent className={modalContentClass}>
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold flex items-center gap-2">
//               <Users className="h-5 w-5 text-purple-600" />
//               AI Hiring Assistant
//             </DialogTitle>
//             <DialogDescription>
//               Generate smart interview questions and evaluate candidates
//             </DialogDescription>
//           </DialogHeader>
//           <div className="mt-4">
//             <AIHiringAssistant />
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Landing Page Generator */}
//       <LandingPageGenerator
//         isOpen={showLandingPageGenerator}
//         onClose={() => setShowLandingPageGenerator(false)}
//         firstPitch={selectedPitch}
//         onSuccess={refreshFirstPitch}
//       />
//     </div>
//   );
// }
