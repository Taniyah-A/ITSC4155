from pydantic import BaseModel, ConfigDict

class ParentCreate(BaseModel):
    username:str
    email:str
    password:str 
class ParentLogin(BaseModel):
    username:str
    password:str
class ParentResponse(BaseModel):
    model_config = ConfigDict(from_attributes= True)

    id:int
    username:str
    email:str