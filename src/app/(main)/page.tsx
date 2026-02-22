import { HeroSection } from '@/components/home/hero-section';
import { PlanningWidget } from '@/components/home/planning-widget';
import { TrendingDestinations } from '@/components/home/trending-destinations';
import { ExploreIndia } from '@/components/home/explore-india';
import { ExperienceShowcase } from '@/components/home/experience-showcase';
import { VisaGlance } from '@/components/home/visa-glance';
import { FeaturedItineraries } from '@/components/home/featured-itineraries';
import { BlogPreview } from '@/components/home/blog-preview';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { PersonalizedRecommendations } from '@/components/home/personalized-recommendations';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PlanningWidget />
      <PersonalizedRecommendations />
      <TrendingDestinations />
      <ExploreIndia />
      <ExperienceShowcase />
      <VisaGlance />
      <FeaturedItineraries />
      <BlogPreview />
      <NewsletterSection />
    </>
  );
}
