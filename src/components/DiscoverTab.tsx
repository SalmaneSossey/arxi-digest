import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import SearchBar from "./SearchBar";
import PaperCard, { Paper } from "./PaperCard";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Search } from "lucide-react";

// Mock data for development
const MOCK_PAPERS: Paper[] = [
  {
    arxiv_id: "2401.01234",
    title: "Vision Transformers in the Wild: Scalable Visual Recognition for Real-World Applications",
    authors: ["A. Researcher", "B. Scientist", "C. Academic"],
    abstract: "We investigate Vision Transformer (ViT) performance on long-tailed datasets and propose novel architectural modifications that improve robustness across diverse visual domains. Our extensive experiments demonstrate significant improvements in few-shot learning scenarios and domain adaptation tasks.",
    url: "https://arxiv.org/abs/2401.01234",
    pdf_url: "https://arxiv.org/pdf/2401.01234.pdf",
    submitted_at: "2025-09-20T10:00:00Z",
    categories: ["cs.CV", "cs.LG"]
  },
  {
    arxiv_id: "2501.04567",
    title: "RAG without Tears: Lightweight Indexing for Efficient Retrieval-Augmented Generation",
    authors: ["C. Engineer", "D. Scholar"],
    abstract: "A lightweight retrieval-augmented generation approach that reduces computational overhead while maintaining high-quality text generation. Our method introduces novel indexing strategies that enable real-time retrieval across massive document collections.",
    url: "https://arxiv.org/abs/2501.04567",
    pdf_url: "https://arxiv.org/pdf/2501.04567.pdf",
    submitted_at: "2025-09-22T16:22:00Z",
    categories: ["cs.CL", "cs.IR"]
  },
  {
    arxiv_id: "2501.07890",
    title: "Diffusion Distillation at Scale: Fast Sampling for High-Resolution Image Generation",
    authors: ["E. Dev", "F. Analyst", "G. Researcher"],
    abstract: "We distill large diffusion models for faster sampling while preserving generation quality. Our approach achieves 10x speedup with minimal quality degradation across multiple high-resolution image generation tasks.",
    url: "https://arxiv.org/abs/2501.07890",
    pdf_url: "https://arxiv.org/pdf/2501.07890.pdf",
    submitted_at: "2025-09-23T08:12:00Z",
    categories: ["cs.CV", "cs.AI"]
  }
];

interface DiscoverTabProps {
  onSubscribe?: (query: string) => void;
  onSendToTelegram?: (paper: Paper) => void;
}

const DiscoverTab = ({ onSubscribe, onSendToTelegram }: DiscoverTabProps) => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPapers = async (query: string, pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Mock API call - replace with actual backend call
      // const response = await fetch(`/backend/api/v1/papers/search?q=${encodeURIComponent(query)}&max_results=30&sort_by=submittedDate&sort_order=desc&page=${pageNum}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock data based on query
      const filteredPapers = query.trim() 
        ? MOCK_PAPERS.filter(paper => 
            paper.title.toLowerCase().includes(query.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
            paper.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
          )
        : MOCK_PAPERS;

      if (append) {
        setPapers(prev => [...prev, ...filteredPapers]);
      } else {
        setPapers(filteredPapers);
      }
      
      // Simulate pagination
      setHasMore(pageNum < 2);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch papers";
      setError(errorMessage);
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setCurrentQuery(query);
    setPage(1);
    if (query.trim()) {
      fetchPapers(query, 1, false);
    } else {
      setPapers([]);
      setError(null);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && currentQuery.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPapers(currentQuery, nextPage, true);
    }
  }, [loading, hasMore, currentQuery, page]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  const renderEmptyState = () => (
    <Card className="shadow-soft border-sky-light/20 bg-gradient-to-br from-cloud-white to-sky-light/10">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-light to-accent rounded-full flex items-center justify-center mb-4 shadow-soft">
          <Search className="w-8 h-8 text-sky-deep" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Discover Latest Papers
        </h3>
        <p className="text-text-secondary text-center mb-6 max-w-md">
          Search for papers by topic, author, or keywords to find the newest research in your field.
        </p>
      </CardContent>
    </Card>
  );

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="shadow-card border-sky-light/20 bg-gradient-to-br from-cloud-white to-sky-light/10">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-full mb-3 bg-sky-light/30" />
            <Skeleton className="h-4 w-2/3 mb-4 bg-sky-light/20" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-5 w-12 bg-sky-light/20" />
              <Skeleton className="h-5 w-16 bg-sky-light/20" />
            </div>
            <Skeleton className="h-20 w-full mb-4 bg-sky-light/20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 bg-sky-light/20" />
              <Skeleton className="h-8 w-20 bg-sky-light/20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSearch(currentQuery)}
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!currentQuery.trim() && papers.length === 0 && !loading && renderEmptyState()}

      {papers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <PaperCard
              key={paper.arxiv_id}
              paper={paper}
              onSubscribe={onSubscribe}
              onSendToTelegram={onSendToTelegram}
              currentQuery={currentQuery}
            />
          ))}
        </div>
      )}

      {loading && renderSkeletons()}

      {/* Infinite scroll sentinel */}
      {hasMore && currentQuery.trim() && papers.length > 0 && (
        <div ref={sentinelRef} className="h-4" />
      )}

      {papers.length > 0 && !hasMore && (
        <div className="text-center py-8">
          <p className="text-text-secondary">That's all for now! ✨</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverTab;