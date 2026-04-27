import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import HomepageHero from "@/components/homepage/HomepageHero";
import FeaturedCategories from "@/components/homepage/FeaturedCategories";
import IconicMoments from "@/components/homepage/IconicMoments";
import BecomeADealer from "@/components/homepage/BecomeADealer";
import Podcast from "@/components/homepage/Podcast";
import Newsletter from "@/components/homepage/Newsletter";
import Footer from "@/components/layout/Footer";

const Homepage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    // Defer one frame so the section is mounted before scrolling.
    const raf = requestAnimationFrame(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />
      <main className="flex-1">
        <HomepageHero />
        <FeaturedCategories />
        <IconicMoments />
        <BecomeADealer />
        <Podcast />
        <Newsletter />
      </main>
      <Footer variant="marketplace" />
    </div>
  );
};

export default Homepage;
