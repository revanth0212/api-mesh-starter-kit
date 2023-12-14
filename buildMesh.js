const meshBuilder = require("@adobe-apimesh/mesh-builder");
const { validateMesh, buildMesh, compileMesh } = meshBuilder.default;

const meshId = "mesh";

module.exports = function (meshConfig) {
  return validateMesh(meshConfig)
    .then(() => {
      return buildMesh(meshId, meshConfig)
        .then(() => {
          return compileMesh(meshId).catch((err) => {
            console.error("Error compiling mesh", err);
            throw err;
          });
        })
        .catch((err) => {
          console.error("Error building mesh", err);
          throw err;
        });
    })
    .catch((err) => {
      console.error("Invalid Mesh", err);
      throw err;
    });
};
