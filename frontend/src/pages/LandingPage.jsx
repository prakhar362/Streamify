import { HeroSection } from "../components/ui/hero-section-9";
import { FeaturesSectionWithHoverEffects } from "../components/ui/FeaturesSectionWithHoverEffects";
import Testimonials from "../components/ui/testimonials";

function LandingPage() {
  return (
    <>
    <div className="bg-white">
       <HeroSection />
     <FeaturesSectionWithHoverEffects/>
     <Testimonials/>
    </div>
     

    </>
  );
}
export default LandingPage;