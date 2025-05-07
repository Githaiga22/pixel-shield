import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VerificationResult from "@/pages/verification-result";
import EditHistory from "@/pages/edit-history";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Verifications from "@/pages/verifications";
import Integration from "@/pages/integration";
import Landing from "@/pages/landing";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/result/:id" component={VerificationResult} />
          <Route path="/history/:id" component={EditHistory} />
          <Route path="/verifications" component={Verifications} />
          <Route path="/integration" component={Integration} />
          <Route path="/landing" component={Landing} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
