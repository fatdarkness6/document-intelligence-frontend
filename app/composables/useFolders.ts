import type { Folder } from "~/types/folder";

export const useFolders = () => {
  const api = useApi();

  const getFolders = () => {
    return api<Folder[]>("/folders");
  };

  const createFolder = (name: string) => {
    return api<Folder>("/folders", {
      method: "POST",
      body: { name },
    });
  };

  const renameFolder = (id: number, name: string) => {
    return api<Folder>(`/folders/${id}`, {
      method: "PATCH",
      body: { name },
    });
  };

  const deleteFolder = (id: number) => {
    return api<void>(`/folders/${id}`, {
      method: "DELETE",
    });
  };

  return {
    getFolders,
    createFolder,
    renameFolder,
    deleteFolder,
  };
};
