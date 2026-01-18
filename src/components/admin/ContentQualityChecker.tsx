import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle, FileCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QualityIssue {
  type: "error" | "warning" | "info";
  message: string;
}

interface QualityScore {
  overall: number;
  readability: number;
  seo: number;
  wordCount: number;
  issues: QualityIssue[];
  hasDisclaimer: boolean;
  hasSources: boolean;
  hasReviewer: boolean;
}

interface ContentQualityCheckerProps {
  content: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  reviewerId?: string;
  postId?: string;
}

const ContentQualityChecker = ({
  content,
  title,
  excerpt,
  seoTitle,
  seoDescription,
  reviewerId,
  postId,
}: ContentQualityCheckerProps) => {
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState<QualityScore | null>(null);

  const calculateReadabilityScore = (text: string): number => {
    // Simple Flesch-Kincaid approximation
    const plainText = text.replace(/<[^>]*>/g, "");
    const sentences = plainText.split(/[.!?]+/).filter(Boolean).length || 1;
    const words = plainText.split(/\s+/).filter(Boolean).length || 1;
    const syllables = plainText.split(/[aeiouy]+/gi).length;
    
    // Higher score = easier to read (0-100)
    const fk = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.min(100, Math.max(0, fk));
  };

  const calculateSeoScore = (
    title: string,
    seoTitle: string,
    seoDescription: string,
    excerpt: string
  ): number => {
    let score = 0;
    
    // Title checks
    const effectiveTitle = seoTitle || title;
    if (effectiveTitle.length >= 30 && effectiveTitle.length <= 60) score += 25;
    else if (effectiveTitle.length >= 20) score += 15;
    
    // Meta description checks
    const effectiveDesc = seoDescription || excerpt;
    if (effectiveDesc.length >= 120 && effectiveDesc.length <= 160) score += 25;
    else if (effectiveDesc.length >= 80) score += 15;
    
    // Keyword presence (simplified check)
    if (effectiveTitle && effectiveDesc) {
      const titleWords = effectiveTitle.toLowerCase().split(/\s+/);
      const descContainsKeyword = titleWords.some(word => 
        word.length > 4 && effectiveDesc.toLowerCase().includes(word)
      );
      if (descContainsKeyword) score += 25;
    }
    
    // Has both title and description
    if (seoTitle && seoDescription) score += 25;
    else if (title && excerpt) score += 15;
    
    return score;
  };

  const checkContent = async () => {
    setChecking(true);
    
    try {
      const plainText = content.replace(/<[^>]*>/g, "");
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;
      const issues: QualityIssue[] = [];
      
      // Word count checks
      if (wordCount < 300) {
        issues.push({
          type: "error",
          message: `Content is too short (${wordCount} words). Aim for at least 300 words for SEO.`,
        });
      } else if (wordCount < 800) {
        issues.push({
          type: "warning",
          message: `Content is ${wordCount} words. For health topics, 800-1500 words performs better.`,
        });
      }
      
      // Title checks
      if (!title) {
        issues.push({ type: "error", message: "Title is required." });
      } else if (title.length > 60) {
        issues.push({
          type: "warning",
          message: "Title exceeds 60 characters and may be truncated in search results.",
        });
      }
      
      // Meta description checks
      const effectiveDesc = seoDescription || excerpt;
      if (!effectiveDesc) {
        issues.push({
          type: "error",
          message: "Meta description is missing. Add an excerpt or SEO description.",
        });
      } else if (effectiveDesc.length > 160) {
        issues.push({
          type: "warning",
          message: "Meta description exceeds 160 characters.",
        });
      }
      
      // Health content specific checks
      const hasDisclaimer = content.toLowerCase().includes("disclaimer") || 
        content.toLowerCase().includes("medical advice") ||
        content.toLowerCase().includes("consult");
      
      if (!hasDisclaimer) {
        issues.push({
          type: "warning",
          message: "No medical disclaimer detected in content. One will be auto-appended.",
        });
      }
      
      // Check for sources/references
      const hasSources = content.toLowerCase().includes("source") ||
        content.toLowerCase().includes("reference") ||
        content.toLowerCase().includes("study") ||
        content.toLowerCase().includes("research") ||
        content.includes("http");
      
      if (!hasSources) {
        issues.push({
          type: "warning",
          message: "No sources or references detected. Health content should cite sources.",
        });
      }
      
      // Check for medical reviewer
      const hasReviewer = !!reviewerId;
      if (!hasReviewer) {
        issues.push({
          type: "info",
          message: "No medical reviewer assigned. Consider adding one for credibility.",
        });
      }
      
      // Calculate scores
      const readability = calculateReadabilityScore(content);
      const seo = calculateSeoScore(title, seoTitle, seoDescription, excerpt);
      
      // Overall score
      let overall = 0;
      overall += readability * 0.3;
      overall += seo * 0.3;
      overall += wordCount >= 800 ? 20 : (wordCount >= 300 ? 10 : 0);
      overall += hasDisclaimer ? 10 : 0;
      overall += hasSources ? 10 : 0;
      
      // Reduce score for issues
      const errorCount = issues.filter(i => i.type === "error").length;
      const warningCount = issues.filter(i => i.type === "warning").length;
      overall -= errorCount * 10;
      overall -= warningCount * 5;
      overall = Math.min(100, Math.max(0, overall));
      
      const qualityScore: QualityScore = {
        overall: Math.round(overall),
        readability: Math.round(readability),
        seo: Math.round(seo),
        wordCount,
        issues,
        hasDisclaimer,
        hasSources,
        hasReviewer,
      };
      
      setScore(qualityScore);
      
      // Save to database if postId exists
      if (postId) {
        await supabase
          .from("content_quality_scores")
          .upsert({
            post_id: postId,
            readability_score: qualityScore.readability,
            word_count: wordCount,
            has_disclaimer: hasDisclaimer,
            has_sources: hasSources,
            has_reviewer: hasReviewer,
            seo_score: seo,
            overall_score: overall,
            issues: issues as any,
            checked_at: new Date().toISOString(),
          }, { onConflict: 'post_id' });
      }
      
    } catch (error) {
      console.error("Error checking content quality:", error);
      toast.error("Failed to check content quality");
    } finally {
      setChecking(false);
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Content Quality</CardTitle>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkContent}
            disabled={checking || !content}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {checking ? "Checking..." : "Check Quality"}
          </Button>
        </div>
        <CardDescription>
          Analyze readability, SEO, and health content compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {score ? (
          <>
            {/* Overall Score */}
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </p>
              <Progress 
                value={score.overall} 
                className="mt-2"
              />
            </div>
            
            {/* Individual Scores */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">Readability</p>
                <p className={`text-xl font-semibold ${getScoreColor(score.readability)}`}>
                  {score.readability}
                </p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">SEO</p>
                <p className={`text-xl font-semibold ${getScoreColor(score.seo)}`}>
                  {score.seo}
                </p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">Words</p>
                <p className="text-xl font-semibold">{score.wordCount}</p>
              </div>
            </div>
            
            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={score.hasDisclaimer ? "default" : "secondary"}>
                {score.hasDisclaimer ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                Disclaimer
              </Badge>
              <Badge variant={score.hasSources ? "default" : "secondary"}>
                {score.hasSources ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                Sources
              </Badge>
              <Badge variant={score.hasReviewer ? "default" : "secondary"}>
                {score.hasReviewer ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                Reviewer
              </Badge>
            </div>
            
            {/* Issues */}
            {score.issues.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Issues</p>
                {score.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 text-sm p-2 rounded ${
                      issue.type === "error"
                        ? "bg-red-50 text-red-700"
                        : issue.type === "warning"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {issue.type === "error" ? (
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : issue.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {issue.message}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <FileCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click "Check Quality" to analyze your content</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentQualityChecker;
