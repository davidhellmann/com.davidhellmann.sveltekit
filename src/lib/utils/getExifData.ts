export const getExifData = (images?: Array<Record<string, any>>): { cameras?: string[]; lenses?: string[] } => {
  const camerasSet = new Set<string>();
  const lensesSet = new Set<string>();

  images?.forEach((image) => {
    if (!image?.exif) return;

    try {
      const exif = JSON.parse(image.exif);

      if (exif.cameraMake && exif.cameraModel) {
        // camerasSet.add(`${exif.cameraMake} ${exif.cameraModel}`);
        camerasSet.add(`${exif.cameraModel}`);
      }

      if (exif.lensMake && exif.lensModel) {
        // lensesSet.add(`${exif.lensMake} ${exif.lensModel}`);
        lensesSet.add(`${exif.lensModel}`);
      }
    } catch (error) {
      console.error("Error parsing EXIF data:", error);
    }
  });

  return {
    cameras: Array.from(camerasSet),
    lenses: Array.from(lensesSet)
  };
};
