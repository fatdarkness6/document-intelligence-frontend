export const useAppPreferences = () => {
  const compactNavigation = useCookie<boolean>(
    "docintel.compact-navigation",
    {
      default: () => false,
      sameSite: "lax",
    },
  );

  const theme = useCookie<"light" | "dark">("docintel.theme", {
    default: () => "light",
    sameSite: "lax",
  });

  const darkMode = computed({
    get: () => theme.value === "dark",
    set: (enabled: boolean) => {
      theme.value = enabled ? "dark" : "light";
    },
  });

  return {
    compactNavigation,
    darkMode,
    theme,
  };
};
