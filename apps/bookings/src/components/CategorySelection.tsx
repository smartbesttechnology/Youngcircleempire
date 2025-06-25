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
    tagline: "Hit-focused | Vocal takes",
    description:
      "High-end vocal recording for independent artists seeking commercial-quality sound with professional engineer guidance.",
  },
  {
    id: "empire-video-visual",
    emoji: "🎬",
    title: "Empire Video & Visual Production",
    tagline: "Cinematic quality | Creative direction | Social-ready",
    description:
      "Concept videos, storytelling from ideation through professional-quality output including lighting, camera work, and editing direction.",
  },
  {
    id: "empire-photoshoot",
    emoji: "📸",
    title: "Empire Photoshoot",
    tagline: "Magazine-ready | Styled shoots | Brand imagery",
    description:
      "High-level photography for artists, creatives, and brands with professional styling and art direction for your visual identity.",
  },
  {
    id: "empire-events-entertainment",
    emoji: "🎭",
    title: "Empire Events & Entertainment",
    tagline: "Live experiences | Industry networking | Custom coverage",
    description:
      "Event planning, hosting, and professional coverage from intimate listening parties to full showcase events with full professional coverage.",
  },
  {
    id: "promotion-distribution",
    emoji: "📢",
    title: "Promotion & Distribution",
    tagline: "Global reach | Playlist placement | Industry connections",
    description:
      "Comprehensive music marketing from DSP distribution to PR campaigns, playlist marketing and sync licensing to build your streaming presence.",
  },
  {
    id: "premium-artist-branding",
    emoji: "🎨",
    title: "Premium Artist Branding",
    tagline: "Visual identity | Professional image | Market positioning",
    description:
      "Complete brand development including visual identity, press kits, and business structuring to establish your professional market presence.",
  },
  {
    id: "empire-signature-packages",
    emoji: "📦",
    title: "Empire Signature Packages",
    tagline: "All-inclusive | Career development | Premium support",
    description:
      "Comprehensive artist development programs combining multiple services for complete creative projects and long-term career growth.",
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Choose Your Service Category
        </h2>
        <p className="text-amber-400">
          Select the type of service you're looking for
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-amber-600/20 border-amber-500 ring-2 ring-amber-500/50"
                : "bg-gray-800/50 border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/70"
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl mb-3">{category.emoji}</div>
              <h3 className="text-white font-bold text-lg">{category.title}</h3>
              <p className="text-amber-400 text-sm font-medium">
                {category.tagline}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Button */}
      <div className="text-center">
        <Button
          onClick={onNext}
          disabled={!selectedCategory}
          className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CategorySelection;

// Export the categories data for use in other components
export { categories };
export type { CategoryData };
