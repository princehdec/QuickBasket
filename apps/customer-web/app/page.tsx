import { Header } from "./components/Header";
import { LocationSection } from "./components/LocationSection";
import { ServicesGrid } from "./components/ServicesGrid";
import { OfferBanner } from "./components/OfferBanner";
import { CategoriesSection } from "./components/CategoriesSection";
import { TrendingProducts } from "./components/TrendingProducts";
import { BestOffers } from "./components/BestOffers";
import { PopularBrands } from "./components/PopularBrands";
import { NearbyStores } from "./components/NearbyStores";
import { StartShoppingCTA } from "./components/StartShoppingCTA";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <LocationSection />
        <ServicesGrid />
        <OfferBanner />
        <CategoriesSection />
        <TrendingProducts />
        <BestOffers />
        <PopularBrands />
        <NearbyStores />
        <StartShoppingCTA />
      </main>
      <Footer />
    </>
  );
}
