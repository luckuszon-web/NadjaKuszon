// SITE_PREVIEW=1 bruges til GitHub Pages-previewet: siden må ikke indekseres,
// og gamle URL'er får midlertidige viderestillingssider (GitHub Pages kan ikke lave 301).
export default {
  preview: process.env.SITE_PREVIEW === "1",
};
