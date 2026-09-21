'use client';

import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/components/not-found';
import {
  ContactPage,
  HomePage,
  MediaPage,
  PressPage,
  ProjectDetailPage,
  ProjectsPage,
  ResourcesPage,
  TeamPage,
} from '@/components/site-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location]);

  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <div key={location} className="route-transition">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/projects/:slug" component={ProjectDetailPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/media" component={MediaPage} />
          <Route path="/press" component={PressPage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
