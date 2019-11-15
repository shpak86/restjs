# RESTjs server
HTTP server for training to work with Docker containers.

## Description
RESTjs is a simple HTTP server provides an API to perform CRUD operations on database documents.
Each document contains fields `key` and `value` of `String` type. MongoDB is used as a database. 
This project creates for training to work with Docker containers. 

## REST API

### Server information
#### Request
Type: `GET`  
Path: `/info`
#### Successful response
Status code: `200`  
Body:
```json
{
  "result": "String"
}
```

### Get items collection
#### Request

Type: `GET`  
Path: `/storage`  

#### Successful response
Status code: `200`  
Body:
```json
[
 {"key": "String", "value": "String"}
]
```

### Get item by key
#### Request

Type: `GET`  
Path: `/storage/:key`  

#### Successful response
Status code: `200`  
Body:
```json
 {"key": "String", "value": "String"}
```

#### Item not found response
Status code: `404`  
Body:
```json
 {"message": "String"}
```

### Add new document
#### Request

Type: `POST`  
Path: `/storage`  
Content-type: `application/json`
Body:
```json
{
  "key": "String",
  "value": "String"    
}
```

#### Document successfully added response
Status code: `200`  
Body:
```json
{
  "message": "Key {key} successfully added"
}
```

#### Document already exists
Status code: `304`  
Body:
```json
{
  "message": "Key {key} exists"
}
```

#### Wrong request body or key
Status code: `412`  
Body:
```json
{
  "message": "Wrong body or key"
}
```

#### Internal server error
Status code: `500`  
Body:
```json
{
  "message": "String"
}
```

### Update existing document
#### Request

Type: `PUT`  
Path: `/storage`  
Content-type: `application/json`
Body:
```json
{
  "key": "String",
  "value": "String"    
}
```

#### Document successfully updated response
Status code: `200`  
Body:
```json
{
  "message": "Key {key} successfully updated"
}
```

#### Wrong request body or key
Status code: `412`  
Body:
```json
{
  "message": "Wrong body or key"
}
```

#### Internal server error
Status code: `500`  
Body:
```json
{
  "message": "String"
}
```

### Delete existing document
#### Request

Type: `DELETE`  
Path: `/storage/:key`  

#### Document successfully deleted
Status code: `200`  
Body:
```json
{
  "message": "Key {key} successfully deleted"
}
```

#### Internal server error
Status code: `500`  
Body:
```json
{
  "message": "String"
}
```