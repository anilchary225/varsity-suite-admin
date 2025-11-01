import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { admin } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
      <SidebarTrigger />
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{admin?.email}</p>
          <p className="text-xs text-muted-foreground">{admin?.collegeName}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
          {admin?.email?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
