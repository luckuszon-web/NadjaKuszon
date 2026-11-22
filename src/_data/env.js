// SITE_PREVIEW=1: GitHub Pages-previewet under /NadjaKuszon/ – må ikke indekseres.
// REDIRECT_PAGES=1: gamle URL'er får viderestillingssider. Bruges på GitHub Pages,
// som ikke kan lave 301 (på Netlify/Cloudflare klarer _redirects det i stedet).
export default {
  preview: process.env.SITE_PREVIEW === "1",
  redirectPages: process.env.SITE_PREVIEW === "1" || process.env.REDIRECT_PAGES === "1",
};
