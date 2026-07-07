import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import SkillsSection from "@/components/sections/Skills";
import GitHubDashboard from "@/components/sections/GitHubDashboard";
import BlogEntry from "@/components/sections/BlogEntry";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedProjects />
      <div className="container-custom py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <SkillsSection />
          <GitHubDashboard />
        </div>
      </div>
      <BlogEntry />
    </>
  );
}
