module github.com/MrSunshyne/buf-explorations/server

go 1.23.0

toolchain go1.24.2

require (
	github.com/MrSunshyne/buf-explorations/protos v0.0.0
	github.com/google/uuid v1.6.0
	github.com/grpc-ecosystem/grpc-gateway/v2 v2.18.1
	google.golang.org/genproto/googleapis/api v0.0.0-20231106174013-bbf56f31fb17
	google.golang.org/grpc v1.59.0
	google.golang.org/protobuf v1.31.0
)

require (
	github.com/cenkalti/backoff/v4 v4.1.1 // indirect
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/golang/protobuf v1.5.3 // indirect
	github.com/improbable-eng/grpc-web v0.15.0 // indirect
	github.com/klauspost/compress v1.11.7 // indirect
	github.com/rs/cors v1.7.0 // indirect
	golang.org/x/net v0.38.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/text v0.23.0 // indirect
	google.golang.org/genproto v0.0.0-20231030173426-d783a09b4405 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20231030173426-d783a09b4405 // indirect
	nhooyr.io/websocket v1.8.6 // indirect
)

replace github.com/MrSunshyne/buf-explorations/protos => ../protos
