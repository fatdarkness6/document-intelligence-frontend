import type { Tag } from "~/types/tag";

export const useTags = () => {
  const api = useApi();

  const getTags = () => {
    return api<Tag[]>("/tags");
  };

  const createTag = (name: string) => {
    return api<Tag>("/tags", {
      method: "POST",
      body: { name },
    });
  };

  const renameTag = (id: number, name: string) => {
    return api<Tag>(`/tags/${id}`, {
      method: "PATCH",
      body: { name },
    });
  };

  const deleteTag = (id: number) => {
    return api<void>(`/tags/${id}`, {
      method: "DELETE",
    });
  };

  return {
    getTags,
    createTag,
    renameTag,
    deleteTag,
  };
};
