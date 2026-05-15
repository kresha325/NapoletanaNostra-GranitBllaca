import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientMusic } from "@/components/layout/AmbientMusic";

const Home = lazy(() => import("@/pages/Home"));
const Menu = lazy(() => import("@/pages/Menu"));
const Login = lazy(() => import("@/pages/Login"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="size-6 text-primary" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/login" component={Login} />
        <Route path="/favorites" component={Favorites} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
                    <AmbientMusic />
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
