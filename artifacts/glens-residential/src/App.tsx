import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import { useSettings } from "@/hooks/useSettings";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import OurServices from "@/pages/OurServices";
import LifeAtTheGlens from "@/pages/LifeAtTheGlens";
import MeetTheTeam from "@/pages/MeetTheTeam";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import StaffLogin from "@/pages/StaffLogin";
import StaffDashboard from "@/pages/StaffDashboard";

const queryClient = new QueryClient();

function ThemeApplier() {
  const { settings } = useSettings();
  useEffect(() => {
    const el = document.documentElement;
    if (settings.theme === "navy") {
      el.classList.add("theme-navy");
    } else {
      el.classList.remove("theme-navy");
    }
  }, [settings.theme]);
  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Layout>
      <ThemeApplier />
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/our-services" component={OurServices} />
        <Route path="/life-at-the-glens" component={LifeAtTheGlens} />
        <Route path="/meet-the-team" component={MeetTheTeam} />
        <Route path="/contact" component={Contact} />
        <Route path="/careers" component={Careers} />
        <Route path="/staff/login" component={StaffLogin} />
        <Route path="/staff/dashboard" component={StaffDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
