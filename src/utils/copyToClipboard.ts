const copyToClipboard = (textToCopy: string) => {
  try {
    if (!navigator) return;

    navigator.clipboard.writeText(textToCopy);
  } catch (e) {
    return;
  }
};

export default copyToClipboard;
