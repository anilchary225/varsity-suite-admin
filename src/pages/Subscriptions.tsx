import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limits: {
    chats: number;
    projects: number;
    events: number;
    resources: number;
  };
  hasTrial: boolean;
  trialPrice?: number;
  trialDays?: number;
  popular: boolean;
  active: boolean;
}

const Subscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/subscriptions/plans');
      setPlans(response.data);
    } catch (error) {
      toast.error('Failed to load subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
        <p className="text-muted-foreground mt-1">Available subscription plans for users</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan._id}
            className={`relative hover:shadow-lg transition-shadow ${
              plan.popular ? 'border-primary border-2' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">₹{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                {plan.hasTrial && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.trialDays} days trial for ₹{plan.trialPrice}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-foreground">Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-sm text-foreground mb-2">Limits</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Chats:</span>
                    <span className="ml-2 font-medium text-foreground">{plan.limits.chats}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Projects:</span>
                    <span className="ml-2 font-medium text-foreground">{plan.limits.projects}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Events:</span>
                    <span className="ml-2 font-medium text-foreground">{plan.limits.events}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Resources:</span>
                    <span className="ml-2 font-medium text-foreground">{plan.limits.resources}</span>
                  </div>
                </div>
              </div>
              <Badge variant={plan.active ? 'default' : 'secondary'} className="w-full justify-center">
                {plan.active ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No subscription plans available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subscriptions;
