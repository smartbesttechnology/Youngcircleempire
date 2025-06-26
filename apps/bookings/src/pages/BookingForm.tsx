import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import BookingConfirmationModal from "@/components/BookingConfirmationModal";
import CategorySelection from "@/components/CategorySelection";

interface BookingData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: string;
  services: string[];
  addons: string[];
  date: string;
  time: string;
  duration: string;
  people: string;
  notes: string;
}

interface Service {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  tagline: string;
  description: string;
  allowAddons?: boolean;
}

interface Addon {
  id: string;
  name: string;
}

const BookingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<"category" | "booking">(
    "category",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );
  const [formData, setFormData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    contactMethod: "",
    services: [],
    addons: [],
    date: "",
    time: "",
    duration: "",
    people: "",
    notes: "",
  });

  // Service data mapped to new category IDs
  const services: Service[] = [
    // Empire Studio Session
    {
      id: "basic-empire-session",
      name: "Basic Empire Session",
      categoryId: "empire-studio-session",
      category: "🎙️ EMPIRE STUDIO SESSION",
      tagline: "Self-service | Fast takes | Affordable",
      description:
        "Quick vocal session for independent artists or engineers. No engineer included.",
      allowAddons: true,
    },
    {
      id: "deluxe-empire-session",
      name: "Deluxe Empire Session (w/ Engineer & Lounge Access)",
      categoryId: "empire-studio-session",
      category: "🎙️ EMPIRE STUDIO SESSION",
      tagline: "Professional | Comfortable | Vibe-focused",
      description:
        "Includes an in-house engineer, access to the private lounge, and light hospitality for a more relaxed workflow.",
      allowAddons: true,
    },
    {
      id: "pro-vocal-session",
      name: "Pro Vocal Session",
      categoryId: "empire-studio-session",
      category: "🎙️ EMPIRE STUDIO SESSION",
      tagline: "Hit-focused | Creative Guidance | Vocal Direction",
      description:
        "Comes with a professional vocal arranger and songwriter to help polish your delivery and song structure.",
      allowAddons: true,
    },
    {
      id: "full-day-lock-in",
      name: "Full-Day Lock-In (Studio Residency Style)",
      categoryId: "empire-studio-session",
      category: "🎙️ EMPIRE STUDIO SESSION",
      tagline: "12-Hour Booking | No Interruptions | Long Project Sessions",
      description:
        "Ideal for serious projects or artist retreats. Includes studio, lounge, and flexible creative time.",
      allowAddons: true,
    },
    {
      id: "empire-production-camp",
      name: "Empire Production Camp (Custom-Priced)",
      categoryId: "empire-studio-session",
      category: "🎙️ EMPIRE STUDIO SESSION",
      tagline: "Group Sessions | Multi-Day | Production-Heavy",
      description:
        "Includes multiple producers, engineers, and writers. Suitable for teams or artist development camps.",
      allowAddons: true,
    },

    // Empire Video & Visual Production
    {
      id: "concept-music-video",
      name: "Concept-Based Music Video",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "Directed | Cinematic | Story-driven",
      description:
        "Shot with creative direction, styling, and a custom concept to match your music and brand.",
      allowAddons: true,
    },
    {
      id: "empire-mic-session",
      name: "Empire Mic Session",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "Flagship | Stylized Performance | Reels-Ready",
      description:
        "High-quality visual performance video with dramatic lighting, colored background, and creative post-editing.",
      allowAddons: true,
    },
    {
      id: "live-performance-video",
      name: "Live Performance Music Video",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "Multi-Cam | On-Stage Feel | Live Vibe",
      description:
        "Captures you in a stage-like setup with dynamic camera angles and live performance energy.",
      allowAddons: true,
    },
    {
      id: "reels-shortform",
      name: "Reels & Shortform Edits",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "IG/TikTok | Viral Formats | Quick Cuts",
      description:
        "Music or lifestyle edits formatted for social platforms. Includes transitions, captions, and pacing for engagement.",
      allowAddons: true,
    },
    {
      id: "branded-video-podcasts",
      name: "Branded Video Podcasts (4K Multi-Angle)",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "Clean Visuals | Talk Format | Monetizable",
      description:
        "Record a professional podcast episode with high-quality mics and camera angles — ideal for brands or influencers.",
      allowAddons: true,
    },
    {
      id: "influencer-content",
      name: "Influencer Content Creation (+ Reels)",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "Skits | Styling | Trending Reels",
      description:
        "YC Empire creates influencer-level content including fashion, lifestyle, and brand collabs.",
      allowAddons: true,
    },
    {
      id: "empire-commercial-shoot",
      name: "Empire Commercial Shoot",
      categoryId: "empire-video-visual",
      category: "🎬 EMPIRE VIDEO & VISUAL PRODUCTION",
      tagline: "Product | Brand Ad | Lifestyle Creative",
      description:
        "Short-form commercial for products, events, or services — directed, shot, and edited in premium studio quality.",
      allowAddons: true,
    },

    // Empire Photoshoot
    {
      id: "high-fashion-photoshoot",
      name: "High-Fashion Artist Photoshoot",
      categoryId: "empire-photoshoot",
      category: "📸 EMPIRE PHOTOSHOOT",
      tagline: "Magazine-Ready | Styled | Statement Looks",
      description:
        "Professional fashion photography with bold styling, poses, and editing for artists and brands.",
      allowAddons: false,
    },
    {
      id: "album-cover-shoot",
      name: "Album/EP Cover Shoot with Art Direction",
      categoryId: "empire-photoshoot",
      category: "📸 EMPIRE PHOTOSHOOT",
      tagline: "Music Identity | Clean or Abstract | Branded",
      description:
        "Designed to be cover-art ready. Includes props, guidance, and high-end retouching.",
      allowAddons: false,
    },
    {
      id: "pre-wedding-shoot",
      name: "Pre-Wedding Shoot",
      categoryId: "empire-photoshoot",
      category: "📸 EMPIRE PHOTOSHOOT",
      tagline: "Couple Storytelling | Cinematic Still | Romantic",
      description:
        "Styled photography for couples looking for something bold, editorial, or traditional.",
      allowAddons: false,
    },

    // Empire Events & Entertainment
    {
      id: "house-party-dj",
      name: "House Party DJ Booking",
      categoryId: "empire-events-entertainment",
      category: "🎭 EMPIRE EVENTS & ENTERTAINMENT",
      tagline: "Turn-up vibes | Party-ready | Curated sound",
      description:
        "Book a professional YC Empire DJ for private in-studio parties or events.",
      allowAddons: false,
    },
    {
      id: "exclusive-listening-party",
      name: "Exclusive Listening Party",
      categoryId: "empire-events-entertainment",
      category: "🎭 EMPIRE EVENTS & ENTERTAINMENT",
      tagline: "Private | Hosted | Industry-ready",
      description:
        "In-studio listening party with guest invites, DJ, drinks, and full content coverage.",
      allowAddons: true,
    },
    {
      id: "content-team-coverage",
      name: "Content Team Coverage + Livestream",
      categoryId: "empire-events-entertainment",
      category: "🎭 EMPIRE EVENTS & ENTERTAINMENT",
      tagline: "Multi-cam | Livestream-ready | Social-ready",
      description:
        "Get your event filmed, photographed, and live-streamed by a professional team.",
      allowAddons: true,
    },
    {
      id: "empire-showcase-night",
      name: "Empire Showcase Night (YC-Hosted Event)",
      categoryId: "empire-events-entertainment",
      category: "🎭 EMPIRE EVENTS & ENTERTAINMENT",
      tagline: "Live set | Crowd-building | Emerging talent",
      description:
        "Artist showcase hosted by YC Empire, streamed and documented for promo use.",
      allowAddons: true,
    },

    // Promotion & Distribution
    {
      id: "premium-distribution",
      name: "Premium Distribution with Launch Strategy",
      categoryId: "promotion-distribution",
      category: "📢 PROMOTION & DISTRIBUTION",
      tagline: "Global Access | Rollout Ready | Monetized",
      description:
        "We distribute your music across all major DSPs (Spotify, Apple Music, Boomplay, etc.) with a custom launch timeline, release strategy, metadata optimization, and monetization setup.",
      allowAddons: false,
    },
    {
      id: "playlist-placement",
      name: "Playlist Placement Strategy + Campaign",
      categoryId: "promotion-distribution",
      category: "📢 PROMOTION & DISTRIBUTION",
      tagline: "Algorithm Boost | Organic Reach | Streaming Growth",
      description:
        "Pitch your song to official and independent curators on Spotify, Apple, Audiomack, etc. Includes research, pitching deck, and audience targeting plan to maximize playlist exposure.",
      allowAddons: false,
    },
    {
      id: "music-video-premiere",
      name: "Music Video Premiere on Major Blogs",
      categoryId: "promotion-distribution",
      category: "📢 PROMOTION & DISTRIBUTION",
      tagline: "High-Impact | Industry Eyes | Press Verified",
      description:
        "Get your music video featured on top entertainment blogs, niche culture sites, and video curation platforms — building online buzz and search credibility.",
      allowAddons: false,
    },
    {
      id: "song-sync-licensing",
      name: "Song Sync Licensing Pitch (TV, Film, Ads)",
      categoryId: "promotion-distribution",
      category: "📢 PROMOTION & DISTRIBUTION",
      tagline: "Revenue Streams | Global Placement | Brand Exposure",
      description:
        "We package and pitch your track for sync licensing in movies, Netflix series, commercials, and games. This includes metadata formatting, mood tagging, and catalogue submission to sync libraries.",
      allowAddons: false,
    },
    {
      id: "artist-pr-package",
      name: "Artist PR Package (Press Articles, Interviews, Influencers)",
      categoryId: "promotion-distribution",
      category: "📢 PROMOTION & DISTRIBUTION",
      tagline: "Publicity Push | Media Coverage | Narrative Control",
      description:
        "Full press campaign covering write-ups, blog placements, interview setups, and influencer shoutouts. Ideal for artists launching a project or building digital credibility.",
      allowAddons: false,
    },
    {
      id: "youtube-channel-setup",
      name: "YouTube Channel Setup + Optimization for Growth",
      categoryId: "promotion-distribution",
      category: "📢 PROMOTION & DISTRIBUTION",
      tagline: "Monetization Ready | Branded Page | Viral Setup",
      description:
        "We optimize your YouTube channel for growth — cover/banner art, video titles & descriptions, playlists, SEO tags, intro/outro video content, and monetization settings.",
      allowAddons: false,
    },

    // Premium Artist Branding
    {
      id: "brand-identity-package",
      name: "Brand Identity Package",
      categoryId: "premium-artist-branding",
      category: "🎨 PREMIUM ARTIST BRANDING",
      tagline: "Artist Image | Visual Language | Market Ready",
      description:
        "Comprehensive brand kit for your artist identity — including logo, moodboard, typeface selection, brand colors, tone of voice, and aesthetic guideline for photoshoots, covers, and videos.",
      allowAddons: false,
    },
    {
      id: "epk-design",
      name: "EPK (Electronic Press Kit) Design & Copywriting",
      categoryId: "premium-artist-branding",
      category: "🎨 PREMIUM ARTIST BRANDING",
      tagline: "Press-Ready | Pitch Deck | Professional Impression",
      description:
        "A clean, media-ready digital profile featuring your bio, press photos, achievements, discography, performance highlights, and contact info — designed for blogs, labels, and bookings.",
      allowAddons: false,
    },
    {
      id: "royalty-setup",
      name: "Royalty Setup + Music Business Structuring (BMI/ASCAP, MCSN, etc.)",
      categoryId: "premium-artist-branding",
      category: "🎨 PREMIUM ARTIST BRANDING",
      tagline: "Ownership First | Global Registration | Passive Revenue",
      description:
        "We help you register with international and local royalty collection agencies. Includes guidance on PROs (like BMI/ASCAP), MCSN, sound recording registration, and music business setup for long-term earning.",
      allowAddons: false,
    },

    // Empire Signature Packages
    {
      id: "empire-debut-package",
      name: "Empire Debut Package",
      categoryId: "empire-signature-packages",
      category: "📦 EMPIRE SIGNATURE PACKAGES",
      tagline: "Everything You Need to Launch as a Star",
      description:
        "A full creative launch for new artists — includes professional recording, personal branding, music video production, PR campaign, and DSP distribution setup.",
      allowAddons: true,
    },
    {
      id: "creative-takeover",
      name: "Creative Takeover",
      categoryId: "empire-signature-packages",
      category: "��� EMPIRE SIGNATURE PACKAGES",
      tagline: "Studio Control | Creative Liberty | Artist in Residence",
      description:
        "Unlimited studio sessions for a set period, plus 1 music video, 2 professional photoshoots, and an artist growth strategy session to refine direction and positioning.",
      allowAddons: true,
    },
    {
      id: "full-circle-artist-package",
      name: "Full Circle Artist Package",
      categoryId: "empire-signature-packages",
      category: "📦 EMPIRE SIGNATURE PACKAGES",
      tagline: "Content to Career | Studio to Streaming | Brand Ready",
      description:
        "End-to-end execution — studio sessions, visuals, branding, PR, and distribution. A full ecosystem to take your artistry from concept to public rollout.",
      allowAddons: true,
    },
    {
      id: "empire-elite-artist-deal",
      name: "Empire Elite Artist Deal",
      categoryId: "empire-signature-packages",
      category: "📦 EMPIRE SIGNATURE PACKAGES",
      tagline: "Label Energy | Top-Tier Rollout | Long-Term Strategy",
      description:
        "A premium extended artist deal with rollout planning, brand building, content execution, monetization coaching, and weekly YC support. Designed for career artists ready for empire-level structure.",
      allowAddons: true,
    },
    {
      id: "rollout-room",
      name: "The Rollout Room (by YC Empire)",
      categoryId: "empire-signature-packages",
      category: "📦 EMPIRE SIGNATURE PACKAGES",
      tagline: "Plan. Build. Drop. Repeat.",
      description:
        "A one-on-one service space for project rollouts. Includes strategy sessions, release timelines, creative planning, and performance metrics tracking — designed to act like your mini label inside YC Empire.",
      allowAddons: true,
    },
  ];

  // Add-ons that show only for applicable services
  const addons: Addon[] = [
    { id: "3d-motion-art", name: "3D/Motion Art Cover Design" },
    { id: "social-media-trailers", name: "Social Media Trailer Cutdowns" },
    {
      id: "private-room-overnight",
      name: "Private Room Overnight Stay (for Artists in Session)",
    },
    {
      id: "empire-hospitality-pack",
      name: "Empire Hospitality Pack (meals, wine, concierge)",
    },
    {
      id: "hitmaker-songwriting",
      name: "Hitmaker Songwriting & Vocal Arrangement Session",
    },
    { id: "high-end-mixing", name: "High-End Mixing & Mastering" },
    { id: "bts-content-edits", name: "BTS Content Edits" },
  ];

  // Get services for selected category
  const filteredServices = selectedCategoryId
    ? services.filter((service) => service.categoryId === selectedCategoryId)
    : [];

  const toggleServiceExpansion = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked ? [serviceId] : [],
    }));
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      addons: checked
        ? [...prev.addons, addonId]
        : prev.addons.filter((id) => id !== addonId),
    }));
  };

  // Check if any selected services allow add-ons
  const shouldShowAddons = formData.services.some((serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return service?.allowAddons;
  });

  const handleCategoryNext = () => {
    if (selectedCategoryId) {
      setCurrentStep("booking");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      formData.services.length === 0
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    try {
      console.log("Booking confirmed:", formData);

      toast({
        title: "Booking Confirmed!",
        description: "We'll be in touch soon to finalize your session.",
      });

      setShowConfirmation(false);
      navigate("/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png"
            alt="Young Circle Empire"
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Empire Bookings
          </h1>
          <p className="text-amber-400 max-w-3xl mx-auto text-lg">
            Where creativity meets class. Let's make something legendary.
          </p>
        </div>

        {/* Category Selection Step */}
        {currentStep === "category" && (
          <CategorySelection
            selectedCategory={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            onNext={handleCategoryNext}
          />
        )}

        {/* Combined Booking Step */}
        {currentStep === "booking" && (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <Button
              onClick={() => setCurrentStep("category")}
              variant="ghost"
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 border-0 px-0 font-normal transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>

            {/* Service Selection - New Design */}
            <Card className="bg-black/80 border-amber-500/30">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Category Title with Icon */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl sm:text-2xl flex-shrink-0">
                    {selectedCategoryId === "empire-studio-session" && "🎙️"}
                    {selectedCategoryId === "empire-video-visual" && "🎬"}
                    {selectedCategoryId === "empire-photoshoot" && "📸"}
                    {selectedCategoryId === "empire-events-entertainment" &&
                      "🎭"}
                    {selectedCategoryId === "promotion-distribution" && "📢"}
                    {selectedCategoryId === "premium-artist-branding" && "🎨"}
                    {selectedCategoryId === "empire-signature-packages" && "📦"}
                  </div>
                  <h1 className="text-amber-600 text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                    {selectedCategoryId === "empire-studio-session" &&
                      "Empire Studio Session"}
                    {selectedCategoryId === "empire-video-visual" &&
                      "Empire Video & Visual Production"}
                    {selectedCategoryId === "empire-photoshoot" &&
                      "Empire Photoshoot"}
                    {selectedCategoryId === "empire-events-entertainment" &&
                      "Empire Events & Entertainment"}
                    {selectedCategoryId === "promotion-distribution" &&
                      "Promotion & Distribution"}
                    {selectedCategoryId === "premium-artist-branding" &&
                      "Premium Artist Branding"}
                    {selectedCategoryId === "empire-signature-packages" &&
                      "Empire Signature Packages"}
                  </h1>
                </div>

                <p className="text-gray-400 text-sm mb-6 sm:mb-8">
                  Choose your specific service
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className={`rounded-lg border transition-all duration-200 cursor-pointer ${
                        formData.services.includes(service.id)
                          ? "bg-amber-600/20 border-amber-500/50"
                          : "bg-gray-800/30 border-gray-600/50 hover:border-gray-500/70"
                      }`}
                      onClick={() =>
                        handleServiceChange(
                          service.id,
                          !formData.services.includes(service.id),
                        )
                      }
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Radio Button - Larger on mobile */}
                          <div className="flex-shrink-0 mt-1">
                            <div
                              className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
                                formData.services.includes(service.id)
                                  ? "bg-amber-600"
                                  : "bg-white"
                              }`}
                            ></div>
                          </div>

                          {/* Service Content */}
                          <div className="flex-1 min-w-0">
                            {/* Mobile Layout: Stack title and button */}
                            <div className="sm:hidden">
                              <h3 className="text-white font-medium text-base mb-2 leading-tight pr-2">
                                {service.name}
                              </h3>

                              {/* More Info Button - Mobile */}
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-amber-400 text-sm flex-1">
                                  {service.tagline}
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleServiceExpansion(service.id);
                                  }}
                                  className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 flex items-center gap-2 px-2 py-1 text-sm flex-shrink-0 ml-2"
                                >
                                  <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                                    <span className="text-xs">i</span>
                                  </div>
                                  <span className="hidden sm:inline">
                                    More Info
                                  </span>
                                  {expandedServices.has(service.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Desktop Layout: Side by side */}
                            <div className="hidden sm:flex sm:items-start sm:justify-between">
                              <div className="flex-1">
                                <h3 className="text-white font-medium text-lg mb-1 leading-tight">
                                  {service.name}
                                </h3>
                                <p className="text-amber-400 text-xs">
                                  {service.tagline}
                                </p>
                              </div>

                              {/* More Info Button - Desktop */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleServiceExpansion(service.id);
                                }}
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 flex items-center gap-2 px-3 py-1 text-sm"
                              >
                                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                                  <span className="text-xs">i</span>
                                </div>
                                More Info
                                {expandedServices.has(service.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {/* Expanded Description */}
                            {expandedServices.has(service.id) && (
                              <div className="mt-3 sm:mt-4">
                                <p className="text-gray-300 text-sm sm:text-sm leading-relaxed">
                                  {service.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add-ons Section - Only show if applicable services are selected */}
                {shouldShowAddons && (
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg border border-amber-500/30">
                    <h3 className="text-amber-400 font-semibold mb-3 sm:mb-4 text-base sm:text-lg flex items-center">
                      <span className="mr-2">💎</span>
                      <span className="leading-tight">
                        PRIVATE EXPERIENCES ADD-ONS
                      </span>
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Enhance your experience with these premium add-ons:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
                        >
                          <Checkbox
                            id={addon.id}
                            checked={formData.addons.includes(addon.id)}
                            onCheckedChange={(checked) =>
                              handleAddonChange(addon.id, checked as boolean)
                            }
                            className="flex-shrink-0"
                          />
                          <Label
                            htmlFor={addon.id}
                            className="text-white text-sm cursor-pointer leading-relaxed flex-1"
                          >
                            {addon.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card className="bg-black/80 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-white">
                      Preferred Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-white">
                      Start Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-white">
                      Duration
                    </Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, duration: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-hour">1 hour</SelectItem>
                        <SelectItem value="2-hours">2 hours</SelectItem>
                        <SelectItem value="3-hours">3 hours</SelectItem>
                        <SelectItem value="4-hours">4 hours</SelectItem>
                        <SelectItem value="5-hours">5 hours</SelectItem>
                        <SelectItem value="6-hours">6 hours</SelectItem>
                        <SelectItem value="7-hours">7 hours</SelectItem>
                        <SelectItem value="8-hours">8 hours</SelectItem>
                        <SelectItem value="full-day">Full Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="people" className="text-white">
                      Number of People
                    </Label>
                    <Input
                      id="people"
                      type="number"
                      value={formData.people}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          people: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-white">
                    Notes / Concepts
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Tell us about your vision, concept, or any special requirements..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Your Information */}
            <Card className="bg-black/80 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white">Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>

                {/* Phone Number with Country Code */}
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone Number *
                  </Label>
                  <div className="flex gap-2">
                    <Select defaultValue="NG">
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NG">🇳🇬 +234</SelectItem>
                        <SelectItem value="US">🇺🇸 +1</SelectItem>
                        <SelectItem value="UK">🇬🇧 +44</SelectItem>
                        <SelectItem value="CA">🇨🇦 +1</SelectItem>
                        <SelectItem value="AU">🇦🇺 +61</SelectItem>
                        <SelectItem value="AF">🇦🇫 +93</SelectItem>
                        <SelectItem value="AL">🇦🇱 +355</SelectItem>
                        <SelectItem value="DZ">🇩🇿 +213</SelectItem>
                        <SelectItem value="AD">🇦🇩 +376</SelectItem>
                        <SelectItem value="AO">🇦🇴 +244</SelectItem>
                        <SelectItem value="AR">🇦🇷 +54</SelectItem>
                        <SelectItem value="AM">🇦🇲 +374</SelectItem>
                        <SelectItem value="AT">🇦🇹 +43</SelectItem>
                        <SelectItem value="AZ">🇦🇿 +994</SelectItem>
                        <SelectItem value="BS">🇧🇸 +1-242</SelectItem>
                        <SelectItem value="BH">🇧🇭 +973</SelectItem>
                        <SelectItem value="BD">🇧🇩 +880</SelectItem>
                        <SelectItem value="BB">🇧🇧 +1-246</SelectItem>
                        <SelectItem value="BY">🇧🇾 +375</SelectItem>
                        <SelectItem value="BE">🇧🇪 +32</SelectItem>
                        <SelectItem value="BZ">🇧🇿 +501</SelectItem>
                        <SelectItem value="BJ">🇧🇯 +229</SelectItem>
                        <SelectItem value="BT">🇧🇹 +975</SelectItem>
                        <SelectItem value="BO">🇧🇴 +591</SelectItem>
                        <SelectItem value="BA">🇧🇦 +387</SelectItem>
                        <SelectItem value="BW">🇧🇼 +267</SelectItem>
                        <SelectItem value="BR">🇧🇷 +55</SelectItem>
                        <SelectItem value="BN">🇧🇳 +673</SelectItem>
                        <SelectItem value="BG">🇧🇬 +359</SelectItem>
                        <SelectItem value="BF">🇧🇫 +226</SelectItem>
                        <SelectItem value="BI">🇧🇮 +257</SelectItem>
                        <SelectItem value="KH">🇰🇭 +855</SelectItem>
                        <SelectItem value="CM">🇨🇲 +237</SelectItem>
                        <SelectItem value="CV">🇨🇻 +238</SelectItem>
                        <SelectItem value="CF">🇨🇫 +236</SelectItem>
                        <SelectItem value="TD">🇹🇩 +235</SelectItem>
                        <SelectItem value="CL">🇨🇱 +56</SelectItem>
                        <SelectItem value="CN">🇨🇳 +86</SelectItem>
                        <SelectItem value="CO">🇨🇴 +57</SelectItem>
                        <SelectItem value="KM">🇰🇲 +269</SelectItem>
                        <SelectItem value="CG">🇨🇬 +242</SelectItem>
                        <SelectItem value="CD">🇨🇩 +243</SelectItem>
                        <SelectItem value="CR">🇨🇷 +506</SelectItem>
                        <SelectItem value="CI">🇨🇮 +225</SelectItem>
                        <SelectItem value="HR">🇭🇷 +385</SelectItem>
                        <SelectItem value="CU">🇨🇺 +53</SelectItem>
                        <SelectItem value="CY">🇨🇾 +357</SelectItem>
                        <SelectItem value="CZ">🇨🇿 +420</SelectItem>
                        <SelectItem value="DK">🇩🇰 +45</SelectItem>
                        <SelectItem value="DJ">🇩🇯 +253</SelectItem>
                        <SelectItem value="DM">🇩🇲 +1-767</SelectItem>
                        <SelectItem value="DO">🇩🇴 +1-809</SelectItem>
                        <SelectItem value="EC">🇪🇨 +593</SelectItem>
                        <SelectItem value="EG">🇪🇬 +20</SelectItem>
                        <SelectItem value="SV">🇸🇻 +503</SelectItem>
                        <SelectItem value="GQ">🇬🇶 +240</SelectItem>
                        <SelectItem value="ER">🇪🇷 +291</SelectItem>
                        <SelectItem value="EE">🇪🇪 +372</SelectItem>
                        <SelectItem value="ET">🇪🇹 +251</SelectItem>
                        <SelectItem value="FJ">🇫🇯 +679</SelectItem>
                        <SelectItem value="FI">🇫🇮 +358</SelectItem>
                        <SelectItem value="FR">🇫🇷 +33</SelectItem>
                        <SelectItem value="GA">🇬🇦 +241</SelectItem>
                        <SelectItem value="GM">🇬🇲 +220</SelectItem>
                        <SelectItem value="GE">🇬🇪 +995</SelectItem>
                        <SelectItem value="DE">🇩🇪 +49</SelectItem>
                        <SelectItem value="GH">🇬🇭 +233</SelectItem>
                        <SelectItem value="GR">🇬🇷 +30</SelectItem>
                        <SelectItem value="GD">🇬🇩 +1-473</SelectItem>
                        <SelectItem value="GT">🇬🇹 +502</SelectItem>
                        <SelectItem value="GN">🇬🇳 +224</SelectItem>
                        <SelectItem value="GW">🇬🇼 +245</SelectItem>
                        <SelectItem value="GY">🇬🇾 +592</SelectItem>
                        <SelectItem value="HT">🇭🇹 +509</SelectItem>
                        <SelectItem value="HN">🇭🇳 +504</SelectItem>
                        <SelectItem value="HU">🇭🇺 +36</SelectItem>
                        <SelectItem value="IS">🇮🇸 +354</SelectItem>
                        <SelectItem value="IN">🇮🇳 +91</SelectItem>
                        <SelectItem value="ID">🇮🇩 +62</SelectItem>
                        <SelectItem value="IR">🇮🇷 +98</SelectItem>
                        <SelectItem value="IQ">🇮🇶 +964</SelectItem>
                        <SelectItem value="IE">🇮🇪 +353</SelectItem>
                        <SelectItem value="IL">🇮🇱 +972</SelectItem>
                        <SelectItem value="IT">🇮🇹 +39</SelectItem>
                        <SelectItem value="JM">🇯🇲 +1-876</SelectItem>
                        <SelectItem value="JP">🇯🇵 +81</SelectItem>
                        <SelectItem value="JO">🇯🇴 +962</SelectItem>
                        <SelectItem value="KZ">🇰🇿 +7</SelectItem>
                        <SelectItem value="KE">🇰🇪 +254</SelectItem>
                        <SelectItem value="KI">🇰🇮 +686</SelectItem>
                        <SelectItem value="KP">🇰🇵 +850</SelectItem>
                        <SelectItem value="KR">🇰🇷 +82</SelectItem>
                        <SelectItem value="KW">🇰🇼 +965</SelectItem>
                        <SelectItem value="KG">🇰🇬 +996</SelectItem>
                        <SelectItem value="LA">🇱🇦 +856</SelectItem>
                        <SelectItem value="LV">🇱🇻 +371</SelectItem>
                        <SelectItem value="LB">🇱🇧 +961</SelectItem>
                        <SelectItem value="LS">🇱���� +266</SelectItem>
                        <SelectItem value="LR">🇱🇷 +231</SelectItem>
                        <SelectItem value="LY">🇱🇾 +218</SelectItem>
                        <SelectItem value="LI">🇱🇮 +423</SelectItem>
                        <SelectItem value="LT">🇱🇹 +370</SelectItem>
                        <SelectItem value="LU">🇱🇺 +352</SelectItem>
                        <SelectItem value="MG">🇲🇬 +261</SelectItem>
                        <SelectItem value="MW">🇲🇼 +265</SelectItem>
                        <SelectItem value="MY">🇲🇾 +60</SelectItem>
                        <SelectItem value="MV">🇲🇻 +960</SelectItem>
                        <SelectItem value="ML">🇲🇱 +223</SelectItem>
                        <SelectItem value="MT">🇲🇹 +356</SelectItem>
                        <SelectItem value="MH">🇲🇭 +692</SelectItem>
                        <SelectItem value="MR">🇲🇷 +222</SelectItem>
                        <SelectItem value="MU">🇲🇺 +230</SelectItem>
                        <SelectItem value="MX">🇲🇽 +52</SelectItem>
                        <SelectItem value="FM">🇫🇲 +691</SelectItem>
                        <SelectItem value="MD">🇲🇩 +373</SelectItem>
                        <SelectItem value="MC">🇲🇨 +377</SelectItem>
                        <SelectItem value="MN">🇲🇳 +976</SelectItem>
                        <SelectItem value="ME">🇲🇪 +382</SelectItem>
                        <SelectItem value="MA">🇲🇦 +212</SelectItem>
                        <SelectItem value="MZ">🇲🇿 +258</SelectItem>
                        <SelectItem value="MM">🇲🇲 +95</SelectItem>
                        <SelectItem value="NA">🇳🇦 +264</SelectItem>
                        <SelectItem value="NR">🇳🇷 +674</SelectItem>
                        <SelectItem value="NP">🇳🇵 +977</SelectItem>
                        <SelectItem value="NL">🇳🇱 +31</SelectItem>
                        <SelectItem value="NZ">🇳🇿 +64</SelectItem>
                        <SelectItem value="NI">🇳🇮 +505</SelectItem>
                        <SelectItem value="NE">🇳🇪 +227</SelectItem>
                        <SelectItem value="NO">🇳🇴 +47</SelectItem>
                        <SelectItem value="OM">🇴🇲 +968</SelectItem>
                        <SelectItem value="PK">🇵🇰 +92</SelectItem>
                        <SelectItem value="PW">���🇼 +680</SelectItem>
                        <SelectItem value="PA">🇵🇦 +507</SelectItem>
                        <SelectItem value="PG">🇵🇬 +675</SelectItem>
                        <SelectItem value="PY">🇵🇾 +595</SelectItem>
                        <SelectItem value="PE">🇵🇪 +51</SelectItem>
                        <SelectItem value="PH">🇵🇭 +63</SelectItem>
                        <SelectItem value="PL">🇵🇱 +48</SelectItem>
                        <SelectItem value="PT">🇵🇹 +351</SelectItem>
                        <SelectItem value="QA">🇶🇦 +974</SelectItem>
                        <SelectItem value="RO">🇷🇴 +40</SelectItem>
                        <SelectItem value="RU">🇷🇺 +7</SelectItem>
                        <SelectItem value="RW">🇷🇼 +250</SelectItem>
                        <SelectItem value="KN">🇰🇳 +1-869</SelectItem>
                        <SelectItem value="LC">🇱🇨 +1-758</SelectItem>
                        <SelectItem value="VC">🇻🇨 +1-784</SelectItem>
                        <SelectItem value="WS">🇼🇸 +685</SelectItem>
                        <SelectItem value="SM">🇸🇲 +378</SelectItem>
                        <SelectItem value="ST">🇸🇹 +239</SelectItem>
                        <SelectItem value="SA">🇸🇦 +966</SelectItem>
                        <SelectItem value="SN">🇸🇳 +221</SelectItem>
                        <SelectItem value="RS">🇷🇸 +381</SelectItem>
                        <SelectItem value="SC">🇸🇨 +248</SelectItem>
                        <SelectItem value="SL">🇸🇱 +232</SelectItem>
                        <SelectItem value="SG">🇸🇬 +65</SelectItem>
                        <SelectItem value="SK">🇸🇰 +421</SelectItem>
                        <SelectItem value="SI">🇸🇮 +386</SelectItem>
                        <SelectItem value="SB">🇸🇧 +677</SelectItem>
                        <SelectItem value="SO">🇸🇴 +252</SelectItem>
                        <SelectItem value="ZA">🇿🇦 +27</SelectItem>
                        <SelectItem value="SS">🇸🇸 +211</SelectItem>
                        <SelectItem value="ES">🇪🇸 +34</SelectItem>
                        <SelectItem value="LK">🇱🇰 +94</SelectItem>
                        <SelectItem value="SD">🇸🇩 +249</SelectItem>
                        <SelectItem value="SR">🇸🇷 +597</SelectItem>
                        <SelectItem value="SE">🇸🇪 +46</SelectItem>
                        <SelectItem value="CH">🇨🇭 +41</SelectItem>
                        <SelectItem value="SY">🇸🇾 +963</SelectItem>
                        <SelectItem value="TJ">🇹🇯 +992</SelectItem>
                        <SelectItem value="TZ">🇹🇿 +255</SelectItem>
                        <SelectItem value="TH">🇹🇭 +66</SelectItem>
                        <SelectItem value="TL">🇹🇱 +670</SelectItem>
                        <SelectItem value="TG">🇹🇬 +228</SelectItem>
                        <SelectItem value="TO">🇹🇴 +676</SelectItem>
                        <SelectItem value="TT">🇹🇹 +1-868</SelectItem>
                        <SelectItem value="TN">🇹🇳 +216</SelectItem>
                        <SelectItem value="TR">🇹🇷 +90</SelectItem>
                        <SelectItem value="TM">🇹🇲 +993</SelectItem>
                        <SelectItem value="TV">🇹🇻 +688</SelectItem>
                        <SelectItem value="UG">🇺🇬 +256</SelectItem>
                        <SelectItem value="UA">🇺🇦 +380</SelectItem>
                        <SelectItem value="AE">🇦🇪 +971</SelectItem>
                        <SelectItem value="UY">����🇾 +598</SelectItem>
                        <SelectItem value="UZ">🇺🇿 +998</SelectItem>
                        <SelectItem value="VU">🇻🇺 +678</SelectItem>
                        <SelectItem value="VA">🇻🇦 +39</SelectItem>
                        <SelectItem value="VE">🇻🇪 +58</SelectItem>
                        <SelectItem value="VN">🇻🇳 +84</SelectItem>
                        <SelectItem value="YE">🇾🇪 +967</SelectItem>
                        <SelectItem value="ZM">🇿🇲 +260</SelectItem>
                        <SelectItem value="ZW">🇿🇼 +263</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="flex-1 bg-gray-800 border-gray-600 text-white"
                      placeholder="1234567890"
                      required
                    />
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <Label className="text-white">Preferred Contact Method</Label>
                  <RadioGroup
                    value={formData.contactMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, contactMethod: value }))
                    }
                    className="flex flex-row space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="text-white">
                        WhatsApp
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="call" id="call" />
                      <Label htmlFor="call" className="text-white">
                        Call
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions - Scrollable with border */}
            <Card className="bg-black/80 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white">
                  Young Circle Empire Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Scrollable Terms Container */}
                <div className="border border-gray-600 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-900/50 mb-6">
                  <div className="text-white text-sm space-y-4">
                    <p>
                      These Terms & Conditions govern all studio session
                      bookings, including music recording, video shoots, Empire
                      Mic Sessions, photoshoots, podcast sessions, and other
                      creative bookings.
                    </p>

                    <div>
                      <h4 className="text-amber-400 font-semibold">
                        1. Booking & Payments
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                        <li>
                          All bookings must be made via our official channels or
                          website.
                        </li>
                        <li>
                          A minimum 50% deposit is required to confirm your
                          booking.
                        </li>
                        <li>
                          Balance must be paid before your session begins.
                        </li>
                        <li>Bookings without deposit are not guaranteed.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-amber-400 font-semibold">
                        2. Cancellations & Rescheduling
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                        <li>
                          You may reschedule once if notice is given 48 hours in
                          advance.
                        </li>
                        <li>
                          Cancellations less than 48 hours to your session will
                          forfeit the deposit.
                        </li>
                        <li>No-shows are non-refundable.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-amber-400 font-semibold">
                        3. Studio Session Rules
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                        <li>
                          Your time slot starts and ends at the scheduled hours
                          regardless of your arrival time.
                        </li>
                        <li>
                          Arriving 15 minutes early is encouraged to set up.
                        </li>
                        <li>
                          You may extend your time if available, billed by the
                          hour.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-amber-400 font-semibold">
                        4. Guests & Conduct
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                        <li>
                          Maximum guest number is defined per session type.
                        </li>
                        <li>
                          No fighting, illegal substances, or disruptive
                          behavior allowed.
                        </li>
                        <li>
                          We reserve the right to end a session without refund
                          if these rules are violated.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-amber-400 font-semibold">
                        5. Use of Content
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                        <li>
                          Unless agreed otherwise, you retain full ownership of
                          your work.
                        </li>
                        <li>
                          We may request to post BTS or highlights for promotion
                          unless you opt out beforehand.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-amber-400 font-semibold">
                        6. Damage & Liability
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                        <li>
                          You are responsible for any damage caused to studio
                          property.
                        </li>
                        <li>
                          Young Circle Empire is not liable for loss of personal
                          items or injury during your session.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-white">
                    I accept the Terms and Conditions
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold py-3 text-lg"
                >
                  Submit Booking Request
                </Button>
              </CardContent>
            </Card>
          </form>
        )}

        <BookingConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          bookingData={formData}
          services={services}
          addons={addons}
        />
      </div>
    </div>
  );
};

export default BookingForm;
