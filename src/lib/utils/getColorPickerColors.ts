type ColorPickerRepeater = {
  __typename?: "colorPickerRepeater_TableRow";
  color?: string;
};

export const getColorPickerColors = (colors: ColorPickerRepeater[]): string => {
  const [{ color: bgColor }, { color: textColor }] = colors;
  return `background-color: ${bgColor}; color: ${textColor};`;
};
