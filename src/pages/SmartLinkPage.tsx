import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface LinkButton {
  id: string;
  label: string;
  icon: string | null;
  target_url: string;
}

interface SmartLink {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  theme: string | null;
}

const SmartLinkPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<SmartLink | null>(null);
  const [buttons, setButtons] = useState<LinkButton[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: smartLink } = await supabase
        .from("smart_links")
        .select("*")
        .eq("slug", slug)
        .eq("enabled", true)
        .maybeSingle();

      if (!smartLink) {
        setLoading(false);
        return;
      }
      setPage(smartLink as SmartLink);

      const { data: linkButtons } = await supabase
        .from("link_buttons")
        .select("*")
        .eq("smart_link_id", smartLink.id)
        .eq("enabled", true)
        .order("order", { ascending: true });

      setButtons(linkButtons as LinkButton[]);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Link not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ backgroundColor: page.theme || "#000" }}>
      {page.image_url && (
        <img src={page.image_url} alt={page.title || "Avatar"} className="w-32 h-32 rounded-full mb-4 object-cover" />
      )}
      {page.title && <h1 className="text-3xl font-bold text-white mb-2">{page.title}</h1>}
      {page.description && <p className="text-white/80 text-center mb-6 max-w-md">{page.description}</p>}
      <div className="w-full max-w-md space-y-3">
        {buttons.map((btn) => (
          <a
            key={btn.id}
            href={btn.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-md bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-center font-semibold hover:opacity-90 transition"
          >
            {btn.label}
          </a>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" asChild>
          <a href="https://ycempire.studio">Back to YCE</a>
        </Button>
      </div>
    </div>
  );
};

export default SmartLinkPage;
