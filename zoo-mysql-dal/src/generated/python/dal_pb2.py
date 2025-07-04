# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: dal.proto
# Protobuf Python Version: 5.28.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    28,
    1,
    '',
    'dal.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\tdal.proto\x12\x03\x64\x61l\"2\n\x14ProjectCreateRequest\x12\x11\n\x04name\x18\x01 \x01(\tH\x00\x88\x01\x01\x42\x07\n\x05_name\"M\n\x15ProjectCreateResponse\x12(\n\x07project\x18\x01 \x01(\x0b\x32\x12.dal.ProjectObjectH\x00\x88\x01\x01\x42\n\n\x08_project\"\x14\n\x12ProjectListRequest\"L\n\x14ProjectUpdateRequest\x12(\n\x07project\x18\x01 \x01(\x0b\x32\x12.dal.ProjectObjectH\x00\x88\x01\x01\x42\n\n\x08_project\"M\n\x15ProjectUpdateResponse\x12(\n\x07project\x18\x01 \x01(\x0b\x32\x12.dal.ProjectObjectH\x00\x88\x01\x01\x42\n\n\x08_project\";\n\x13ProjectListResponse\x12$\n\x08projects\x18\x01 \x03(\x0b\x32\x12.dal.ProjectObject\"L\n\x14ProjectDeleteRequest\x12&\n\tprojectId\x18\x01 \x01(\x0b\x32\x0e.dal.ProjectIdH\x00\x88\x01\x01\x42\x0c\n\n_projectId\"\x17\n\x15ProjectDeleteResponse\"1\n\tProjectId\x12\x16\n\tprojectId\x18\x01 \x01(\x05H\x00\x88\x01\x01\x42\x0c\n\n_projectId\"\x9f\x01\n\rProjectObject\x12\x1f\n\x02id\x18\x01 \x01(\x0b\x32\x0e.dal.ProjectIdH\x00\x88\x01\x01\x12\x11\n\x04name\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x16\n\tcreatedAt\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x16\n\tupdatedAt\x18\x04 \x01(\tH\x03\x88\x01\x01\x42\x05\n\x03_idB\x07\n\x05_nameB\x0c\n\n_createdAtB\x0c\n\n_updatedAt\"/\n\x11TaskCreateRequest\x12\x11\n\x04name\x18\x01 \x01(\tH\x00\x88\x01\x01\x42\x07\n\x05_name\"A\n\x12TaskCreateResponse\x12\"\n\x04task\x18\x01 \x01(\x0b\x32\x0f.dal.TaskObjectH\x00\x88\x01\x01\x42\x07\n\x05_task\"G\n\x0fTaskListRequest\x12&\n\tprojectId\x18\x01 \x01(\x0b\x32\x0e.dal.ProjectIdH\x00\x88\x01\x01\x42\x0c\n\n_projectId\"2\n\x10TaskListResponse\x12\x1e\n\x05tasks\x18\x01 \x03(\x0b\x32\x0f.dal.TaskObject\"@\n\x11TaskUpdateRequest\x12\"\n\x04task\x18\x01 \x01(\x0b\x32\x0f.dal.TaskObjectH\x00\x88\x01\x01\x42\x07\n\x05_task\"A\n\x12TaskUpdateResponse\x12\"\n\x04task\x18\x01 \x01(\x0b\x32\x0f.dal.TaskObjectH\x00\x88\x01\x01\x42\x07\n\x05_task\"@\n\x11TaskDeleteRequest\x12 \n\x06taskId\x18\x01 \x01(\x0b\x32\x0b.dal.TaskIdH\x00\x88\x01\x01\x42\t\n\x07_taskId\"\x14\n\x12TaskDeleteResponse\"w\n\x12TaskMigrateRequest\x12 \n\x06taskId\x18\x01 \x01(\x0b\x32\x0b.dal.TaskIdH\x00\x88\x01\x01\x12&\n\tprojectId\x18\x02 \x01(\x0b\x32\x0e.dal.ProjectIdH\x01\x88\x01\x01\x42\t\n\x07_taskIdB\x0c\n\n_projectId\"B\n\x13TaskMigrateResponse\x12\"\n\x04task\x18\x01 \x01(\x0b\x32\x0f.dal.TaskObjectH\x00\x88\x01\x01\x42\x07\n\x05_task\" \n\x06TaskId\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x42\x05\n\x03_id\"\xcf\x01\n\nTaskObject\x12\x1c\n\x02id\x18\x01 \x01(\x0b\x32\x0b.dal.TaskIdH\x00\x88\x01\x01\x12&\n\tprojectId\x18\x02 \x01(\x0b\x32\x0e.dal.ProjectIdH\x01\x88\x01\x01\x12\x11\n\x04name\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x16\n\tcreatedAt\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x16\n\tupdatedAt\x18\x05 \x01(\tH\x04\x88\x01\x01\x42\x05\n\x03_idB\x0c\n\n_projectIdB\x07\n\x05_nameB\x0c\n\n_createdAtB\x0c\n\n_updatedAt2\xaa\x02\n\x0eProjectService\x12\x46\n\rProjectCreate\x12\x19.dal.ProjectCreateRequest\x1a\x1a.dal.ProjectCreateResponse\x12@\n\x0bProjectList\x12\x17.dal.ProjectListRequest\x1a\x18.dal.ProjectListResponse\x12\x46\n\rProjectUpdate\x12\x19.dal.ProjectUpdateRequest\x1a\x1a.dal.ProjectUpdateResponse\x12\x46\n\rProjectDelete\x12\x19.dal.ProjectDeleteRequest\x1a\x1a.dal.ProjectDeleteResponse2\x83\x02\n\x0bTaskService\x12=\n\nTaskCreate\x12\x16.dal.TaskCreateRequest\x1a\x17.dal.TaskCreateResponse\x12\x37\n\x08TaskList\x12\x14.dal.TaskListRequest\x1a\x15.dal.TaskListResponse\x12=\n\nTaskUpdate\x12\x16.dal.TaskUpdateRequest\x1a\x17.dal.TaskUpdateResponse\x12=\n\nTaskDelete\x12\x16.dal.TaskDeleteRequest\x1a\x17.dal.TaskDeleteResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'dal_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_PROJECTCREATEREQUEST']._serialized_start=18
  _globals['_PROJECTCREATEREQUEST']._serialized_end=68
  _globals['_PROJECTCREATERESPONSE']._serialized_start=70
  _globals['_PROJECTCREATERESPONSE']._serialized_end=147
  _globals['_PROJECTLISTREQUEST']._serialized_start=149
  _globals['_PROJECTLISTREQUEST']._serialized_end=169
  _globals['_PROJECTUPDATEREQUEST']._serialized_start=171
  _globals['_PROJECTUPDATEREQUEST']._serialized_end=247
  _globals['_PROJECTUPDATERESPONSE']._serialized_start=249
  _globals['_PROJECTUPDATERESPONSE']._serialized_end=326
  _globals['_PROJECTLISTRESPONSE']._serialized_start=328
  _globals['_PROJECTLISTRESPONSE']._serialized_end=387
  _globals['_PROJECTDELETEREQUEST']._serialized_start=389
  _globals['_PROJECTDELETEREQUEST']._serialized_end=465
  _globals['_PROJECTDELETERESPONSE']._serialized_start=467
  _globals['_PROJECTDELETERESPONSE']._serialized_end=490
  _globals['_PROJECTID']._serialized_start=492
  _globals['_PROJECTID']._serialized_end=541
  _globals['_PROJECTOBJECT']._serialized_start=544
  _globals['_PROJECTOBJECT']._serialized_end=703
  _globals['_TASKCREATEREQUEST']._serialized_start=705
  _globals['_TASKCREATEREQUEST']._serialized_end=752
  _globals['_TASKCREATERESPONSE']._serialized_start=754
  _globals['_TASKCREATERESPONSE']._serialized_end=819
  _globals['_TASKLISTREQUEST']._serialized_start=821
  _globals['_TASKLISTREQUEST']._serialized_end=892
  _globals['_TASKLISTRESPONSE']._serialized_start=894
  _globals['_TASKLISTRESPONSE']._serialized_end=944
  _globals['_TASKUPDATEREQUEST']._serialized_start=946
  _globals['_TASKUPDATEREQUEST']._serialized_end=1010
  _globals['_TASKUPDATERESPONSE']._serialized_start=1012
  _globals['_TASKUPDATERESPONSE']._serialized_end=1077
  _globals['_TASKDELETEREQUEST']._serialized_start=1079
  _globals['_TASKDELETEREQUEST']._serialized_end=1143
  _globals['_TASKDELETERESPONSE']._serialized_start=1145
  _globals['_TASKDELETERESPONSE']._serialized_end=1165
  _globals['_TASKMIGRATEREQUEST']._serialized_start=1167
  _globals['_TASKMIGRATEREQUEST']._serialized_end=1286
  _globals['_TASKMIGRATERESPONSE']._serialized_start=1288
  _globals['_TASKMIGRATERESPONSE']._serialized_end=1354
  _globals['_TASKID']._serialized_start=1356
  _globals['_TASKID']._serialized_end=1388
  _globals['_TASKOBJECT']._serialized_start=1391
  _globals['_TASKOBJECT']._serialized_end=1598
  _globals['_PROJECTSERVICE']._serialized_start=1601
  _globals['_PROJECTSERVICE']._serialized_end=1899
  _globals['_TASKSERVICE']._serialized_start=1902
  _globals['_TASKSERVICE']._serialized_end=2161
# @@protoc_insertion_point(module_scope)
