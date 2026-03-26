"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getComponentById } from "@/data/componentConfig";
import { ComponentPreview } from "@/components/playground/ComponentPreview";
import { PropEditor } from "@/components/playground/PropEditor";
import { CodeSnippet } from "@/components/playground/CodeSnippet";

export default function ComponentPage() {
  const params = useParams();
  const componentId = params.componentId as string;
  const config = getComponentById(componentId);

  const defaultValues = useMemo(() => {
    if (!config) return {};
    const values: Record<string, any> = {};
    for (const prop of config.props) {
      values[prop.name] = prop.defaultValue;
    }
    return values;
  }, [config]);

  const [propValues, setPropValues] = useState<Record<string, any>>(defaultValues);

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Component Not Found</h2>
          <p className="text-[var(--color-text-secondary)]">
            The component &quot;{componentId}&quot; does not exist.
          </p>
        </div>
      </div>
    );
  }

  const handlePropChange = (name: string, value: any) => {
    setPropValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-6 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{config.name}</h1>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {config.category}
          </span>
        </div>
        <p className="text-[var(--color-text-secondary)]">{config.description}</p>
      </div>

      {/* Preview + Props */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ComponentPreview componentId={componentId} propValues={propValues} />
        </div>
        <div>
          <PropEditor
            propDefs={config.props}
            values={propValues}
            onChange={handlePropChange}
          />
        </div>
      </div>

      {/* Code */}
      <CodeSnippet componentId={componentId} />
    </motion.div>
  );
}
