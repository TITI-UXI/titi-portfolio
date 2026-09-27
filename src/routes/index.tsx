import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/portfolio/Header";
import { Hero } from "@/components/portfolio/Hero";
import { RecentWork } from "@/components/portfolio/RecentWork";
import { About } from "@/components/portfolio/About";
import { Footer } from "@/components/portfolio/Footer";

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
    <main className="min-h-screen bg-canvas text-foreground">
      <Header />
      <Hero />
      <About />
      <RecentWork />
      <Footer />
    </main>
  );
}
