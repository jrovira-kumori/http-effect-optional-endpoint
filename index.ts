import { Api, RouterBuilder } from "effect-http";
import { Effect, pipe } from "effect";
import { NodeRuntime } from "@effect/platform-node"
import { NodeServer } from "effect-http-node";
import * as S from '@effect/schema/Schema';

const api = pipe(
    Api.make(),
    Api.addEndpoint(pipe(Api.get("info", "/info"), Api.setResponseBody(S.string))),
    // Api.addEndpoint(pipe(Api.get("optional", "/optional"), Api.setResponseBody(S.string))),
    process.env.SOME_FEATURE_FLAG ? Api.addEndpoint(pipe(Api.get("optional", "/optional"), Api.setResponseBody(S.string))) : e => e,
);

  
const server = pipe(
    RouterBuilder.make(api),
    RouterBuilder.handle("info", () => Effect.succeed("info")),
    RouterBuilder.handle("optional", () => Effect.succeed("optional")),
    RouterBuilder.build,
)

pipe(
    server,
    NodeServer.listen({ port: 8080 }),
    NodeRuntime.runMain
)