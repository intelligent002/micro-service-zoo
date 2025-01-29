import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = __dirname + '/../grpc/project.proto';
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const projectPackage = grpcObject.project;

const client = new projectPackage.ProjectService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

client.CreateProject({ name: 'Project A' }, (err: any, response: any) => {
    if (err) console.error(err);
    else console.log('Created Project:', response);
});
