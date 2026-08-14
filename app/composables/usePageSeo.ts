import type { MaybeRefOrGetter } from "vue";

interface PageSeoOptions {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  noIndex?: boolean;
}

export const usePageSeo = (options: PageSeoOptions) => {
  const title = computed(() => toValue(options.title));
  const description = computed(() => toValue(options.description));
  const robots = options.noIndex
    ? "noindex, nofollow, noarchive"
    : "index, follow";

  useSeoMeta({
    title,
    description,
    robots,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogSiteName: "DocIntel",
    twitterCard: "summary",
    twitterTitle: title,
    twitterDescription: description,
  });
};
