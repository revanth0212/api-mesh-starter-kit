const meshBuilder = require("@adobe-apimesh/mesh-builder");
const {
  startGraphqlServer,
  importFiles,
} = require("@adobe/aio-cli-plugin-api-mesh/src/helpers");

const { validateMesh, buildMesh, compileMesh } = meshBuilder.default;

const meshId = "mesh";
const config = require("./mesh.json");

function setupMeshConfig(meshConfig) {
  const meshConfigWithImportedFiles = importFiles(meshConfig);
}

const { meshConfig } = config;

validateMesh(meshConfig)
  .then(() => {
    console.log("Validated mesh");
    buildMesh(meshId, meshConfig)
      .then(() => {
        console.log("Built mesh");
        compileMesh(meshId)
          .then(() => {
            console.log("Compiled mesh");
            startGraphqlServer(meshId, 5000, false);
            console.log("Server running on port", 5000);
          })
          .catch((e) => {
            console.log("Unable to compile mesh", e);
          });
      })
      .catch((e) => {
        console.log("Unable to build mesh", e);
      });
  })
  .catch((e) => {
    console.log("Unable to validate mesh", e);
  });
