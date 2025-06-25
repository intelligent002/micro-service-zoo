import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {dal} from '../generated/dal';
import ProjectCreateRequest = dal.ProjectCreateRequest;
import ProjectCreateResponse = dal.ProjectCreateResponse;
import {ProjectDAL} from "../dal/projectDAL";
import {TaskDAL} from "../dal/taskDAL";

const PROTO_PATH = __dirname + '/dal.proto';

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const dalPackage = grpcObject.dal;

const server = new grpc.Server();

server.addService(dalPackage.ProjectService.service, {
    async ProjectCreate(
        call: grpc.ServerUnaryCall<ProjectCreateRequest, ProjectCreateResponse>,
        callback: grpc.sendUnaryData<ProjectCreateResponse>
    ) {
        const {name} = call.request;
        const project = await ProjectDAL.createProject({name});
        callback(null, {project: project});
    },
    async ListProjects(call: any, callback: any) {
        const projects = await ProjectDAL.listProjects();
        callback(null, {projects: projects});
    },
    async CreateTask(call: any, callback: any) {
        const {projectId, name} = call.request;
        const task = await TaskDAL.createTask({projectId, name});
        callback(null, {task: task});
    },
    async MigrateTask(call: any, callback: any) {
        const {taskId, newProjectId} = call.request;
        const task = await TaskDAL.migrateTask({taskId, newProjectId});
        callback(null, {task: task});
    },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server is running on port 50051');
    server.start();
});
