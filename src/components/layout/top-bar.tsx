"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/layout/brand-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SyntheticDataBadge } from "@/components/layout/synthetic-data-badge";
import { Button } from "@/components/ui/button";
import { navItems } from "@/components/layout/nav-items";
import { engagementHistory } from "@/data/productpulse";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function TopBar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const currentPage =
    navItems.find((item) => item.href === pathname)?.title ?? "Overview";
  const latestDate = new Date(
    `${engagementHistory.at(-1)!.date}T00:00:00Z`,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md md:px-8 lg:h-16 lg:py-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-11 lg:hidden"
              aria-label="Open navigation"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetHeader className="border-b border-sidebar-border px-4 py-4">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <BrandMark />
          </SheetHeader>
          <div className="px-3 py-2">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:hidden">
        <BrandMark />
      </div>

      <p className="hidden items-center gap-2.5 text-xs text-muted-foreground lg:flex">
        Workspace <span aria-hidden>/</span>{" "}
        <span className="text-foreground">{currentPage}</span>
      </p>

      <div className="flex w-full items-center justify-between gap-3 border-t border-border pt-2 sm:ml-auto sm:w-auto sm:border-0 sm:pt-0">
        <span className="text-xs text-muted-foreground">
          {latestDate} snapshot
        </span>
        <SyntheticDataBadge />
      </div>
    </header>
  );
}
