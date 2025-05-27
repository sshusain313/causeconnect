
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/use-toast';

const MagicLinkClaimPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
      setLoading(false);
      return;
    }

    // In a real implementation, validate the token with the backend
    setTimeout(() => {
      // Mock token validation
      if (token === 'invalid') {
        setError('This link has expired or is invalid');
        setLoading(false);
      } else {
        // Mock retrieving waitlist data
        const waitlistData = {
          fullName: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '(555) 123-4567',
          organization: 'Community Health Initiative',
          causeId: searchParams.get('causeId') || '1',
        };
        
        // Store data for the claim form
        sessionStorage.setItem('waitlistClaimData', JSON.stringify(waitlistData));
        
        // Redirect to claim form with special parameter
        navigate(`/claim/${waitlistData.causeId}?source=waitlist`);
      }
    }, 1500);
  }, [token, navigate, searchParams]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            {loading ? (
              <div className="py-8 space-y-4">
                <div className="flex justify-center">
                  <Spinner className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-medium">Verifying your link...</h2>
                <p className="text-gray-600">
                  We're preparing your tote claim form. Please wait a moment.
                </p>
              </div>
            ) : error ? (
              <div className="py-8 space-y-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                  <p className="font-medium">{error}</p>
                  <p className="mt-2 text-sm">
                    The magic link you clicked may have expired or is invalid.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => navigate('/causes')}
                  >
                    Browse available causes
                  </button>
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => navigate('/login')}
                  >
                    Sign in to your account
                  </button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MagicLinkClaimPage;
