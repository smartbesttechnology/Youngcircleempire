import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface EquipmentCategoryData {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
}

interface EquipmentCategorySelectionProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onNext: () => void;
}

const equipmentCategories: EquipmentCategoryData[] = [
  {
    id: "audio-equipment",
    emoji: "🎧",
    title: "Audio Equipment",
    tagline: "Microphones | Headphones | Monitors | Interfaces",
    description:
      "Professional audio gear for recording, monitoring, and live sound applications. From studio microphones to reference monitors.",
  },
  {
    id: "recording-equipment",
    emoji: "🎛️",
    title: "Recording Equipment",
    tagline: "Interfaces | Preamps | Compressors | Processors",
    description:
      "Complete recording chain equipment including audio interfaces, microphone preamps, and signal processors for professional recordings.",
  },
  {
    id: "instruments",
    emoji: "🎸",
    title: "Instruments",
    tagline: "Keyboards | Guitars | Drums | Bass",
    description:
      "High-quality musical instruments for recording sessions, live performances, and creative projects.",
  },
  {
    id: "video-equipment",
    emoji: "📹",
    title: "Video Equipment",
    tagline: "Cameras | Lighting | Tripods | Accessories",
    description:
      "Professional video production equipment including cinema cameras, LED lighting, and support gear for content creation.",
  },
];

const EquipmentCategorySelection = ({
  selectedCategory,
  onCategorySelect,
  onNext,
}: EquipmentCategorySelectionProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-teal-600 text-2xl font-bold">
          Choose Equipment Category
        </h1>
        <p className="text-teal-400">
          Select the type of equipment you need for your project
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {equipmentCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 h-full hover:scale-105 hover:border-teal-500/70 hover:bg-teal-900/20 ${
              selectedCategory === category.id
                ? "bg-teal-600/20 border-teal-500 ring-2 ring-teal-500/50"
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
                <p className="text-teal-400 text-sm font-medium mb-3">
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

      {/* Next Button */}
      {selectedCategory && (
        <div className="text-center">
          <div className="md:relative fixed bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:right-auto z-50">
            <Button
              onClick={onNext}
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-12 py-4 text-lg transition-all duration-300 shadow-lg md:shadow-none"
            >
              Next: Select Equipment
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentCategorySelection;

// Export the categories data for use in other components
export { equipmentCategories };
export type { EquipmentCategoryData };
