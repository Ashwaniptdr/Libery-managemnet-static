export const formatNamePlaceholder = (
  name: string | null | undefined
): string => {
  if (!name) {
    return '---';
  }

  const normalized = name.trim().toLowerCase();
  const placeholders = ['na', 'n/a', 'n.a.', 'null', 'undefined', ''];

  if (placeholders.includes(normalized)) {
    return '---';
  }

  return name;
};
