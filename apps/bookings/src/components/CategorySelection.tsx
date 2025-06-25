import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    tagline: "Professional recording | Creative direction | Artist-focused",
    description:
      "State-of-the-art vocal recording for independent artists seeking commercial-quality sound with professional engineer guidance for maximum impact.",
  },
  {
    id: "empire-video-visual",
    emoji: "🎬",
    title: "Empire Video & Visual Production",
    tagline: "Cinematic quality | Creative direction | Social-ready",
    description:
      "Concept videos, storytelling from ideation through professional-quality output including cinematic lighting, camera work, and professional post-production.",
  },
  {
    id: "empire-photoshoot",
    emoji: "📸",
    title: "Empire Photoshoot",
    tagline: "Magazine-ready | Styled shoots | Brand imagery",
    description:
      "High-level photography for artists, creatives, and brands with professional styling and art direction for your visual identity and market presence.",
  },
  {
    id: "empire-events-entertainment",
    emoji: "🎭",
    title: "Empire Events & Entertainment",
    tagline: "Live experiences | Industry networking | Custom coverage",
    description:
      "Event planning, hosting, and professional coverage from intimate listening parties to full showcase events with complete professional documentation.",
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
      "Comprehensive artist development programs combining multiple services for complete creative projects and long-term career growth with ongoing support.",
  },
];

const CategorySelection = ({
  selectedCategory,
  onCategorySelect,
  onNext,
}: CategorySelectionProps) => {
  return (
    <Card className="bg-black/80 border-amber-500/30 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-2xl text-center">
          Choose Your Service Category
        </CardTitle>
        <p className="text-amber-400 text-center">
          Select the type of service you're looking for
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Category Grid - Matching screenshot layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedCategory === category.id
                  ? "bg-amber-600/20 border-amber-500 ring-2 ring-amber-500/50 transform scale-105"
                  : "bg-gray-800/60 border-gray-600 hover:border-amber-500/70 hover:bg-amber-900/10 hover:transform hover:scale-102"
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
                    {category.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {selectedCategory === category.id && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-semibold">
                      ✓ Selected
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Button */}
        <div className="text-center mt-8">
          <Button
            onClick={onNext}
            disabled={!selectedCategory}
            className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
          >
            Next: Select Services
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySelection;

// Export the categories data for use in other components
export { categories };
export type { CategoryData };
