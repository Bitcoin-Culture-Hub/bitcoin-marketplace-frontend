import Header from "@/components/layout/Header";
import HomepageHero from "@/components/homepage/HomepageHero";
import TrustStrip from "@/components/homepage/TrustStrip";
import HowItWorks from "@/components/homepage/HowItWorks";
import FeaturedTemplates from "@/components/homepage/FeaturedTemplates";
import BuyerSellerSplit from "@/components/homepage/BuyerSellerSplit";
import Footer from "@/components/layout/Footer";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <HomepageHero />
        <FeaturedTemplates />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <BuyerSellerSplit />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
