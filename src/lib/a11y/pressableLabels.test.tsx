import { Pressable, Text, View } from 'react-native';

import { assertPressablesLabeled, findUnlabeledPressables } from '@/lib/a11y/pressableLabels';

import { renderWithTheme } from '../../../test/render';

describe('pressableLabels', () => {
  it('passes when every pressable has a label', async () => {
    const { getAllByRole } = await renderWithTheme(
      <View>
        <Pressable accessibilityRole="button" accessibilityLabel="Save">
          <Text>save</Text>
        </Pressable>
        <Pressable accessibilityRole="tab" accessibilityLabel="Home">
          <Text>home</Text>
        </Pressable>
      </View>,
    );
    const nodes = [...getAllByRole('button'), ...getAllByRole('tab')];
    expect(findUnlabeledPressables(nodes)).toHaveLength(0);
    assertPressablesLabeled(nodes);
  });

  it('fails when a pressable has no label', async () => {
    const { getAllByRole } = await renderWithTheme(
      <Pressable accessibilityRole="button" onPress={() => undefined}>
        <Text>oops</Text>
      </Pressable>,
    );
    const nodes = getAllByRole('button');
    expect(findUnlabeledPressables(nodes).length).toBeGreaterThan(0);
    expect(() => assertPressablesLabeled(nodes)).toThrow(/missing accessibilityLabel/);
  });
});
