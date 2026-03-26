"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { SpringModal } from "@/components/ui/SpringModal";
import { useToast } from "@/components/ui/ToastNotification";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Tooltip } from "@/components/ui/Tooltip";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Card3DTilt } from "@/components/ui/Card3DTilt";
import { Drawer } from "@/components/ui/Drawer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Stepper } from "@/components/ui/Stepper";
import { RatingStars } from "@/components/ui/RatingStars";
import { Pagination } from "@/components/ui/Pagination";
import { FileUpload } from "@/components/ui/FileUpload";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ComponentPreviewProps {
  componentId: string;
  propValues: Record<string, any>;
}

export function ComponentPreview({
  componentId,
  propValues,
}: ComponentPreviewProps) {
  const renderer = componentRenderers[componentId];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Preview
        </h3>
      </div>

      {/* Preview area */}
      <div
        className={cn(
          "relative flex min-h-[280px] items-center justify-center overflow-hidden p-8",
          "bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_#2a2a2a_1px,_transparent_1px)]",
          "[background-size:16px_16px]"
        )}
      >
        {renderer ? (
          <PreviewWrapper componentId={componentId} propValues={propValues} />
        ) : (
          <p className="text-sm text-neutral-400">
            No preview available for &ldquo;{componentId}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Wrapper that holds local state required by interactive demos
 * (modals, drawers, toggles, etc.)
 */
function PreviewWrapper({
  componentId,
  propValues,
}: {
  componentId: string;
  propValues: Record<string, any>;
}) {
  const renderer = componentRenderers[componentId];
  if (!renderer) return null;
  return <renderer.Component propValues={propValues} />;
}

/* ─── Individual Renderers ────────────────────────────────────────────── */

function MagneticButtonPreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <MagneticButton
      variant={propValues.variant}
      size={propValues.size}
      magnetRadius={propValues.magnetRadius}
      disabled={propValues.disabled}
    >
      Click Me
    </MagneticButton>
  );
}

function SpringModalPreview({ propValues }: { propValues: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Open Modal
      </button>
      <SpringModal
        open={open}
        onOpenChange={(v) => setOpen(v)}
        size={propValues.size}
        blurBackdrop={propValues.blurBackdrop}
      >
        <h2 className="mb-2 text-lg font-bold text-neutral-900">Modal Title</h2>
        <p className="text-sm text-neutral-600">
          This is a spring-animated modal dialog. Click the backdrop or press
          Escape to close.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Close
        </button>
      </SpringModal>
    </>
  );
}

function ToastPreview({ propValues }: { propValues: Record<string, any> }) {
  const { addToast } = useToast();

  const variants = ["success", "error", "warning", "info"] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <button
          key={variant}
          onClick={() =>
            addToast({
              variant,
              title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
              description: "This is a demo notification.",
              duration: propValues.duration,
              swipeToDismiss: propValues.swipeToDismiss,
            })
          }
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium capitalize text-white transition-colors",
            variant === "success" && "bg-emerald-600 hover:bg-emerald-700",
            variant === "error" && "bg-red-600 hover:bg-red-700",
            variant === "warning" && "bg-amber-600 hover:bg-amber-700",
            variant === "info" && "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {variant}
        </button>
      ))}
    </div>
  );
}

function AccordionPreview({ propValues }: { propValues: Record<string, any> }) {
  const items = [
    { value: "item-1", title: "What is this library?", content: "A collection of beautifully animated React components built with Framer Motion." },
    { value: "item-2", title: "How do I install it?", content: "Simply copy the component files into your project and install the required dependencies." },
    { value: "item-3", title: "Is it free to use?", content: "Yes! All components are open source and free to use in any project." },
  ];

  return (
    <div className="w-full max-w-md">
      <Accordion
        type={propValues.type}
        collapsible={propValues.collapsible}
        animated={propValues.animated}
        items={items}
      />
    </div>
  );
}

