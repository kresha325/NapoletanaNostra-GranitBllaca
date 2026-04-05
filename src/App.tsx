import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Login from "@/pages/Login";
import Favorites from "@/pages/Favorites";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/login" component={Login} />
      <Route path="/favorites" component={Favorites} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <FavoritesProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}> 
                  <div className="min-h-[100dvh] flex flex-col">
                    <Navbar />
                    <main className="flex-1 flex flex-col">
                      <Router />
                    </main>
                    <Footer />
                  </div>
                </WouterRouter>
                <Toaster />
                <SonnerToaster position="top-center" />
              </FavoritesProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
