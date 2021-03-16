[@opensrp/react-utils](../README.md) / [Exports](../modules.md) / OpenSRPService

# Class: OpenSRPService<T\>

OpenSRP service Generic class

## Type parameters

| Name | Type     | Default    |
| :--- | :------- | :--------- |
| `T`  | _object_ | Dictionary |

## Hierarchy

- _GenericOpenSRPService_<T\>

  ↳ **OpenSRPService**

## Table of contents

### Constructors

- [constructor](opensrpservice.md#constructor)

### Properties

- [accessTokenOrCallBack](opensrpservice.md#accesstokenorcallback)
- [baseURL](opensrpservice.md#baseurl)
- [endpoint](opensrpservice.md#endpoint)
- [generalURL](opensrpservice.md#generalurl)
- [getOptions](opensrpservice.md#getoptions)
- [signal](opensrpservice.md#signal)

### Methods

- [create](opensrpservice.md#create)
- [delete](opensrpservice.md#delete)
- [list](opensrpservice.md#list)
- [read](opensrpservice.md#read)
- [update](opensrpservice.md#update)
- [getFilterParams](opensrpservice.md#getfilterparams)
- [getURL](opensrpservice.md#geturl)
- [processAcessToken](opensrpservice.md#processacesstoken)

## Constructors

### constructor

\+ **new OpenSRPService**<T\>(`endpoint`: _string_, `baseURL?`: _string_, `fetchOptions?`: <T\>(`\_`: AbortSignal, `accessToken`: _string_, `method`: HTTPMethod, `data?`: T) => RequestInit): [_OpenSRPService_](opensrpservice.md)<T\>

#### Type parameters:

| Name | Type     | Default            |
| :--- | :------- | :----------------- |
| `T`  | _object_ | _Dictionary_<any\> |

#### Parameters:

| Name           | Type                                                                                              | Description                                        |
| :------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------- |
| `endpoint`     | _string_                                                                                          | the OpenSRP endpoint                               |
| `baseURL`      | _string_                                                                                          | base OpenSRP API URL                               |
| `fetchOptions` | <T\>(`\_`: AbortSignal, `accessToken`: _string_, `method`: HTTPMethod, `data?`: T) => RequestInit | function to return options to be passed to request |

**Returns:** [_OpenSRPService_](opensrpservice.md)<T\>

Overrides: void

Defined in: [packages/react-utils/src/helpers/dataLoaders.ts:19](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/helpers/dataLoaders.ts#L19)

## Properties

### accessTokenOrCallBack

• **accessTokenOrCallBack**: _string_ \| GetAccessTokenType

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:55

---

### baseURL

• **baseURL**: _string_

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:56

---

### endpoint

• **endpoint**: _string_

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:57

---

### generalURL

• **generalURL**: _string_

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:58

---

### getOptions

• **getOptions**: <T\>(`\_`: AbortSignal, `accessToken`: _string_, `method`: HTTPMethod, `data?`: T) => RequestInit

#### Type declaration:

▸ <T\>(`_`: AbortSignal, `accessToken`: _string_, `method`: HTTPMethod, `data?`: T): RequestInit

get payload for fetch

#### Type parameters:

| Name | Type     | Default            |
| :--- | :------- | :----------------- |
| `T`  | _object_ | _Dictionary_<any\> |

#### Parameters:

| Name          | Type        | Description                                                     |
| :------------ | :---------- | :-------------------------------------------------------------- |
| `_`           | AbortSignal | signal object that allows you to communicate with a DOM request |
| `accessToken` | _string_    | the access token                                                |
| `method`      | HTTPMethod  | the HTTP method                                                 |
| `data?`       | T           | data to be used for payload                                     |

**Returns:** RequestInit

the payload

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:26

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:59

---

### signal

• **signal**: AbortSignal

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:60

## Methods

### create

▸ **create**(`data`: T, `params?`: _null_ \| URLParams, `method?`: _GET_ \| _POST_ \| _PUT_ \| _DELETE_): _Promise_<Record<string, unknown\>\>

create method
Send a POST request to the general endpoint containing the new object data
Successful requests will result in a HTTP status 201 response with no body

#### Parameters:

| Name      | Type                                 | Description           |
| :-------- | :----------------------------------- | :-------------------- |
| `data`    | T                                    | the data to be POSTed |
| `params?` | _null_ \| URLParams                  | the url params object |
| `method?` | _GET_ \| _POST_ \| _PUT_ \| _DELETE_ | the HTTP method       |

**Returns:** _Promise_<Record<string, unknown\>\>

the object returned by API

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:99

---

### delete

▸ **delete**(`params?`: _null_ \| URLParams, `method?`: _GET_ \| _POST_ \| _PUT_ \| _DELETE_): _Promise_<Record<string, unknown\>\>

delete method
Send a DELETE request to the general endpoint
Successful requests will result in a HTTP status 204

#### Parameters:

| Name      | Type                                 | Description           |
| :-------- | :----------------------------------- | :-------------------- |
| `params?` | _null_ \| URLParams                  | the url params object |
| `method?` | _GET_ \| _POST_ \| _PUT_ \| _DELETE_ | the HTTP method       |

**Returns:** _Promise_<Record<string, unknown\>\>

the object returned by API

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:135

---

### list

▸ **list**(`params?`: _null_ \| URLParams, `method?`: _GET_ \| _POST_ \| _PUT_ \| _DELETE_): _Promise_<any\>

list method
Send a GET request to the general API endpoint

#### Parameters:

| Name      | Type                                 | Description           |
| :-------- | :----------------------------------- | :-------------------- |
| `params?` | _null_ \| URLParams                  | the url params object |
| `method?` | _GET_ \| _POST_ \| _PUT_ \| _DELETE_ | the HTTP method       |

**Returns:** _Promise_<any\>

list of objects returned by API

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:126

---

### read

▸ **read**(`id`: _string_ \| _number_, `params?`: _null_ \| URLParams, `method?`: _GET_ \| _POST_ \| _PUT_ \| _DELETE_): _Promise_<any\>

read method
Send a GET request to the url for the specific object

#### Parameters:

| Name      | Type                                 | Description                  |
| :-------- | :----------------------------------- | :--------------------------- |
| `id`      | _string_ \| _number_                 | the identifier of the object |
| `params?` | _null_ \| URLParams                  | the url params object        |
| `method?` | _GET_ \| _POST_ \| _PUT_ \| _DELETE_ | the HTTP method              |

**Returns:** _Promise_<any\>

the object returned by API

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:108

---

### update

▸ **update**<T\>(`data`: T, `params?`: _null_ \| URLParams, `method?`: _GET_ \| _POST_ \| _PUT_ \| _DELETE_): _Promise_<Record<string, unknown\>\>

update method
Simply send the updated object as PUT request to the general endpoint URL
Successful requests will result in a HTTP status 200/201 response with no body

#### Type parameters:

| Name |
| :--- |
| `T`  |

#### Parameters:

| Name      | Type                                 | Description           |
| :-------- | :----------------------------------- | :-------------------- |
| `data`    | T                                    | the data to be POSTed |
| `params?` | _null_ \| URLParams                  | the url params object |
| `method?` | _GET_ \| _POST_ \| _PUT_ \| _DELETE_ | the HTTP method       |

**Returns:** _Promise_<Record<string, unknown\>\>

the object returned by API

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:118

---

### getFilterParams

▸ `Static`**getFilterParams**(`obj`: URLParams \| _Record_<string, unknown\>): _string_

converts filter params object to string

#### Parameters:

| Name  | Type                                    | Description                           |
| :---- | :-------------------------------------- | :------------------------------------ |
| `obj` | URLParams \| _Record_<string, unknown\> | the object representing filter params |

**Returns:** _string_

filter params as a string

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:83

---

### getURL

▸ `Static`**getURL**(`generalUrl`: _string_, `params`: paramsType): _string_

appends any query params to the url as a querystring

#### Parameters:

| Name         | Type       | Description           |
| :----------- | :--------- | :-------------------- |
| `generalUrl` | _string_   | the url               |
| `params`     | paramsType | the url params object |

**Returns:** _string_

the final url

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:77

---

### processAcessToken

▸ `Static`**processAcessToken**(`accessTokenCallBack`: _string_ \| GetAccessTokenType): _Promise_<string\>

process received access token

#### Parameters:

| Name                  | Type                           | Description           |
| :-------------------- | :----------------------------- | :-------------------- |
| `accessTokenCallBack` | _string_ \| GetAccessTokenType | received access token |

**Returns:** _Promise_<string\>

Inherited from: void

Defined in: packages/react-utils/node_modules/@opensrp/server-service/dist/types/serviceClass.d.ts:89
