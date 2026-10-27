// Viderestillingssider bygges kun til GitHub Pages-previewet (SITE_PREVIEW=1).
// I produktion klarer _redirects-filen det med rigtige 301'ere.
export default {
  eleventyComputed: {
    permalink: (data) => (data.env.preview ? `${data.r.fra}index.html` : false),
  },
};
