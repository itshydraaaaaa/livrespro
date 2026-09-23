import { CartDrawer } from "@/components/storefront/CartDrawer";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";
import { AiBookAdvisor } from "@/components/storefront/AiBookAdvisor";
import { AnalyticsManager } from "@/components/AnalyticsManager";
import { SeoManager } from "@/components/SeoManager";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Educators from "./pages/Educators";
import B2BBook from "./pages/B2BBook";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/librairie" component={Shop} />
      <Route path="/educators" component={Educators} />
      <Route path="/login" component={Login} />
      <Route path="/livres/b2b-brand-management" component={B2BBook} />
      <Route path="/livres/:handle" component={ProductDetail} />
      
      {/* Admin routes */}
      <Route path="/admin" component={() => <Admin tab="overview" />} />
      <Route path="/admin/produits" component={() => <Admin tab="products" />} />
      <Route path="/admin/categories" component={() => <Admin tab="categories" />} />
      <Route path="/admin/auteurs" component={() => <Admin tab="authors" />} />
      <Route path="/admin/commandes" component={() => <Admin tab="orders" />} />
      <Route path="/admin/offre-educator" component={() => <Admin tab="educator" />} />
      <Route path="/admin/contenu" component={() => <Admin tab="content" />} />
      <Route path="/admin/seo" component={() => <Admin tab="seo" />} />
      <Route path="/admin/audience" component={() => <Admin tab="audience" />} />
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <SeoManager />
            <AnalyticsManager />
            <Router />
            <CartDrawer />
            <CheckoutModal />
            <AiBookAdvisor />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
