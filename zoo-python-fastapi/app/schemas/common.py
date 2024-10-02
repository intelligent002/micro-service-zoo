from typing import Dict, List, Union

from pydantic import BaseModel, Field


# Define a base response for status
class BaseOkResp(BaseModel):
    status: str = Field(...,
                        title="Execution Status - OK",
                        description="Status of the call execution",
                        examples=["OK"])

class BaseErrResp(BaseOkResp):
    status: str = Field(...,
                        title="Execution Status - Failure",
                        description="Status of the call execution",
                        examples=["ERROR"])


# Define a generic success response that can hold any type of result
class RespOkGeneric(BaseOkResp):
    result: Union[str, List[str], Dict[str, str]] = Field(...,
                                                          title="Execution results",
                                                          description="Execution results of varying types",
                                                          examples=[
                                                              {"example_type": "string", "value": "OK"},
                                                              {"example_type": "list", "value": ["item1", "item2"]},
                                                              {"example_type": "dict", "value": {"MySQL": "OK"}}
                                                          ])


# Define a generic error response that can hold any type of error details
class RespErrGeneric(BaseErrResp):
    error: Union[str, List[str], Dict[str, str]] = Field(...,
                                                         title="Error details",
                                                         description="Details of the error in varying types",
                                                         examples=[
                                                             {"example_type": "string",
                                                              "value": "Something went wrong"},
                                                             {"example_type": "list", "value": ["Error1", "Error2"]},
                                                             {"example_type": "dict", "value": {"MySQL": "ERROR"}}
                                                         ])


# Specific success response with a string result
class RespOkString(RespOkGeneric):
    result: str = Field(...,
                        title="Execution results",
                        description="Execution results in string format",
                        examples=["OK"])


# Specific error response with a string error message
class RespErrString(RespErrGeneric):
    error: str = Field(...,
                       title="Error details",
                       description="Error details in string format",
                       examples=["Something went wrong"])


# Specific success response with a list of strings
class RespOkList(RespOkGeneric):
    result: List[str] = Field(...,
                              title="Execution results",
                              description="Execution results in list format",
                              examples=["item1", "item2"])


# Specific error response with a list of error messages
class RespErrList(RespErrGeneric):
    error: List[str] = Field(...,
                             title="Error details",
                             description="Error details in list format",
                             examples=["Error1", "Error2"])


# Specific success response with a dictionary result
class RespOkDict(RespOkGeneric):
    result: Dict[str, str] = Field(...,
                                   title="Execution results",
                                   description="Execution results in dictionary format",
                                   examples=[{"MySQL": "OK"}])


# Specific error response with a dictionary of error details
class RespErrDict(RespErrGeneric):
    error: Dict[str, str] = Field(...,
                                  title="Error details",
                                  description="Error details in dictionary format",
                                  examples=[{"MySQL": "ERROR"}])
