import { HeroSection } from "../components/ui/hero-section-9";
import { FeaturesSectionWithHoverEffects } from "../components/ui/FeaturesSectionWithHoverEffects";
import Testimonials from "../components/ui/testimonials";
import Cta from '../components/ui/Cta';
import { Footerdemo } from "../components/ui/footer";

function LandingPage() {
  return (
    <>
    <div className="bg-white" >
       <HeroSection />
     <FeaturesSectionWithHoverEffects/>
     <Testimonials/>
     <Cta/>
     <Footerdemo/>
     
    </div>
     

    </>
  );
}
export default LandingPage;