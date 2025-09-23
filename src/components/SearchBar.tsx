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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base border-sky-light/50 focus:border-sky-blue focus:ring-sky-blue/20 bg-gradient-to-r from-cloud-white to-sky-light/20"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-text-secondary self-center">Popular topics:</span>
        {SAMPLE_TOPICS.map((topic) => (
          <Badge
            key={topic}
            variant="outline"
            className="cursor-pointer bg-gradient-to-r from-sky-light/50 to-cloud-soft text-sky-deep border-sky-light/30 hover:from-sunset-pink/20 hover:to-sunset-orange/20 hover:text-sunset-orange hover:border-sunset-orange/50 transition-smooth transform hover:scale-105"
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