const npsUtils = require("nps-utils");

const series = npsUtils.series;
const concurrent = npsUtils.concurrent;
const rimraf = npsUtils.rimraf;
const crossEnv = npsUtils.crossEnv;

module.exports = {
  scripts: {
    test: {
      default: crossEnv("NODE_ENV=test")
    },
    clean: {
      description: "delete the build folders",
      script: "rimraf lib dist es"
    },
    build: {
      description: "delete the dist directory and run all builds",
      default: series(
        rimraf("dist"),
        concurrent.nps(
          "build.es",
          "build.cjs",
          "build.umd.main",
          "build.umd.min",
          "copyTypes"
        )
      ),
      es: {
        description: "run the build with rollup (uses rollup.config.js)",
        script: "rollup --config --environment FORMAT:es"
      },
      cjs: {
        description: "run rollup build with CommonJS format",
        script: "rollup --config --environment FORMAT:cjs"
      },
      umd: {
        min: {
          description: "run the rollup build with sourcemaps",
          script: "rollup --config --sourcemap --environment MINIFY,FORMAT:umd"
        },
        main: {
          description: "builds the cjs and umd files",
          script: "rollup --config --sourcemap --environment FORMAT:umd"
        }
      },
      andTest: series.nps("build")
    },
    copyTypes: series(npsUtils.copy("*.d.ts dist")),
    validate: {
      description: "builds the package",
      default: concurrent.nps("build.andTest", "test")
    }
  },
  options: {
    silent: false
  }
};
