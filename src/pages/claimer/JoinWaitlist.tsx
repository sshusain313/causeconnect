
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const waitlistFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  organization: z.string().min(2, 'Organization name is required'),
  message: z.string().optional(),
  notifyEmail: z.boolean().default(true),
  notifySms: z.boolean().default(false),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const JoinWaitlistPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock cause data (in production would be fetched from API)
  const cause = {
    id,
    title: 'Mental Health Support',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    status: 'waitlist',
    description: 'Providing resources for mental health services in underserved areas.',
    sponsorCount: 3,
    waitlistCount: 12,
  };
  
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      message: '',
      notifyEmail: true,
      notifySms: false,
    },
  });
  
  const onSubmit = (data: WaitlistFormValues) => {
    // In production, this would submit to API
    console.log('Form data:', data);
    
    // Store data in session storage for next steps
    sessionStorage.setItem('waitlistFormData', JSON.stringify({
      ...data,
      causeId: id,
      causeTitle: cause.title,
    }));
    
    navigate('/waitlist/confirmed');
  };
  
  return (
    <Layout>
      <div className="bg-primary-50 py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            &larr; Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Join the Waitlist</h1>
          <p className="text-lg text-gray-700 mb-6">
            Be notified when totes become available for this cause
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Waitlist Registration</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Organization" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us why you're interested in this cause..." 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3">
                      <h3 className="text-md font-medium">Notification Preferences</h3>
                      
                      <FormField
                        control={form.control}
                        name="notifyEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Email notifications
                              </FormLabel>
                              <FormDescription>
                                Receive updates about this cause via email
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notifySms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                SMS notifications
                              </FormLabel>
                              <FormDescription>
                                Receive text messages when totes become available
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" size="lg">
                        Join Waitlist
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Cause</h2>
                
                <div className="space-y-4">
                  <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                    <img 
                      src={cause.imageUrl} 
                      alt={cause.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">{cause.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {cause.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Current Sponsors:</span>
                      <span className="font-medium">{cause.sponsorCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">People on Waitlist:</span>
                      <span className="font-medium">{cause.waitlistCount}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded p-4 text-sm text-blue-800">
                    <p>
                      <span className="font-semibold">How the waitlist works:</span> When totes become available, we'll notify you based on your preferences. Waitlist position is determined by registration time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JoinWaitlistPage;
