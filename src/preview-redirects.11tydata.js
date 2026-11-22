// Viderestillingssider til GitHub Pages (preview og domæne), som ikke kan lave 301.
// Uden REDIRECT_PAGES/SITE_PREVIEW klarer _redirects-filen det med rigtige 301'ere.
export default {
  eleventyComputed: {
    permalink: (data) => (data.env.redirectPages ? `${data.r.fra}index.html` : false),
  },
};
