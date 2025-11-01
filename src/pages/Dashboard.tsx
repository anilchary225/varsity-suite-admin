import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FolderKanban, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalProjects: number;
}

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalProjects: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes] = await Promise.all([
          api.get('/api/college-admin/users'),
          api.get('/api/events/admin/events'),
        ]);

        setStats({
          totalUsers: usersRes.data.length || 0,
          totalEvents: eventsRes.data.length || 0,
          totalProjects: 0, // Will be implemented when projects API is ready
        });
      } catch (error) {
        toast.error('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {admin?.collegeName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your college today.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Active in your college
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/events"
              className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-foreground">Create Event</h3>
              <p className="text-sm text-muted-foreground">Set up a new college event</p>
            </a>
            <a
              href="/users"
              className="block p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-foreground">View Users</h3>
              <p className="text-sm text-muted-foreground">Manage college users</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
