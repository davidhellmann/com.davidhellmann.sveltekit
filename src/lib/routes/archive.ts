type BaseRouteParams = {
  page?: string;
  slug?: string;
};

type ArchiveWindow<T> = {
  entries: T[];
  entryCount: number;
  offset: number;
  page: number;
  totalPages: number;
};

export const getTotalPages = (entryCount: number, limit: number): number => {
  if (limit <= 0) {
    throw new Error("Archive page limit must be greater than 0.");
  }

  return Math.ceil(entryCount / limit);
};

export const parseArchivePage = (page: string | undefined): number => {
  const parsedPage = page ? Number.parseInt(page, 10) : 1;
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

export const getPagedArchiveRoutes = <TParams extends BaseRouteParams>(
  totalPages: number,
  params?: Omit<TParams, "page">
): TParams[] => {
  const routes: TParams[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) {
      routes.push({ ...params, page: undefined } as TParams);
      routes.push({ ...params, page: "1" } as TParams);
    } else {
      routes.push({ ...params, page: i.toString() } as TParams);
    }
  }

  return routes;
};

export const getArchiveWindow = <T>(allEntries: T[], page: number, limit: number): ArchiveWindow<T> => {
  const entryCount = allEntries.length;
  const totalPages = getTotalPages(entryCount, limit);
  const offset = (page - 1) * limit;

  return {
    entries: allEntries.slice(offset, offset + limit),
    entryCount,
    offset,
    page,
    totalPages
  };
};

export const getCanonicalFirstPageRedirect = (
  page: number,
  pageParam: string | undefined,
  canonicalPath: string | undefined
): string | undefined => {
  if (page === 1 && pageParam === "1" && canonicalPath) {
    return canonicalPath;
  }
};

export const getOutOfRangeRedirect = (
  page: number,
  totalPages: number,
  canonicalPath: string | undefined
): string | undefined => {
  if (totalPages > 0 && page > totalPages && canonicalPath) {
    return `${canonicalPath}/${totalPages}`;
  }
};