function TabsPreview({ propValues }: { propValues: Record<string, any> }) {
  const tabs = [
    { value: "overview", label: "Overview", content: <p className="text-sm text-neutral-600 dark:text-neutral-400">Overview content goes here. This tab provides a general summary.</p> },
    { value: "features", label: "Features", content: <p className="text-sm text-neutral-600 dark:text-neutral-400">Features content goes here. Explore all the available features.</p> },
    { value: "pricing", label: "Pricing", content: <p className="text-sm text-neutral-600 dark:text-neutral-400">Pricing content goes here. Check our affordable plans.</p> },
  ];

  return (
    <div className="w-full max-w-md">
      <Tabs
        variant={propValues.variant}
        size={propValues.size}
        animated={propValues.animated}
        tabs={tabs}
      />
    </div>
  );
}

function DropdownMenuPreview({ propValues }: { propValues: Record<string, any> }) {
  const items = [
    { label: "Edit", onClick: () => {} },
    { label: "Duplicate", onClick: () => {} },
    { separator: true as const },
    { label: "Delete", onClick: () => {} },
  ];

  return (
    <DropdownMenu
      trigger={
        <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800">
          Options
        </button>
      }
      items={items}
      align={propValues.align}
      animated={propValues.animated}
      size={propValues.size}
    />
  );
}

function TooltipPreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <Tooltip
      content="This is a tooltip"
      side={propValues.side}
      delay={propValues.delay}
      animated={propValues.animated}
    >
      <button className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800">
        Hover me
      </button>
    </Tooltip>
  );
}

function ToggleSwitchPreview({ propValues }: { propValues: Record<string, any> }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <ToggleSwitch
        checked={checked}
        onCheckedChange={setChecked}
        size={propValues.size}
        disabled={propValues.disabled}
        color={propValues.color}
      />
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        {checked ? "On" : "Off"}
      </span>
    </div>
  );
}

function SkeletonLoaderPreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <div className="w-full max-w-sm space-y-4">
      <SkeletonLoader
        variant={propValues.variant}
        animated={propValues.animated}
        count={propValues.count}
      />
    </div>
  );
}

function Card3DTiltPreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <Card3DTilt
      intensity={propValues.intensity}
      glare={propValues.glare}
      scale={propValues.scale}
    >
      <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          3D Card
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Move your mouse over this card to see the tilt effect.
        </p>
      </div>
    </Card3DTilt>
  );
}

function DrawerPreview({ propValues }: { propValues: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Open Drawer
      </button>
      <Drawer
        open={open}
        onOpenChange={(v) => setOpen(v)}
        side={propValues.side}
        size={propValues.size}
        overlay={propValues.overlay}
      >
        <div className="p-6">
          <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Drawer Content
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            This panel slides in from the {propValues.side ?? "right"}.
          </p>
          <button
            onClick={() => setOpen(false)}
            className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </Drawer>
    </>
  );
}

function ProgressBarPreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <div className="w-full max-w-sm">
      <ProgressBar
        value={propValues.value}
        variant={propValues.variant}
        size={propValues.size}
        color={propValues.color}
      />
    </div>
  );
}

function BadgePreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={propValues.variant}
        color={propValues.color}
        size={propValues.size}
        removable={propValues.removable}
        onRemove={() => {}}
      >
        New
      </Badge>
      <Badge
        variant={propValues.variant}
        color="success"
        size={propValues.size}
        removable={propValues.removable}
        onRemove={() => {}}
      >
        Active
      </Badge>
      <Badge
        variant={propValues.variant}
        color="warning"
        size={propValues.size}
        removable={propValues.removable}
        onRemove={() => {}}
      >
        Pending
      </Badge>
    </div>
  );
}

function AvatarGroupPreview({ propValues }: { propValues: Record<string, any> }) {
  const avatars = [
    { name: "Alice Johnson", color: "#6366f1" },
    { name: "Bob Smith", color: "#ec4899" },
    { name: "Charlie Brown", color: "#f59e0b" },
    { name: "Diana Prince", color: "#10b981" },
    { name: "Eve Williams", color: "#8b5cf6" },
    { name: "Frank Miller", color: "#ef4444" },
  ];

  return (
    <AvatarGroup
      avatars={avatars}
      max={propValues.max}
      size={propValues.size}
      spacing={propValues.spacing}
    />
  );
}

