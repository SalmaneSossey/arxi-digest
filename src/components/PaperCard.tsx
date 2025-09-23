import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Send, Plus, ChevronDown, ChevronUp } from "lucide-react";

export interface Paper {
  arxiv_id: string;
  title: string;
  authors: string[];
  abstract: string;
  url?: string;
  pdf_url?: string;
  submitted_at?: string;
  categories?: string[];
}

interface PaperCardProps {
  paper: Paper;
  onSubscribe?: (query: string) => void;
  onSendToTelegram?: (paper: Paper) => void;
  currentQuery?: string;
}

const PaperCard = ({ paper, onSubscribe, onSendToTelegram, currentQuery }: PaperCardProps) => {
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateAbstract = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <Card className="h-full shadow-card hover:shadow-glow transition-smooth group border-sky-light/20 bg-gradient-to-br from-cloud-white to-sky-light/10">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex-1">
          <h3 className="font-academic text-lg font-semibold text-text-primary leading-tight mb-3 group-hover:text-sky-deep transition-smooth">
            {paper.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-text-secondary">
            <span>{paper.authors.slice(0, 3).join(", ")}</span>
            {paper.authors.length > 3 && (
              <span>+ {paper.authors.length - 3} more</span>
            )}
            {paper.submitted_at && (
              <>
                <span>•</span>
                <span>{formatDate(paper.submitted_at)}</span>
              </>
            )}
          </div>

          {/* Categories */}
          {paper.categories && paper.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {paper.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-sky-light to-accent text-sky-deep hover:from-accent hover:to-sky-light transition-smooth border-0"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Abstract */}
          <div className="mb-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              {showFullAbstract ? paper.abstract : truncateAbstract(paper.abstract)}
            </p>
            {paper.abstract.length > 300 && (
              <button
                onClick={() => setShowFullAbstract(!showFullAbstract)}
                className="text-xs text-sky-deep hover:text-primary mt-2 flex items-center gap-1 transition-smooth"
              >
                {showFullAbstract ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-sky-light/30">
          {paper.pdf_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(paper.pdf_url, "_blank")}
              className="flex items-center gap-1 border-sky-light/50 text-sky-deep hover:bg-sky-light/50 hover:border-sky-blue/50 transition-smooth"
            >
              <ExternalLink className="w-3 h-3" />
              PDF
            </Button>
          )}
          
          {onSubscribe && currentQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSubscribe(currentQuery)}
              className="flex items-center gap-1 border-sunset-orange/50 text-sunset-orange hover:bg-sunset-orange/10 hover:border-sunset-orange transition-smooth"
            >
              <Plus className="w-3 h-3" />
              Subscribe
            </Button>
          )}
          
          {onSendToTelegram && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendToTelegram(paper)}
              className="flex items-center gap-1 border-sky-twilight/50 text-sky-twilight hover:bg-sky-twilight/10 hover:border-sky-twilight transition-smooth"
            >
              <Send className="w-3 h-3" />
              Send
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaperCard;