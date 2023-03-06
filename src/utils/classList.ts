type ClassName = string | undefined | null;

/**
 * Merges CSS classes into a single string
 * Each class will be separated by empty space
 */
const classList = (classes: ClassName[]) =>
  classes.filter((cls) => !!cls).join(" ");

export default classList;
