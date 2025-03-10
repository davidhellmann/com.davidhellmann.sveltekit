// @ts-expect-error // ¯\_(ツ)_/¯
import { isEmpty, values, toPairs, reduce } from "lodash-es";

export type IParseSEO = {
  metaTitleContainer?: string;
  metaTagContainer?: string;
  metaLinkContainer?: string;
  metaJsonLdContainer?: string;
};

type Meta = object;

export type TSEO = {
  metaTitleContainer: {
    title: {
      title: string;
    };
  };
  metaTagContainer: Meta;
  metaLinkContainer: Meta;
  metaJsonLdContainer: Meta;
};

export type ISEO = {
  seoTitle: string;
  meta: Meta[];
  links: Meta[];
  jsonLd: Meta[];
};

const filterEmptyValues = (item: object): boolean => !isEmpty(item);

const flattenValues = (obj: Meta) => values(obj).filter(filterEmptyValues).flat();

export const parseSEO = (seo: IParseSEO): ISEO => {
  if (!seo) {
    return {} as ISEO;
  }
  const parsed = reduce(
    toPairs(seo),
    (acc: object, [key, value]: string[]) => ({
      ...acc,
      [key]: JSON.parse(value as string)
    }),
    {} as TSEO
  );

  const { metaTitleContainer, metaTagContainer, metaLinkContainer, metaJsonLdContainer } = parsed;

  const meta = flattenValues(metaTagContainer);
  const links = flattenValues(metaLinkContainer);
  const jsonLd = flattenValues(metaJsonLdContainer);

  return {
    seoTitle: metaTitleContainer.title.title,
    meta,
    links,
    jsonLd
  };
};
