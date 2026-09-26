import { createFileRoute } from "@tanstack/react-router";

// Direct relative imports to prevent Vite alias resolution issues
// @ts-ignore
import Navbar from "../components/portfolio/Navbar";
// @ts-ignore
import Hero from "../components/portfolio/Hero";
// @ts-ignore
import ProjectsStack from "../components/portfolio/ProjectsStack";
// @ts-ignore
import Footer from "../components/portfolio/Footer";

// Existing sections
import { About } from "../components/portfolio/About";

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
      {/* Floating Pill Navbar */}
      <Navbar />

      {/* Hero section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Interactive Stacking Projects Portfolio */}
      <ProjectsStack />

      {/* Signature Curved Reveal Footer */}
      <Footer />
    </main>
  );
}
