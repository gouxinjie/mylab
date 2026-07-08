import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import SkillsSection from "@/components/sections/Skills";
import GitHubDashboard from "@/components/sections/GitHubDashboard";
import BlogEntry from "@/components/sections/BlogEntry";
import FadeIn from "@/components/FadeIn";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FadeIn>
        <Stats />
      </FadeIn>
      <FadeIn delay={0.15}>
        <FeaturedProjects />
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="container-custom py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <FadeIn delay={0.1}>
              <SkillsSection />
            </FadeIn>
            <FadeIn delay={0.2}>
              <GitHubDashboard />
            </FadeIn>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={0.45}>
        <BlogEntry />
      </FadeIn>
    </>
  );
}
