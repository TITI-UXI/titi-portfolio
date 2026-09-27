import { createFileRoute } from "@tanstack/react-router";

// ایمپورت ماژولار و ایمن کامپوننت‌ها
import * as NavbarModule from "../components/portfolio/Navbar";
import * as HeroModule from "../components/portfolio/Hero";
import * as ProjectsStackModule from "../components/portfolio/ProjectsStack";
import * as FooterModule from "../components/portfolio/Footer";
import * as AboutModule from "../components/portfolio/About";

// استخراج کامپوننت‌ها چه با Named Export باشند چه با Default Export
const Navbar = (NavbarModule as any).Navbar || (NavbarModule as any).default;
const Hero = (HeroModule as any).Hero || (HeroModule as any).default;
const ProjectsStack = (ProjectsStackModule as any).ProjectsStack || (ProjectsStackModule as any).default;
const Footer = (FooterModule as any).Footer || (FooterModule as any).default;
const About = (AboutModule as any).About || (AboutModule as any).default;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Iman Amanin — Creative Developer & Multidisciplinary Designer" },
      {
        name: "description",
        content:
          "Freelance creative developer crafting fast, precise digital experiences. Selected work, about, and contact.",
      },
      { property: "og:title", content: "Iman Amanin — Creative Developer & Multidisciplinary Designer" },
      {
        property: "og:description",
        content:
          "Freelance creative developer crafting fast, precise digital experiences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-canvas text-foreground overflow-x-hidden selection:bg-black selection:text-white">
      {/* رندر شرطی ایمن کامپوننت‌ها */}
      {Navbar && <Navbar />}
      {Hero && <Hero />}
      {About && <About />}
      {ProjectsStack && <ProjectsStack />}
      {Footer && <Footer />}
    </main>
  );
}
