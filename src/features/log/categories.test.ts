import {
  addCategory,
  categoriesFromStored,
  defaultCategories,
  removeCategory,
  renameCategory,
  setCategoryShown,
  shownCategoryNames,
} from '@/features/log/categories';

describe('categories', () => {
  it('starts with the built-in list shown', () => {
    expect(shownCategoryNames(categoriesFromStored(null))).toEqual([
      'treats',
      'food',
      'clothes',
      'home',
      'other',
    ]);
  });

  it('adds a name and can hide one', () => {
    const added = addCategory(defaultCategories(), '  plants ');
    expect(added.at(-1)).toEqual({ name: 'plants', shown: true });
    const hidden = setCategoryShown(added, 'food', false);
    expect(shownCategoryNames(hidden)).not.toContain('food');
    expect(shownCategoryNames(hidden)).toContain('plants');
  });

  it('renames and deletes one', () => {
    const renamed = renameCategory(defaultCategories(), 'food', 'snacks');
    expect(renamed.map((c) => c.name)).toContain('snacks');
    expect(renamed.map((c) => c.name)).not.toContain('food');
    expect(renameCategory(renamed, 'snacks', 'treats')).toEqual(renamed);
    expect(removeCategory(renamed, 'snacks').map((c) => c.name)).not.toContain('snacks');
  });

  it('does not duplicate a name', () => {
    const once = addCategory(defaultCategories(), 'Treats');
    expect(once.filter((c) => c.name.toLowerCase() === 'treats')).toHaveLength(1);
    expect(once.find((c) => c.name === 'treats')?.shown).toBe(true);
  });
});
