// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension=none"
// @generated from file protos/v1/todo.proto (package todo.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * Todo represents a single todo item
 *
 * @generated from message todo.v1.Todo
 */
export class Todo extends Message<Todo> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string title = 2;
   */
  title = "";

  /**
   * @generated from field: string description = 3;
   */
  description = "";

  /**
   * @generated from field: bool completed = 4;
   */
  completed = false;

  /**
   * @generated from field: google.protobuf.Timestamp created_at = 5;
   */
  createdAt?: Timestamp;

  /**
   * @generated from field: google.protobuf.Timestamp updated_at = 6;
   */
  updatedAt?: Timestamp;

  constructor(data?: PartialMessage<Todo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.Todo";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "completed", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 5, name: "created_at", kind: "message", T: Timestamp },
    { no: 6, name: "updated_at", kind: "message", T: Timestamp },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Todo {
    return new Todo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Todo {
    return new Todo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Todo {
    return new Todo().fromJsonString(jsonString, options);
  }

  static equals(a: Todo | PlainMessage<Todo> | undefined, b: Todo | PlainMessage<Todo> | undefined): boolean {
    return proto3.util.equals(Todo, a, b);
  }
}

/**
 * Create request
 *
 * @generated from message todo.v1.CreateTodoRequest
 */
export class CreateTodoRequest extends Message<CreateTodoRequest> {
  /**
   * @generated from field: string title = 1;
   */
  title = "";

  /**
   * @generated from field: string description = 2;
   */
  description = "";

  constructor(data?: PartialMessage<CreateTodoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.CreateTodoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateTodoRequest {
    return new CreateTodoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateTodoRequest {
    return new CreateTodoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateTodoRequest {
    return new CreateTodoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CreateTodoRequest | PlainMessage<CreateTodoRequest> | undefined, b: CreateTodoRequest | PlainMessage<CreateTodoRequest> | undefined): boolean {
    return proto3.util.equals(CreateTodoRequest, a, b);
  }
}

/**
 * Create response
 *
 * @generated from message todo.v1.CreateTodoResponse
 */
export class CreateTodoResponse extends Message<CreateTodoResponse> {
  /**
   * @generated from field: todo.v1.Todo todo = 1;
   */
  todo?: Todo;

  constructor(data?: PartialMessage<CreateTodoResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.CreateTodoResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "todo", kind: "message", T: Todo },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateTodoResponse {
    return new CreateTodoResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateTodoResponse {
    return new CreateTodoResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateTodoResponse {
    return new CreateTodoResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CreateTodoResponse | PlainMessage<CreateTodoResponse> | undefined, b: CreateTodoResponse | PlainMessage<CreateTodoResponse> | undefined): boolean {
    return proto3.util.equals(CreateTodoResponse, a, b);
  }
}

/**
 * Update request
 *
 * @generated from message todo.v1.UpdateTodoRequest
 */
export class UpdateTodoRequest extends Message<UpdateTodoRequest> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string title = 2;
   */
  title = "";

  /**
   * @generated from field: string description = 3;
   */
  description = "";

  /**
   * @generated from field: bool completed = 4;
   */
  completed = false;

  constructor(data?: PartialMessage<UpdateTodoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.UpdateTodoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "completed", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateTodoRequest {
    return new UpdateTodoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateTodoRequest {
    return new UpdateTodoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateTodoRequest {
    return new UpdateTodoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateTodoRequest | PlainMessage<UpdateTodoRequest> | undefined, b: UpdateTodoRequest | PlainMessage<UpdateTodoRequest> | undefined): boolean {
    return proto3.util.equals(UpdateTodoRequest, a, b);
  }
}

/**
 * Update response
 *
 * @generated from message todo.v1.UpdateTodoResponse
 */
export class UpdateTodoResponse extends Message<UpdateTodoResponse> {
  /**
   * @generated from field: todo.v1.Todo todo = 1;
   */
  todo?: Todo;

  constructor(data?: PartialMessage<UpdateTodoResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.UpdateTodoResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "todo", kind: "message", T: Todo },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateTodoResponse {
    return new UpdateTodoResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateTodoResponse {
    return new UpdateTodoResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateTodoResponse {
    return new UpdateTodoResponse().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateTodoResponse | PlainMessage<UpdateTodoResponse> | undefined, b: UpdateTodoResponse | PlainMessage<UpdateTodoResponse> | undefined): boolean {
    return proto3.util.equals(UpdateTodoResponse, a, b);
  }
}

/**
 * List request with pagination
 *
 * @generated from message todo.v1.ListTodosRequest
 */
export class ListTodosRequest extends Message<ListTodosRequest> {
  /**
   * @generated from field: int32 page_size = 1;
   */
  pageSize = 0;

  /**
   * @generated from field: string page_token = 2;
   */
  pageToken = "";

  constructor(data?: PartialMessage<ListTodosRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.ListTodosRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListTodosRequest {
    return new ListTodosRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListTodosRequest {
    return new ListTodosRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListTodosRequest {
    return new ListTodosRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListTodosRequest | PlainMessage<ListTodosRequest> | undefined, b: ListTodosRequest | PlainMessage<ListTodosRequest> | undefined): boolean {
    return proto3.util.equals(ListTodosRequest, a, b);
  }
}

/**
 * List response
 *
 * @generated from message todo.v1.ListTodosResponse
 */
export class ListTodosResponse extends Message<ListTodosResponse> {
  /**
   * @generated from field: repeated todo.v1.Todo todos = 1;
   */
  todos: Todo[] = [];

  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken = "";

  constructor(data?: PartialMessage<ListTodosResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.ListTodosResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "todos", kind: "message", T: Todo, repeated: true },
    { no: 2, name: "next_page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListTodosResponse {
    return new ListTodosResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListTodosResponse {
    return new ListTodosResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListTodosResponse {
    return new ListTodosResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListTodosResponse | PlainMessage<ListTodosResponse> | undefined, b: ListTodosResponse | PlainMessage<ListTodosResponse> | undefined): boolean {
    return proto3.util.equals(ListTodosResponse, a, b);
  }
}

/**
 * @generated from message todo.v1.GetTodoRequest
 */
export class GetTodoRequest extends Message<GetTodoRequest> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<GetTodoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.GetTodoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetTodoRequest {
    return new GetTodoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetTodoRequest {
    return new GetTodoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetTodoRequest {
    return new GetTodoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetTodoRequest | PlainMessage<GetTodoRequest> | undefined, b: GetTodoRequest | PlainMessage<GetTodoRequest> | undefined): boolean {
    return proto3.util.equals(GetTodoRequest, a, b);
  }
}

/**
 * @generated from message todo.v1.GetTodoResponse
 */
export class GetTodoResponse extends Message<GetTodoResponse> {
  /**
   * @generated from field: todo.v1.Todo todo = 1;
   */
  todo?: Todo;

  constructor(data?: PartialMessage<GetTodoResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.GetTodoResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "todo", kind: "message", T: Todo },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetTodoResponse {
    return new GetTodoResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetTodoResponse {
    return new GetTodoResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetTodoResponse {
    return new GetTodoResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetTodoResponse | PlainMessage<GetTodoResponse> | undefined, b: GetTodoResponse | PlainMessage<GetTodoResponse> | undefined): boolean {
    return proto3.util.equals(GetTodoResponse, a, b);
  }
}

/**
 * @generated from message todo.v1.DeleteTodoRequest
 */
export class DeleteTodoRequest extends Message<DeleteTodoRequest> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<DeleteTodoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.DeleteTodoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteTodoRequest {
    return new DeleteTodoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteTodoRequest {
    return new DeleteTodoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteTodoRequest {
    return new DeleteTodoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteTodoRequest | PlainMessage<DeleteTodoRequest> | undefined, b: DeleteTodoRequest | PlainMessage<DeleteTodoRequest> | undefined): boolean {
    return proto3.util.equals(DeleteTodoRequest, a, b);
  }
}

/**
 * @generated from message todo.v1.DeleteTodoResponse
 */
export class DeleteTodoResponse extends Message<DeleteTodoResponse> {
  constructor(data?: PartialMessage<DeleteTodoResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "todo.v1.DeleteTodoResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteTodoResponse {
    return new DeleteTodoResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteTodoResponse {
    return new DeleteTodoResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteTodoResponse {
    return new DeleteTodoResponse().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteTodoResponse | PlainMessage<DeleteTodoResponse> | undefined, b: DeleteTodoResponse | PlainMessage<DeleteTodoResponse> | undefined): boolean {
    return proto3.util.equals(DeleteTodoResponse, a, b);
  }
}

