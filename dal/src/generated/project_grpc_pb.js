// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var project_pb = require('./project_pb.js');

function serialize_project_CreateProjectRequest(arg) {
  if (!(arg instanceof project_pb.CreateProjectRequest)) {
    throw new Error('Expected argument of type project.CreateProjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_CreateProjectRequest(buffer_arg) {
  return project_pb.CreateProjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_CreateProjectResponse(arg) {
  if (!(arg instanceof project_pb.CreateProjectResponse)) {
    throw new Error('Expected argument of type project.CreateProjectResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_CreateProjectResponse(buffer_arg) {
  return project_pb.CreateProjectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_CreateTaskRequest(arg) {
  if (!(arg instanceof project_pb.CreateTaskRequest)) {
    throw new Error('Expected argument of type project.CreateTaskRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_CreateTaskRequest(buffer_arg) {
  return project_pb.CreateTaskRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_CreateTaskResponse(arg) {
  if (!(arg instanceof project_pb.CreateTaskResponse)) {
    throw new Error('Expected argument of type project.CreateTaskResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_CreateTaskResponse(buffer_arg) {
  return project_pb.CreateTaskResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_Empty(arg) {
  if (!(arg instanceof project_pb.Empty)) {
    throw new Error('Expected argument of type project.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_Empty(buffer_arg) {
  return project_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_ListProjectsResponse(arg) {
  if (!(arg instanceof project_pb.ListProjectsResponse)) {
    throw new Error('Expected argument of type project.ListProjectsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_ListProjectsResponse(buffer_arg) {
  return project_pb.ListProjectsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_MigrateTaskRequest(arg) {
  if (!(arg instanceof project_pb.MigrateTaskRequest)) {
    throw new Error('Expected argument of type project.MigrateTaskRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_MigrateTaskRequest(buffer_arg) {
  return project_pb.MigrateTaskRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_project_MigrateTaskResponse(arg) {
  if (!(arg instanceof project_pb.MigrateTaskResponse)) {
    throw new Error('Expected argument of type project.MigrateTaskResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_project_MigrateTaskResponse(buffer_arg) {
  return project_pb.MigrateTaskResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// The ProjectService definition
var ProjectServiceService = exports.ProjectServiceService = {
  createProject: {
    path: '/project.ProjectService/CreateProject',
    requestStream: false,
    responseStream: false,
    requestType: project_pb.CreateProjectRequest,
    responseType: project_pb.CreateProjectResponse,
    requestSerialize: serialize_project_CreateProjectRequest,
    requestDeserialize: deserialize_project_CreateProjectRequest,
    responseSerialize: serialize_project_CreateProjectResponse,
    responseDeserialize: deserialize_project_CreateProjectResponse,
  },
  listProjects: {
    path: '/project.ProjectService/ListProjects',
    requestStream: false,
    responseStream: false,
    requestType: project_pb.Empty,
    responseType: project_pb.ListProjectsResponse,
    requestSerialize: serialize_project_Empty,
    requestDeserialize: deserialize_project_Empty,
    responseSerialize: serialize_project_ListProjectsResponse,
    responseDeserialize: deserialize_project_ListProjectsResponse,
  },
  createTask: {
    path: '/project.ProjectService/CreateTask',
    requestStream: false,
    responseStream: false,
    requestType: project_pb.CreateTaskRequest,
    responseType: project_pb.CreateTaskResponse,
    requestSerialize: serialize_project_CreateTaskRequest,
    requestDeserialize: deserialize_project_CreateTaskRequest,
    responseSerialize: serialize_project_CreateTaskResponse,
    responseDeserialize: deserialize_project_CreateTaskResponse,
  },
  migrateTask: {
    path: '/project.ProjectService/MigrateTask',
    requestStream: false,
    responseStream: false,
    requestType: project_pb.MigrateTaskRequest,
    responseType: project_pb.MigrateTaskResponse,
    requestSerialize: serialize_project_MigrateTaskRequest,
    requestDeserialize: deserialize_project_MigrateTaskRequest,
    responseSerialize: serialize_project_MigrateTaskResponse,
    responseDeserialize: deserialize_project_MigrateTaskResponse,
  },
};

exports.ProjectServiceClient = grpc.makeGenericClientConstructor(ProjectServiceService);
