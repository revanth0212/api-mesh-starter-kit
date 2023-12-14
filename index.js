const { meshConfig } = require("./mesh.json");

const buildMesh = require("./buildMesh");

buildMesh(meshConfig)
  .then(() => {
    const { createYoga } = require("graphql-yoga");
    const fastify = require("fastify");
    const { getBuiltMesh } = require("./mesh-artifact/mesh");

    const app = fastify();

    app.setErrorHandler(function (error, _request, reply) {
      console.error("Error handler called", error);

      if (error.statusCode) {
        reply.code(error.statusCode).send({
          message: error.message,
          name: error.name,
          statusCode: error.statusCode,
        });
      } else {
        reply.send({
          error,
        });
      }
    });

    app.get("/health", (request, reply) => reply.send({ hello: "world" }));

    app.route({
      url: "/graphql",
      method: ["GET", "POST", "OPTIONS"],
      handler: graphQLHandler,
    });

    async function graphQLHandler(req, reply) {
      try {
        const tenantMesh = await getBuiltMesh();

        const gqlServer = createYoga({
          plugins: tenantMesh.plugins,
          maskedErrors: false,
          graphqlEndpoint: `/graphql`,
          graphiql: true,
        });

        const response = await gqlServer.handleNodeRequest(req, {
          req,
          reply,
        });

        for (const [name, value] of response.headers) {
          reply.header(name, value);
        }

        reply.status(response.status);

        reply.send(response.body);

        return reply;
      } catch (err) {
        console.error("Unable to process graphql request", err);
      }
    }

    app.listen({ port: 9000 }, (err) => {
      if (err) console.error(err);

      console.log("server listening on 9000");
    });
  })
  .catch((err) => {
    console.error("Unable to build mesh", err);
  });
