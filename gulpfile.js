const fs = require("fs-extra");
const path = require("path");
const gulp = require("gulp");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const { setConfig } = require("@hopin/wbt-config");
const tsBrowser = require("@hopin/wbt-ts-browser");
const imagemin = require("gulp-imagemin");
const semver = require("semver");
const archiver = require("archiver");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const prodExtensionKey = "eddlalejjnkkalohmonpfgdhimepifhl";
const devExtensionkey = "developmentkalohmonpfgdhimepifhl";

const src = path.join(__dirname, "src");
const dst = path.join(__dirname, "build");

setConfig(src, dst);

gulp.task("zip", async function () {
  const zipPath = path.join(__dirname, "gauntface-extension.zip");
  await fs.remove(zipPath);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", {
    zlib: {
      // Sets the compression level
      level: 9,
    },
  });

  return new Promise((resolve, reject) => {
    output.on("close", function () {
      resolve();
    });

    output.on("end", function () {
      console.log("Output End event");
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on("warning", function (err) {
      if (err.code === "ENOENT") {
        console.warn(`Archiver warning: ${err.message}`);
      } else {
        reject(err);
      }
    });

    // good practice to catch this error explicitly
    archive.on("error", function (err) {
      reject(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    archive.directory(dst, "gauntface-extension");

    // append files from a sub-directory, putting its contents at the root of archive
    // archive.directory('subdir/', false);

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
  });
});

gulp.task("bumpManifestVersion", async function () {
  const manifestPath = path.join(src, "manifest.json");
  const manifestContents = await fs.readJSON(manifestPath);
  const newVersion = semver.inc(manifestContents.version, "patch");
  if (!newVersion) {
    throw new Error(
      `Version could not be bumped by semver: ${manifestContents.version}`
    );
  }
  manifestContents.version = newVersion;
  await fs.writeFile(manifestPath, JSON.stringify(manifestContents, null, 2));
});

gulp.task("dev-manifest", async function () {
  const manifestPath = path.join(dst, "manifest.json");
  const manifestContents = await fs.readJSON(manifestPath);
  manifestContents.key = devExtensionkey;
  manifestContents.name = `Dev: ${manifestContents.name}`;
  for (const k of Object.keys(manifestContents.icons)) {
    const parts = manifestContents.icons[k].split(".");
    manifestContents.icons[k] = `${parts[0]}-dev.${parts[1]}`;
  }
  await fs.writeFile(manifestPath, JSON.stringify(manifestContents, null, 2));
});

gulp.task("prod-manifest", async function () {
  const manifestPath = path.join(dst, "manifest.json");
  const manifestContents = await fs.readJSON(manifestPath);
  manifestContents.key = prodExtensionKey;
  await fs.writeFile(manifestPath, JSON.stringify(manifestContents, null, 2));
});

gulp.task("images", function () {
  const extensions = ["jpeg", "jpg", "png", "gif", "svg"];

  return gulp
    .src(`${src}/**/*.{${extensions.join(",")}}`)
    .pipe(imagemin())
    .pipe(gulp.dest(dst));
});

gulp.task("clean", function () {
  return fs.remove(dst);
});

gulp.task("copy", function () {
  const extensions = ["json", "html", "css"];

  return gulp.src(`${src}/**/*.{${extensions.join(",")}}`).pipe(gulp.dest(dst));
});

gulp.task("prettier", () => {
  return exec("npx prettier --write .");
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    "prettier",
    gulp.parallel(
      tsBrowser.gulpBuild("gauntface.extension", {
        rollupPlugins: [
          commonjs(),
          resolve({
            browser: true,
          }),
        ],
      }),
      "copy",
      "images"
    ),
    "dev-manifest"
  )
);

gulp.task("publish", function (done) {
  process.env.NODE_ENV = "production";

  return gulp.series(["bumpManifestVersion", "build", "prod-manifest", "zip"])(
    done
  );
});
