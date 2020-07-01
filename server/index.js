require("dotenv").config();
const spawn = require("child_process").spawn;
const express = require("express");

// const setupMiddleware = require("./util/setupMiddleware")
// const Router = require("./resources/Router")
const expressCallback = require("./util/expressCallback");
const badRequest = require("./util/badRequest");
// const DB = require("./DB")

const app = express();
// setupMiddleware(app)

const Router = require("express").Router();

// const AuthControllers = require("./auth/auth.controllers");
// const UserFilmMetaControllers = require("./UserFilmMeta/userFilmMeta.controllers");

const returnNewProcess = () => {
  return spawn("gatsby", ["develop", "-p", 4000]);
};

let gatsbyProcess;

Router.route("/").get(
  expressCallback(async (req) => {
    return {
      statusCode: 200,
      body: {
        gatsbyProcess,
      },
    };
  })
);

Router.route("/start")
  .get(
    expressCallback(async (req) => {
      try {
        console.log("\n\nBoom\n\n");

        gatsbyProcess = returnNewProcess();

        gatsbyProcess.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
        });

        gatsbyProcess.stderr.on("data", (data) => {
          console.log(`stderr: ${data}`);
        });

        gatsbyProcess.on("error", (error) => {
          console.log(`error: ${error.message}`);
        });

        gatsbyProcess.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
        });

        return {
          statusCode: 200,
          body: {
            moose: "boof",
          },
        };
      } catch (err) {
        console.log("errrrrrrrrrrrr:\n\n", err);
        return {
          statusCode: 500,
          body: {
            errors: ["some error"],
          },
        };
      }
    })
  )
  .all(expressCallback(badRequest));

Router.route("/kill")
  .get(
    expressCallback(async (req) => {
      // start child process
      try {
        return {
          statusCode: 200,
          body: {
            children,
          },
        };
      } catch (err) {
        console.log("errrrrrrrrrrrr:\n\n", err);
        return {
          statusCode: 500,
          body: {
            errors: ["some error"],
          },
        };
      }
    })
  )
  .all(expressCallback(badRequest));

app.use(Router);

// Return 404 if no routes match
app.all(
  "*",
  expressCallback(async () => {
    return {
      statusCode: 404,
      body: {
        errors: ["No resource found at that location!"],
      },
    };
  })
);

app.use((err, req, res) => {
  console.log("\n\nUnhandled error???\n\n", err, "\n\n");
  res.status(500).json({
    errors: [err],
  });
});

// DB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
