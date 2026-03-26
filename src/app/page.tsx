"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Palette, Keyboard } from "lucide-react";
import { componentConfigs, getCategories, getComponentsByCategory } from "@/data/componentConfig";

const features = [
  {
    icon: Sparkles,
    title: "20+ Animated Components",
    description: "Production-ready components with smooth Framer Motion and GSAP animations.",
  },
  {
    icon: Zap,
    title: "Interactive Playground",
    description: "Live prop editor with real-time preview. Adjust and see changes instantly.",
  },
  {
    icon: Palette,
    title: "Dark & Light Themes",
    description: "CSS custom properties for seamless theme switching without re-renders.",
  },
  {
    icon: Keyboard,
    title: "Fully Accessible",
    description: "WCAG AA compliant with keyboard navigation, ARIA, and screen reader support.",
  },
];

export default function HomePage() {
  const categories = getCategories();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
          AnimateUI
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
          A comprehensive animated component library with an interactive playground.
          Explore {componentConfigs.length} beautifully crafted components.
        </p>
        <Link
          href={`/components/${componentConfigs[0].id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Explore Components
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Features */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-lg transition-shadow"
          >
            <feature.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Component Grid by Category */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-8">Components</h2>
        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getComponentsByCategory(category).map((comp) => (
                <Link
                  key={comp.id}
                  href={`/components/${comp.id}`}
                  className="group p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                    {comp.name}
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {comp.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
