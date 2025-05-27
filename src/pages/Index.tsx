import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  
  // Featured causes (would normally be from API)
  const causes = [
    {
      id: '1',
      title: 'Clean Water Initiative',
      description: 'Providing clean drinking water to communities in need.',
      imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2d5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      currentAmount: 12500,
      targetAmount: 25000,
      category: 'Environment'
    },
    {
      id: '2',
      title: "Children's Education Fund",
      description: 'Supporting education for underprivileged children worldwide.',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      currentAmount: 8700,
      targetAmount: 15000,
      category: 'Education'
    },
    {
      id: '3',
      title: 'Women Entrepreneurs',
      description: 'Empowering women with resources to start their own businesses.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      currentAmount: 6300,
      targetAmount: 10000,
      category: 'Economic Development'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meaningful Partnerships for Positive Change
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Connect your brand with causes that align with your values. 
                Sponsor initiatives that make a real difference in the world.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={() => navigate('/causes')} 
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Browse Causes
                </Button>
                <Button 
                  onClick={() => navigate('/sponsor/new')} 
                  variant="outline" 
                  size="lg"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  Become a Sponsor
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="People collaborating on community project" 
                className="rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Causes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These causes are making a significant impact and looking for sponsors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {causes.map((cause) => (
              <Card key={cause.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={cause.imageUrl} 
                  alt={cause.title} 
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{cause.title}</h3>
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {cause.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{cause.description}</p>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${(cause.currentAmount / cause.targetAmount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        ${cause.currentAmount.toLocaleString()} raised
                      </span>
                      <span className="text-sm text-gray-500">
                        ${cause.targetAmount.toLocaleString()} goal
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/cause/${cause.id}`)} 
                    className="w-full"
                    variant="outline"
                  >
                    See Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/causes')} 
              variant="outline" 
              size="lg"
              className="border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              View All Causes
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple process to connect sponsors with meaningful causes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Browse Causes</h3>
              <p className="text-gray-600">
                Explore our curated list of vetted causes making a real difference.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Choose to Sponsor</h3>
              <p className="text-gray-600">
                Select a cause that aligns with your values and decide on your contribution.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Create Impact</h3>
              <p className="text-gray-600">
                Your sponsorship provides resources while showcasing your brand's commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Sponsors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join these forward-thinking organizations making a difference.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-75">
            <div className="w-32 h-20 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">Brand A</div>
            </div>
            <div className="w-32 h-20 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">Brand B</div>
            </div>
            <div className="w-32 h-20 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">Brand C</div>
            </div>
            <div className="w-32 h-20 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">Brand D</div>
            </div>
            <div className="w-32 h-20 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">Brand E</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of sponsors and help bring positive change to the world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => navigate('/causes')} 
              variant="secondary" 
              size="lg"
            >
              Browse Causes
            </Button>
            <Button 
              onClick={() => navigate('/sponsor/new')} 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-primary-700"
            >
              Become a Sponsor
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
