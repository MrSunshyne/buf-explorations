import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { TodoService } from "@buf-explorations/protos/gen/ts/v1/todo_pb";

const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:9000",
  useBinaryFormat: true,
  interceptors: [],
});

export const client = createClient(TodoService, transport); 