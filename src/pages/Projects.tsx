import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Github } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
  githubRepo?: string;
  tags: string[];
  allowCollaborations: boolean;
  collaborators: string[];
  user: {
    fullName: string;
    email: string;
  };
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
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
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground mt-1">View all projects in your college</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by project name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects found</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    View Repository
                  </a>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Created by: <span className="font-medium">{project.user?.fullName}</span>
                  </p>
                  {project.collaborators?.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Collaborators: {project.collaborators.length}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
