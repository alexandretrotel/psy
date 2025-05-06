"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSidebarControls } from "@/hooks/features/use-sidebar-controls";

interface SidebarControlsProps {
  onDataImported: () => void;
}

export function SidebarControls({ onDataImported }: SidebarControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, triggerFileSelect, handleExport, handleImport } =
    useSidebarControls(fileInputRef, onDataImported);

  return (
    <div className="flex w-full gap-4">
      <Button size="sm" onClick={handleExport} disabled={loading}>
        Export Data
      </Button>

      <div className="relative">
        <Button
          size="sm"
          variant="secondary"
          disabled={loading}
          onClick={triggerFileSelect}
        >
          Import Data
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleImport}
          className="hidden"
          disabled={loading}
        />
      </div>
    </div>
  );
}
