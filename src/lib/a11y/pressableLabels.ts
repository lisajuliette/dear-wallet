type LabeledNode = {
  props: {
    accessibilityLabel?: unknown;
    accessibilityRole?: unknown;
    testID?: unknown;
  };
};

/**
 * Fail if any interactive node is missing a non-empty accessibilityLabel.
 * Pass nodes from RNTL `getAllByRole('button'|'tab'|…)` (or similar).
 */
export function findUnlabeledPressables(nodes: LabeledNode[]): LabeledNode[] {
  return nodes.filter((node) => {
    const label = node.props.accessibilityLabel;
    return typeof label !== 'string' || label.trim().length === 0;
  });
}

export function assertPressablesLabeled(nodes: LabeledNode[]): void {
  const missing = findUnlabeledPressables(nodes);
  if (missing.length === 0) return;
  const hints = missing.map((n, i) => {
    const role = (n.props.accessibilityRole as string | undefined) ?? 'button';
    const testID = n.props.testID ? ` testID=${String(n.props.testID)}` : '';
    return `${i + 1}. role=${role}${testID}`;
  });
  throw new Error(`Pressable(s) missing accessibilityLabel:\n${hints.join('\n')}`);
}
