export const showToastSuccess = (title: string, description: string) => {
  const toast = useToast();
  toast.add({
    title,
    description,
    timeout: 3000,
  });
};

export const showToastError = (title: string, description: string) => {
  const toast = useToast();
  toast.add({
    title,
    description,
    timeout: 3000,
    color: "red",
  });
};
