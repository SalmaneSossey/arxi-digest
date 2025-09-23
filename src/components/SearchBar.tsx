import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SAMPLE_TOPICS = [
  "vision transformer",
  "retrieval augmented generation",
  "diffusion models",
  "graph neural networks",
  "multimodal alignment",
];

const SearchBar = ({ onSearch, placeholder = "e.g., vision transformer, RAG, diffusion", debounceMs = 500 }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-academic-slate-600" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base border-academic-slate-600/20 focus:border-primary focus:ring-primary/20"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-academic-slate-600 self-center">Popular topics:</span>
        {SAMPLE_TOPICS.map((topic) => (
          <Badge
            key={topic}
            variant="outline"
            className="cursor-pointer bg-academic-slate-50 text-academic-slate-700 border-academic-slate-600/20 hover:bg-academic-indigo-100 hover:text-academic-indigo-700 hover:border-academic-indigo-600/30 transition-smooth"
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;