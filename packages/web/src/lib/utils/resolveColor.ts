// Utility to resolve color references from appearance doc
export function resolveColor(
  colorReference?: string,
  customColor?: {hex?: string},
  appearance?: {
    mainColors?: {
      primaryColor?: {hex?: string}
      secondaryColor?: {hex?: string}
      accentColor?: {hex?: string}
      neutralColor?: {hex?: string}
      websiteTextColor?: {hex?: string}
      websiteHeadingColor?: {hex?: string}
      buttonBackgroundColor?: {hex?: string}
      buttonTextColor?: {hex?: string}
    }
  }
): string | undefined {
  if (colorReference === 'custom') {
    return customColor?.hex
  }

  if (!appearance?.mainColors) {
    return undefined
  }

  const colorMap: Record<string, string | undefined> = {
    primary: appearance.mainColors.primaryColor?.hex,
    secondary: appearance.mainColors.secondaryColor?.hex,
    accent: appearance.mainColors.accentColor?.hex,
    neutral: appearance.mainColors.neutralColor?.hex,
    text: appearance.mainColors.websiteTextColor?.hex,
    heading: appearance.mainColors.websiteHeadingColor?.hex,
    buttonBg: appearance.mainColors.buttonBackgroundColor?.hex,
    buttonText: appearance.mainColors.buttonTextColor?.hex,
  }

  const resolvedColor = colorMap[colorReference || '']

  return resolvedColor
}
