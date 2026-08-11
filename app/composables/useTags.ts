import type { Tag } from "~/types/tag";

export const useTags = () => {
  const api = useApi();

  const getTags = () => {
    return api<Tag[]>("/tags");
  };

  return {
    getTags,
  };
};
