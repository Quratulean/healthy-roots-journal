import { Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";
import { useDisclaimer } from "@/hooks/useDisclaimer";

interface BlogPostProps {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

const BlogPost = ({ title, category, author, date, readTime, image, content }: BlogPostProps) => {
  // Fetch the active medical disclaimer
  const { data: disclaimer } = useDisclaimer("medical_disclaimer");

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4">{category}</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">By {author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{readTime}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-8 rounded-xl overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Share Buttons */}
      <div className="flex items-center gap-3 mb-8 pb-8 border-b">
        <span className="text-sm font-medium text-muted-foreground">Share:</span>
        <Button variant="outline" size="sm">
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button variant="outline" size="sm">
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
        <Button variant="outline" size="sm">
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
      </div>

      {/* Auto Medical Disclaimer - Top */}
      {disclaimer && (
        <div 
          className="mb-8"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(disclaimer.content) }} 
        />
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      </div>

      {/* Auto Medical Disclaimer - Bottom */}
      {disclaimer && (
        <div 
          className="mb-8"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(disclaimer.content) }} 
        />
      )}

      <Separator className="my-12" />

      {/* Author Bio */}
      <div className="bg-muted/30 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">About {author}</h3>
            <p className="text-muted-foreground">
              A certified health and wellness expert with over 10 years of experience in nutrition, 
              fitness, and holistic health. Passionate about helping people achieve their wellness goals 
              through evidence-based practices.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
