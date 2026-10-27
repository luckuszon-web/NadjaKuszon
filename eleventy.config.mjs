import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({
    "src/favicon.ico": "favicon.ico",
    "src/favicon.svg": "favicon.svg",
    "src/apple-touch-icon.png": "apple-touch-icon.png",
    "src/.nojekyll": ".nojekyll",
  });

  // Artikler i samme rækkefølge som på den gamle side
  eleventyConfig.addCollection("artikler", (api) =>
    api.getFilteredByTag("artikel").sort((a, b) => a.data.order - b.data.order)
  );

  // Kun kategorier med mindst én artikel får en side (Astrologi skjules, indtil der er indhold)
  eleventyConfig.addCollection("kategorisider", (api) => {
    const categories = api.getAll()[0]?.data.categories ?? [];
    const articles = api.getFilteredByTag("artikel");
    return categories
      .map((c) => ({
        ...c,
        artikler: articles
          .filter((a) => a.data.category === c.slug)
          .sort((a, b) => (b.data.featured - a.data.featured) || (a.data.order - b.data.order)),
      }))
      .filter((c) => c.artikler.length > 0);
  });

  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("categoryName", (slug, categories) => categories.find((c) => c.slug === slug)?.name ?? "");
  eleventyConfig.addFilter("withoutSlash", (path) => path.replace(/\/$/, ""));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
