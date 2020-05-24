const { Project } = require("ts-morph");
const { join } = require("path");

(async () => {
  console.info("Started...");

  const project = new Project({
    tsConfigFilePath: join(__dirname, "..", "backend", "tsconfig.json"),
  });

  project.getSourceFiles().forEach((file) => {
    console.log(file.getFilePath());
  });
})();
