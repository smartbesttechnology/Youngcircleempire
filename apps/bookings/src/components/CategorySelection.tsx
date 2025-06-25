import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CategoryData {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
}

interface CategorySelectionProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onNext: () => void;
}

const categories: CategoryData[] = [
  {
    id: "empire-studio-session",
    emoji: "🎙️",
    title: "Empire Studio Session",
    tagline: "Professional recording | Creative Space | Artist-focused",
    description:
      "From quick vocal takes to full production camps, experience premium studio services designed for artists at every leve",
  },
  {
    id: "empire-video-visual",
    emoji: "🎬",
    title: "Empire Video & Visual Production",
    tagline: "Cinematic quality | Creative direction | Social-ready",
    description:
      "Complete visual storytelling from concept-based music videos to viral social content, all crafted with professional direction",
  },
  {
    id: "empire-photoshoot",
    emoji: "📸",
    title: "Empire Photoshoot",
    tagline: "Magazine-ready | Styled shoots | Brand imagery",
    description:
      "High-fashion photography for artists, couples, and brands with professional styling and creative direction",
  },
  {
    id: "empire-events-entertainment",
    emoji: "🎭",
    title: "Empire Events & Entertainment",
    tagline: "Live experiences | Industry networking | Custom coverage",
    description:
      "From exclusive listening parties to showcase nights, create memorable events with full professional coverage.",
  },
  {
    id: "promotion-distribution",
    emoji: "📢",
    title: "Promotion & Distribution",
    tagline: "Global reach | Playlist placement | Industry connections",
    description:
      "Comprehensive music marketing from DSP distribution to PR campaigns, playlist marketing and sync licensing to maximize your streaming presence.",
  },
  {
    id: "premium-artist-branding",
    emoji: "🎨",
    title: "Premium Artist Branding",
    tagline: "Visual identity | Professional image | Market positioning",
    description:
      "Complete brand development including visual identity, press kits, and business structuring to establish your professional market presence and industry credibility.",
  },
  {
    id: "empire-signature-packages",
    emoji: "📦",
    title: "Empire Signature Packages",
    tagline: "All-inclusive | Career development | Premium support",
    description:
      "Comprehensive packages combining multiple services for complete artist development and career advancement.",
  },
];

const CategorySelection = ({
  selectedCategory,
  onCategorySelect,
  onNext,
}: CategorySelectionProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-white text-2xl font-bold">
          Choose Your Service Category
        </h1>
        <p className="text-amber-400">
          Select the type of service you're looking for
        </p>
      </div>

      {/* Category Grid - Direct rendering without container padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 h-full hover:scale-105 hover:border-amber-500/70 hover:bg-amber-900/20 ${
              selectedCategory === category.id
                ? "bg-amber-600/20 border-amber-500 ring-2 ring-amber-500/50"
                : "bg-gray-800/60 border-gray-600"
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-6 h-full flex flex-col justify-between">
              {/* Icon and Title */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-4">{category.emoji}</div>
                <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                  {category.title}
                </h3>
                <p className="text-amber-400 text-sm font-medium mb-3">
                  {category.tagline}
                </p>
              </div>

              {/* Description */}
              <div className="flex-grow">
                <p className="text-gray-300 text-sm leading-relaxed text-center">
                  <span style={{ fontSize: "12px" }}>
                    {category.description}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Button - Fixed position on mobile when category is selected */}
      {selectedCategory && (
        <div className="text-center">
          <div className="md:relative fixed bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:right-auto z-50">
            <Button
              onClick={onNext}
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-black font-bold px-12 py-4 text-lg transition-all duration-300 shadow-lg md:shadow-none"
            >
              Next: Select Services
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelection;

// Export the categories data for use in other components
export { categories };
export type { CategoryData };
