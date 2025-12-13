"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { NetworkStatus } from "@/components/network-status";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu, FileText, Sparkles, Copy, Download, History, Trash2, X, Brain, Activity, Pill, Stethoscope, ClipboardList, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addSummaryRequest, getUserSummaries, deleteSummary, type SummaryRequest } from "@/lib/firestore";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

// Gemini API Key
const GEMINI_API_KEY = "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";

export default function SummarizerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<"symptoms" | "medication" | "diagnosis" | "treatment" | "general">("general");
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<SummaryRequest[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  // Utility to format Firestore Timestamp or Date
  const formatDate = (createdAt: Date | Timestamp | undefined): string => {
    if (!createdAt) return "Recently";
    const date = createdAt instanceof Timestamp ? createdAt.toDate() : createdAt;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (user) {
      loadSummaries().catch(() => {
        console.log("Could not load summaries, continuing without history");
        setLoadingHistory(false);
      });
    } else {
      setLoadingHistory(false);
    }
  }, [user]);

  const loadSummaries = async () => {
    if (!user) {
      setLoadingHistory(false);
      return;
    }

    try {
      setLoadingHistory(true);
      const userSummaries = await getUserSummaries(user.uid);
      setSummaries(userSummaries);
    } catch (error) {
      console.error("Error loading summaries:", error);
      // Don't show error toast, just fail silently
      setSummaries([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const generatedSummary = await generateMedicalSummary(inputText, category);
      setSummary(generatedSummary);

      toast.success("Summary generated successfully!");

      // Save to Firestore only if user is logged in
      if (user) {
        try {
          await addSummaryRequest(user.uid, inputText, generatedSummary, category);
          await loadSummaries();
        } catch (error) {
          console.error("Error saving summary:", error);
          // Don't show error to user, just log it
        }
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const generateMedicalSummary = async (text: string, category: string): Promise<string> => {
    const maxRetries = 5;
    const baseDelay = 3000;

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (!navigator.onLine) {
          throw new Error("You appear to be offline. Please check your internet connection.");
        }

        const endpoint = "https://openrouter.ai/api/v1/chat/completions";

        const systemPrompt = "You are an expert medical AI assistant specialized in analyzing and summarizing medical information. Provide clear, concise, and professionally structured responses focused on key medical insights and recommendations.";

        const userPrompt = `Analyze and summarize the following medical text based on the category: ${category.toUpperCase()}.

Medical Text:
${text}

Provide a comprehensive yet concise summary (under 250 words) that includes:
1. *Key Findings/Overview*: Main points from the text
2. *Important Details*: Critical information based on the category
3. *Recommendations*: Actionable insights or next steps
4. *Note*: Always remind to consult healthcare professionals for medical decisions

Format your response in markdown with clear sections and bullet points where appropriate.`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GEMINI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: userPrompt
              }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          if (response.status === 429) {
            if (attempt < maxRetries) {
              const waitTime = baseDelay * Math.pow(2, attempt);
              toast.info(`Rate limit reached. Retrying in ${waitTime / 1000} seconds...`);
              await delay(waitTime);
              continue;
            }
            throw new Error("Rate limit exceeded. Please try again in a few minutes.");
          } else if (response.status === 401 || response.status === 403) {
            throw new Error("API authentication failed. Please check API configuration.");
          } else if (response.status >= 500) {
            throw new Error("AI service temporarily unavailable. Please try again later.");
          } else {
            throw new Error(errorData?.error?.message || `API error: ${response.status}`);
          }
        }

        const data = await response.json();
        let summaryText = data.choices?.[0]?.message?.content?.trim() || "No summary generated.";

        // Clean response
        summaryText = summaryText
          .replace(/```markdown/g, "")
          .replace(/```/g, "")
          .trim();

        return summaryText;
      } catch (error) {
        if (error instanceof Error && error.message.includes('Rate limit') && attempt < maxRetries) {
          const waitTime = baseDelay * Math.pow(2, attempt);
          toast.info(`Retrying in ${waitTime / 1000} seconds...`);
          await delay(waitTime);
          continue;
        }

        console.error("Error calling Gemini API:", error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
          return `## ⚠ Network Error

*Unable to connect to the AI service*

- Please check your internet connection
- Ensure you're not behind a restrictive firewall
- Try refreshing the page and attempting again

*Note:* For urgent medical assistance, please consult your local healthcare provider immediately.`;
        }

        return `## ⚠ Error Summary

*${error instanceof Error ? error.message : 'Failed to generate summary'}*

- Please try again in a moment
- If the problem persists, contact support

*Note:* For accurate medical advice, always consult qualified healthcare professionals.`;
      }
    }

    return `## ⚠ Service Unavailable

*Rate limit exceeded after multiple attempts*

- The AI service is experiencing high demand
- Please wait a few minutes and try again

*Note:* For urgent medical concerns, consult a healthcare professional immediately.`;
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard!");
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical-summary-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded!");
  };

  const clearAll = () => {
    setInputText("");
    setSummary("");
    setCategory("general");
  };

  const deleteSummaryItem = async (summaryId: string) => {
    if (!summaryId) return;

    try {
      await deleteSummary(summaryId);
      toast.success("Summary deleted successfully!");

      // Reload summaries to update the list
      await loadSummaries();
    } catch (error) {
      console.error("Error deleting summary:", error);
      toast.error("Failed to delete summary");
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Modern Header with Gradient */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-purple-300 hover:text-white hover:bg-purple-700/30 lg:hidden h-10 w-10 rounded-xl transition-all"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
              </div>

            </div>
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <NetworkStatus />

            {/* Hero Section */}
            <div className="text-center space-y-3 py-6">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Medical Information Summarizer
              </h2>
              <p className="text-purple-200 text-sm sm:text-base max-w-2xl mx-auto">
                Transform complex medical reports into clear, actionable insights using advanced AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section - Redesigned */}
              <Card className="bg-card border-border rounded-2xl shadow-xl backdrop-blur-sm">
                <CardHeader className="border-b border-purple-500/20">
                  <CardTitle className="flex items-center space-x-3 text-xl text-white">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                      <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <span>Input Medical Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-3 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Select Category
                    </label>
                    <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                      <SelectTrigger className="bg-muted border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-xl h-12 hover:bg-muted/80 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground shadow-2xl rounded-xl">
                        <SelectItem value="general" className="hover:bg-purple-600/20 cursor-pointer rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-purple-400" />
                            <span>General Medical</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="symptoms" className="hover:bg-purple-600/20 cursor-pointer rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-red-400" />
                            <span>Symptoms & Signs</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medication" className="hover:bg-purple-600/20 cursor-pointer rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Pill className="h-4 w-4 text-blue-400" />
                            <span>Medications</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="diagnosis" className="hover:bg-purple-600/20 cursor-pointer rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4 text-green-400" />
                            <span>Diagnosis & Tests</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="treatment" className="hover:bg-purple-600/20 cursor-pointer rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-yellow-400" />
                            <span>Treatment Plans</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-3">
                      Medical Text
                      <span className="text-purple-400 ml-2">({inputText.length}/5000 characters)</span>
                    </label>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your medical information here...&#10;&#10;Examples:&#10;• Lab results and test reports&#10;• Doctor's notes and prescriptions&#10;• Symptom descriptions&#10;• Treatment plans&#10;• Medication lists"
                      className="bg-muted border-border text-foreground placeholder-muted-foreground min-h-[320px] resize-none focus:outline-none focus:ring-2 focus:ring-primary rounded-xl hover:bg-muted/80 transition-all"
                      maxLength={5000}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={generateSummary}
                      disabled={loading || !inputText.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      className="bg-muted border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive rounded-xl h-12 px-4 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section - Redesigned */}
              <Card className="bg-card border-border rounded-2xl shadow-xl backdrop-blur-sm">
                <CardHeader className="border-b border-purple-500/20">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <span>AI Analysis</span>
                    </div>
                    {summary && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={copySummary}
                          variant="ghost"
                          size="icon"
                          className="text-purple-300 hover:text-white hover:bg-purple-700/30 h-10 w-10 rounded-xl transition-all"
                          aria-label="Copy Summary"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={downloadSummary}
                          variant="ghost"
                          size="icon"
                          className="text-purple-300 hover:text-white hover:bg-purple-700/30 h-10 w-10 rounded-xl transition-all"
                          aria-label="Download Summary"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {summary ? (
                    <div className="bg-muted rounded-xl p-5 text-foreground whitespace-pre-wrap leading-relaxed min-h-[320px] max-h-[450px] overflow-y-auto border border-border prose prose-foreground dark:prose-invert max-w-none">
                      {summary}
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-xl p-8 text-center min-h-[320px] flex items-center justify-center border border-border">
                      <div className="space-y-4">
                        <div className="relative w-20 h-20 mx-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl opacity-20 animate-pulse"></div>
                          <div className="absolute inset-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                            <Brain className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <p className="text-purple-200 font-semibold">Ready to Analyze</p>
                        <p className="text-purple-300/70 text-sm max-w-xs mx-auto">
                          Enter your medical information and click "Generate Summary" to get AI-powered insights
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary History - Redesigned */}
            <Card className="bg-card border-border rounded-2xl shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="flex items-center space-x-3 text-xl text-white">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                    <History className="h-5 w-5 text-white" />
                  </div>
                  <span>Recent Summaries</span>
                  <Badge className="bg-purple-600/30 text-purple-200 border border-purple-500/30">
                    {summaries.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingHistory ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4"></RefreshCw>
                    <p className="text-purple-200">Loading summary history...</p>
                  </div>
                ) : summaries.length > 0 ? (
                  <div className="space-y-4">
                    {summaries.slice(0, 5).map((summary, index) => (
                      <Dialog
                        key={summary.id || index}
                        open={dialogOpen && selectedSummaryId === (summary.id || index.toString())}
                        onOpenChange={(open) => {
                          if (open) {
                            setSelectedSummaryId(summary.id || index.toString());
                            setDialogOpen(true);
                          } else {
                            setSelectedSummaryId(null);
                            setDialogOpen(false);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <div className="bg-muted/50 rounded-xl p-5 border border-border hover:bg-muted hover:border-border transition-all relative group cursor-pointer">
                            <div
                              onClick={() => {
                                setSelectedSummaryId(summary.id || index.toString());
                                setDialogOpen(true);
                              }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                                  {summary.category.charAt(0).toUpperCase() + summary.category.slice(1)}
                                </Badge>
                                <div className="flex items-center space-x-3">
                                  <span className="text-purple-300 text-xs">{formatDate(summary.createdAt)}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (summary.id) {
                                        deleteSummaryItem(summary.id);
                                      }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-300 hover:text-red-500 hover:bg-red-500/20 h-8 w-8 rounded-lg"
                                    aria-label="Delete Summary"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-purple-100 text-sm line-clamp-2 mb-2 leading-relaxed">
                                {summary.originalText.slice(0, 150)}...
                              </p>
                              <p className="text-purple-300/70 text-xs flex items-center">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {summary.summary.slice(0, 100)}...
                              </p>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border text-foreground max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl p-0 shadow-2xl">
                          <DialogHeader className="p-6 border-b border-border bg-muted/30">
                            <DialogTitle className="flex items-center space-x-3 text-xl">
                              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <span>Summary Details</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 p-6">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-1.5">
                                {summary.category.charAt(0).toUpperCase() + summary.category.slice(1)}
                              </Badge>
                              <span className="text-purple-300 text-sm">{formatDate(summary.createdAt)}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-200 mb-3 flex items-center">
                                <ClipboardList className="h-4 w-4 mr-2" />
                                Original Text
                              </h4>
                              <div className="bg-muted rounded-xl p-4 text-foreground text-sm whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto border border-border">
                                {summary.originalText}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-200 mb-3 flex items-center">
                                <Sparkles className="h-4 w-4 mr-2" />
                                AI-Generated Summary
                              </h4>
                              <div className="bg-slate-800/70 rounded-xl p-4 text-purple-50 text-sm whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto border border-purple-500/20 prose prose-invert prose-purple max-w-none prose-headings:text-purple-300">
                                {summary.summary}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl opacity-20"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <History className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <p className="text-purple-200 font-semibold mb-2">No summaries yet</p>
                    <p className="text-purple-300/70 text-sm">Generate your first medical summary to see it here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
