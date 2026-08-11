import type { Folder } from "~/types/folder";

export const useFolders = () => {
  const api = useApi();

  const getFolders = () => {
    return api<Folder[]>("/folders");
  };

  return {
    getFolders,
  };
};
