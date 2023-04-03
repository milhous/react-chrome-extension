const browserslist = [
  "last 1 version",
  "> 1%",
  "maintained node versions",
  "not dead",
];

module.exports = {
  plugins: [
    "tailwindcss",
    [
      "autoprefixer",
      {
        grid: "autoplace",
        cascade: true,
        remove: true,
        // 解决各个应用无需在package.json配置Browserslist
        overrideBrowserslist: browserslist,
      },
    ],
  ],
};
