//
// this file preprocesses the auto-completion data from vim-terraform-completion and bundles it
//

const gulp = require('gulp');
const path = require('path');
const log = require('fancy-log');
const download = require("./download");
const fs = require('fs');

gulp.task('download-documentation', ['create-provider-index'], () => {
  const index = JSON.parse(fs.readFileSync('out/src/data/provider-index.json'));

  const officialProviders = Object.entries(index).filter((entry) => {
    // const name = entry[0];
    const data = entry[1];

    if (!data.meta) {
      return false;
    }

    return data.meta.type === "provider";
  }).map((entry) => entry[0]);

  const urls = officialProviders.map((p) => {
    return {
      url: `https://www.terraform.io/docs/providers/${p}/index.html`,
      name: `${p}.html`
    };
  });

  return download(urls)
    .pipe(gulp.dest('out/tmp/provider-documentation'));
});
