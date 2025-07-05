import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfileByUsername } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ExternalLink, User } from 'lucide-react';
import type { User as UserType, Link as LinkType } from '@/lib/types';

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserType | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    if (!username) return;

    try {
      setLoading(true);
      setNotFound(false);

      // Fetch user profile
      const userProfile = await getUserProfileByUsername(username);
      
      if (!userProfile) {
        setNotFound(true);
        return;
      }

      setUser(userProfile);

      // Fetch visible links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (linksError) {
        console.error('Error fetching links:', linksError);
      } else {
        setLinks(linksData || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url: string) => {
    // In a real implementation, you might want to track analytics here
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-xl mb-8">
            The profile "@{username}" doesn't exist or has been removed.
          </p>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-purple-900"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const theme = user.theme || 'light';
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-gradient-to-br from-purple-100 to-pink-100'
    }`}>
      <div className="container-mobile py-8 max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Profile Picture */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.full_name || user.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <User className={`w-12 h-12 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            } ${user.profile_image ? 'hidden' : ''}`} />
          </div>

          {/* Name and Username */}
          <h1 className={`text-xl sm:text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {user.full_name || user.username}
          </h1>

          {user.full_name && (
            <p className={`text-base sm:text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              @{user.username}
            </p>
          )}

          {/* Bio */}
          {user.bio && (
            <p className={`mt-4 text-sm sm:text-base leading-relaxed px-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {user.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center py-8">
              <p className={`${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No links available yet
              </p>
            </div>
          ) : (
            links.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                className={`w-full h-auto p-4 text-left justify-start ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                } transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                onClick={() => handleLinkClick(link.url)}
              >
                <div className="flex items-center space-x-3 w-full">
                  {link.icon && (
                    <span className="text-xl flex-shrink-0">
                      {link.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {link.title}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />
                </div>
              </Button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Powered by{' '}
            <a
              href="https://ycempire.studio"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium ${
                isDark 
                  ? 'text-purple-400 hover:text-purple-300' 
                  : 'text-purple-600 hover:text-purple-700'
              } transition-colors`}
            >
              YC Empire Studio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
