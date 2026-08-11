type TypedEntry = { __typename: string };
type EntryType<TEntry> = Extract<TEntry, TypedEntry>["__typename"];

export const getEntryOfType = <TEntry, TType extends EntryType<TEntry>>(
  entries: readonly TEntry[],
  typename: TType
): Extract<TEntry, { __typename: TType }> | undefined =>
  entries.find(
    (entry): entry is Extract<TEntry, { __typename: TType }> =>
      typeof entry === "object" &&
      entry !== null &&
      "__typename" in entry &&
      (entry as TypedEntry).__typename === typename
  );

export const getEntriesOfType = <TEntry, TType extends EntryType<TEntry>>(
  entries: readonly TEntry[],
  typename: TType
): Extract<TEntry, { __typename: TType }>[] =>
  entries.filter(
    (entry): entry is Extract<TEntry, { __typename: TType }> =>
      typeof entry === "object" &&
      entry !== null &&
      "__typename" in entry &&
      (entry as TypedEntry).__typename === typename
  );