function CommandPalettePreview({ propValues }: { propValues: Record<string, any> }) {
  const [open, setOpen] = useState(false);

  const commands = [
    { id: "new-file", label: "New File", action: () => setOpen(false), category: "File" },
    { id: "search", label: "Search", action: () => setOpen(false), category: "Edit" },
    { id: "settings", label: "Settings", action: () => setOpen(false), category: "Preferences" },
    { id: "theme", label: "Toggle Theme", action: () => setOpen(false), category: "Preferences" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Open Commands (Cmd+K)
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={commands}
        placeholder={propValues.placeholder}
        animated={propValues.animated}
      />
    </>
  );
}

function BreadcrumbPreview({ propValues }: { propValues: Record<string, any> }) {
  const items = [
    { label: "Home", href: "#" },
    { label: "Products", href: "#" },
    { label: "Electronics", href: "#" },
    { label: "Headphones" },
  ];

  return (
    <Breadcrumb
      items={items}
      separator={propValues.separator}
      animated={propValues.animated}
      maxItems={propValues.maxItems}
    />
  );
}

function StepperPreview({ propValues }: { propValues: Record<string, any> }) {
  const steps = [
    { label: "Account", description: "Create your account" },
    { label: "Profile", description: "Set up your profile" },
    { label: "Settings", description: "Configure preferences" },
    { label: "Complete", description: "All done!" },
  ];

  return (
    <div className="w-full max-w-lg">
      <Stepper
        steps={steps}
        activeStep={propValues.activeStep}
        orientation={propValues.orientation}
        animated={propValues.animated}
      />
    </div>
  );
}

function RatingStarsPreview({ propValues }: { propValues: Record<string, any> }) {
  const [rating, setRating] = useState(propValues.value ?? 3);
  return (
    <div className="flex items-center gap-3">
      <RatingStars
        value={rating}
        onChange={setRating}
        size={propValues.size}
        color={propValues.color}
        count={propValues.count}
      />
      <span className="text-sm text-neutral-500">{rating}/{propValues.count ?? 5}</span>
    </div>
  );
}

function PaginationPreview({ propValues }: { propValues: Record<string, any> }) {
  const [page, setPage] = useState(propValues.currentPage ?? 1);
  return (
    <Pagination
      totalPages={propValues.totalPages}
      currentPage={page}
      onChange={setPage}
      siblingCount={propValues.siblingCount}
    />
  );
}

function FileUploadPreview({ propValues }: { propValues: Record<string, any> }) {
  return (
    <div className="w-full max-w-sm">
      <FileUpload
        accept={propValues.accept}
        multiple={propValues.multiple}
        maxSize={propValues.maxSize}
        disabled={propValues.disabled}
        onFiles={(files) => console.log("Uploaded:", files)}
      />
    </div>
  );
}

/* ─── Component Map ───────────────────────────────────────────────────── */

const componentRenderers: Record<
  string,
  { Component: React.ComponentType<{ propValues: Record<string, any> }> }
> = {
  "magnetic-button": { Component: MagneticButtonPreview },
  "spring-modal": { Component: SpringModalPreview },
  "toast-notification": { Component: ToastPreview },
  accordion: { Component: AccordionPreview },
  tabs: { Component: TabsPreview },
  "dropdown-menu": { Component: DropdownMenuPreview },
  tooltip: { Component: TooltipPreview },
  "toggle-switch": { Component: ToggleSwitchPreview },
  "skeleton-loader": { Component: SkeletonLoaderPreview },
  "card-3d-tilt": { Component: Card3DTiltPreview },
  drawer: { Component: DrawerPreview },
  "progress-bar": { Component: ProgressBarPreview },
  badge: { Component: BadgePreview },
  "avatar-group": { Component: AvatarGroupPreview },
  "command-palette": { Component: CommandPalettePreview },
  breadcrumb: { Component: BreadcrumbPreview },
  stepper: { Component: StepperPreview },
  "rating-stars": { Component: RatingStarsPreview },
  pagination: { Component: PaginationPreview },
  "file-upload": { Component: FileUploadPreview },
};
