export const useAppFeedback = () => {
  const $q = useQuasar();

  const success = (message: string) => {
    $q.notify({
      type: "positive",
      message,
    });
  };

  const error = (message: string) => {
    $q.notify({
      type: "negative",
      message,
    });
  };

  const confirm = (options: { title: string; message: string }) => {
    return $q.dialog({
      title: options.title,
      message: options.message,
      cancel: true,
      persistent: true,
    });
  };

  return {
    success,
    error,
    confirm,
  };
};
