import { exportData, importData } from "@/lib/chat";
import saveAs from "file-saver";
import { RefObject, useState } from "react";
import { toast } from "sonner";

export function useSidebarControls(
  fileInputRef: RefObject<HTMLInputElement | null>,
  onDataImported: () => void,
) {
  const [loading, setLoading] = useState(false);

  const setFileInputEmpty = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      saveAs(blob, "psychologue.json");
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      await importData(data);
      onDataImported();
      toast.success("Data imported successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import data.",
      );
    } finally {
      setLoading(false);
      setFileInputEmpty();
    }
  };

  return { loading, triggerFileSelect, handleExport, handleImport };
}
