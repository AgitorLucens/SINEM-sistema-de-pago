const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');
const fs = require('fs-extra');
const { se } = require('react-day-picker/locale');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/ui/assets/SINEM',
  },
  rebuildConfig: {},
  hooks: {
    /**
     * ESTE HOOK ES LA CLAVE
     * Copia better-sqlite3 (y deps) DENTRO del build
     * antes de que se genere app.asar
     */
    async packageAfterCopy(_config, buildPath) {
      const nativePackages = [
        'better-sqlite3',
        'bindings',
        'file-uri-to-path',
      ];

      const sourceNodeModules = path.resolve(__dirname, 'node_modules');
      const targetNodeModules = path.join(buildPath, 'node_modules');

      for (const pkg of nativePackages) {
        const src = path.join(sourceNodeModules, pkg);
        const dest = path.join(targetNodeModules, pkg);

        if (await fs.pathExists(src)) {
          await fs.ensureDir(path.dirname(dest));
          await fs.copy(src, dest, {
            recursive: true,
            preserveTimestamps: true,
          });
        }
      }
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: './src/ui/assets/SINEM.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './src/ui/assets/SINEM.png',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
            target: 'main',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
