[@opensrp/react-utils](README.md) / Exports

# @opensrp/react-utils

## Table of contents

### Namespaces

- [BrokenPage](modules/brokenpage.md)
- [ExtraLinks](modules/extralinks.md)
- [Resource404](modules/resource404.md)
- [SearchForm](modules/searchform.md)
- [UnauthorizedPage](modules/unauthorizedpage.md)

### Classes

- [OpenSRPService](classes/opensrpservice.md)

### Interfaces

- [BrokenPageProps](interfaces/brokenpageprops.md)
- [SearchFormProps](interfaces/searchformprops.md)
- [UnauthorizedPageProps](interfaces/unauthorizedpageprops.md)
- [UtilPageExtraProps](interfaces/utilpageextraprops.md)

### Type aliases

- [OnChangeType](modules.md#onchangetype)

### Variables

- [BrokenPage](modules.md#brokenpage)
- [DEBOUNCE_HANDLER_MS](modules.md#debounce_handler_ms)
- [ExtraLinks](modules.md#extralinks)
- [Resource404](modules.md#resource404)
- [SearchForm](modules.md#searchform)
- [UnauthorizedPage](modules.md#unauthorizedpage)
- [defaultProps](modules.md#defaultprops)
- [defaultSearchProps](modules.md#defaultsearchprops)
- [extraLinksDefault](modules.md#extralinksdefault)

### Functions

- [PrivateComponent](modules.md#privatecomponent)
- [PublicComponent](modules.md#publiccomponent)
- [createChangeHandler](modules.md#createchangehandler)
- [fetchProtectedImage](modules.md#fetchprotectedimage)
- [getQueryParams](modules.md#getqueryparams)
- [handleSessionOrTokenExpiry](modules.md#handlesessionortokenexpiry)
- [isAuthorized](modules.md#isauthorized)
- [useHandleBrokenPage](modules.md#usehandlebrokenpage)
- [useHandleUnauthorizedPage](modules.md#usehandleunauthorizedpage)

## Type aliases

### OnChangeType

Ƭ **OnChangeType**: (`event`: _ChangeEvent_<HTMLInputElement\>) => _void_

function type for custom onChangeHandler functions

#### Type declaration:

▸ (`event`: _ChangeEvent_<HTMLInputElement\>): _void_

#### Parameters:

| Name    | Type                             |
| :------ | :------------------------------- |
| `event` | _ChangeEvent_<HTMLInputElement\> |

**Returns:** _void_

Defined in: [packages/react-utils/src/components/Search/utils.tsx:18](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/utils.tsx#L18)

## Variables

### BrokenPage

• `Const` **BrokenPage**: (`props`: [_BrokenPageProps_](interfaces/brokenpageprops.md)) => _Element_

the component that renders a 500 view

#### Type declaration:

▸ (`props`: [_BrokenPageProps_](interfaces/brokenpageprops.md)): _Element_

the component that renders a 500 view

#### Parameters:

| Name    | Type                                               |
| :------ | :------------------------------------------------- |
| `props` | [_BrokenPageProps_](interfaces/brokenpageprops.md) |

**Returns:** _Element_

Defined in: [packages/react-utils/src/components/BrokenPage/index.tsx:24](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/BrokenPage/index.tsx#L24)

| Name                        | Type     |
| :-------------------------- | :------- |
| `defaultProps`              | _object_ |
| `defaultProps.errorMessage` | _string_ |
| `defaultProps.homeUrl`      | _string_ |
| `defaultProps.title`        | _string_ |

Defined in: [packages/react-utils/src/components/BrokenPage/index.tsx:24](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/BrokenPage/index.tsx#L24)

---

### DEBOUNCE_HANDLER_MS

• `Const` **DEBOUNCE_HANDLER_MS**: _1000_= 1000

call handler function after this many milliseconds since when it was last invoked

Defined in: [packages/react-utils/src/components/Search/utils.tsx:7](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/utils.tsx#L7)

---

### ExtraLinks

• `Const` **ExtraLinks**: (`props`: [_UtilPageExtraProps_](interfaces/utilpageextraprops.md)) => _Element_

util component that is used in several other util-views that serve
as notification views

#### Type declaration:

▸ (`props`: [_UtilPageExtraProps_](interfaces/utilpageextraprops.md)): _Element_

util component that is used in several other util-views that serve
as notification views

#### Parameters:

| Name    | Type                                                     |
| :------ | :------------------------------------------------------- |
| `props` | [_UtilPageExtraProps_](interfaces/utilpageextraprops.md) |

**Returns:** _Element_

Defined in: [packages/react-utils/src/components/UtilPageExtra/index.tsx:21](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/UtilPageExtra/index.tsx#L21)

| Name                   | Type     |
| :--------------------- | :------- |
| `defaultProps`         | _object_ |
| `defaultProps.homeUrl` | _string_ |

Defined in: [packages/react-utils/src/components/UtilPageExtra/index.tsx:21](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/UtilPageExtra/index.tsx#L21)

---

### Resource404

• `Const` **Resource404**: (`props`: Resource404Props) => _Element_

component shown when a requested resource is not found;
the more canonical 404 component, is shown when a page is not yet bound
to the routing system, this component is to be used within an existing page
but where one or more resources to be shown on that page are deemed missing.

#### Type declaration:

▸ (`props`: Resource404Props): _Element_

component shown when a requested resource is not found;
the more canonical 404 component, is shown when a page is not yet bound
to the routing system, this component is to be used within an existing page
but where one or more resources to be shown on that page are deemed missing.

#### Parameters:

| Name    | Type             |
| :------ | :--------------- |
| `props` | Resource404Props |

**Returns:** _Element_

Defined in: [packages/react-utils/src/components/Resource404/index.tsx:24](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Resource404/index.tsx#L24)

| Name                        | Type     |
| :-------------------------- | :------- |
| `defaultProps`              | _object_ |
| `defaultProps.errorMessage` | _string_ |
| `defaultProps.homeUrl`      | _string_ |
| `defaultProps.title`        | _string_ |

Defined in: [packages/react-utils/src/components/Resource404/index.tsx:24](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Resource404/index.tsx#L24)

---

### SearchForm

• `Const` **SearchForm**: (`props`: [_SearchFormProps_](interfaces/searchformprops.md)) => _Element_

Base SearchForm component

**`param`** the component's props

#### Type declaration:

▸ (`props`: [_SearchFormProps_](interfaces/searchformprops.md)): _Element_

Base SearchForm component

#### Parameters:

| Name    | Type                                               | Description           |
| :------ | :------------------------------------------------- | :-------------------- |
| `props` | [_SearchFormProps_](interfaces/searchformprops.md) | the component's props |

**Returns:** _Element_

Defined in: [packages/react-utils/src/components/Search/index.tsx:35](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/index.tsx#L35)

| Name           | Type                                               |
| :------------- | :------------------------------------------------- |
| `defaultProps` | [_SearchFormProps_](interfaces/searchformprops.md) |

Defined in: [packages/react-utils/src/components/Search/index.tsx:35](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/index.tsx#L35)

---

### UnauthorizedPage

• `Const` **UnauthorizedPage**: (`props`: [_UnauthorizedPageProps_](interfaces/unauthorizedpageprops.md)) => _Element_

the component that renders a 500 view

#### Type declaration:

▸ (`props`: [_UnauthorizedPageProps_](interfaces/unauthorizedpageprops.md)): _Element_

the component that renders a 500 view

#### Parameters:

| Name    | Type                                                           |
| :------ | :------------------------------------------------------------- |
| `props` | [_UnauthorizedPageProps_](interfaces/unauthorizedpageprops.md) |

**Returns:** _Element_

Defined in: [packages/react-utils/src/components/UnauthorizedPage/index.tsx:21](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/UnauthorizedPage/index.tsx#L21)

| Name                        | Type     |
| :-------------------------- | :------- |
| `defaultProps`              | _object_ |
| `defaultProps.errorMessage` | _string_ |
| `defaultProps.homeUrl`      | _string_ |
| `defaultProps.title`        | _string_ |

Defined in: [packages/react-utils/src/components/UnauthorizedPage/index.tsx:21](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/UnauthorizedPage/index.tsx#L21)

---

### defaultProps

• `Const` **defaultProps**: _object_

#### Type declaration:

| Name           | Type     |
| :------------- | :------- |
| `errorMessage` | _string_ |
| `homeUrl`      | _string_ |
| `title`        | _string_ |

Defined in: [packages/react-utils/src/components/BrokenPage/index.tsx:16](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/BrokenPage/index.tsx#L16)

---

### defaultSearchProps

• `Const` **defaultSearchProps**: [_SearchFormProps_](interfaces/searchformprops.md)

default props for SearchForm component

Defined in: [packages/react-utils/src/components/Search/index.tsx:21](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/index.tsx#L21)

---

### extraLinksDefault

• `Const` **extraLinksDefault**: _object_

#### Type declaration:

| Name      | Type     |
| :-------- | :------- |
| `homeUrl` | _string_ |

Defined in: [packages/react-utils/src/components/UtilPageExtra/index.tsx:13](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/UtilPageExtra/index.tsx#L13)

## Functions

### PrivateComponent

▸ `Const`**PrivateComponent**(`props`: _ComponentProps_): _Element_

Util wrapper around ConnectedPrivateRoute to render components
that use private routes/ require authentication

#### Parameters:

| Name    | Type             | Description            |
| :------ | :--------------- | :--------------------- |
| `props` | _ComponentProps_ | Component props object |

**Returns:** _Element_

Defined in: [packages/react-utils/src/helpers/componentUtils.tsx:30](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/helpers/componentUtils.tsx#L30)

---

### PublicComponent

▸ `Const`**PublicComponent**(`__namedParameters`: _Partial_<ComponentProps\>): _Element_

Util wrapper around Route for rendering components
that use public routes/ dont require authentication

#### Parameters:

| Name                | Type                       |
| :------------------ | :------------------------- |
| `__namedParameters` | _Partial_<ComponentProps\> |

**Returns:** _Element_

Defined in: [packages/react-utils/src/helpers/componentUtils.tsx:53](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/helpers/componentUtils.tsx#L53)

---

### createChangeHandler

▸ `Const`**createChangeHandler**<T\>(`queryParam`: _string_, `props`: T): _function_

A callback helper to add filter text to url

#### Type parameters:

| Name | Type                                                  |
| :--- | :---------------------------------------------------- |
| `T`  | _RouteComponentProps_<{}, StaticContext, unknown, T\> |

#### Parameters:

| Name         | Type     | Description                                                     |
| :----------- | :------- | :-------------------------------------------------------------- |
| `queryParam` | _string_ | the string to be used as the key when constructing searchParams |
| `props`      | T        | the component props; should include RouteComponentProps         |

**Returns:** (`event`: _ChangeEvent_<HTMLInputElement\>) => _void_

Defined in: [packages/react-utils/src/components/Search/utils.tsx:25](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/utils.tsx#L25)

---

### fetchProtectedImage

▸ `Const`**fetchProtectedImage**(`imageURL`: _string_): _Promise_<_null_ \| string\>

Fetch an image that requires authentication and returns an
object URL from URL.createObjectURL

#### Parameters:

| Name       | Type     | Description          |
| :--------- | :------- | :------------------- |
| `imageURL` | _string_ | the image source url |

**Returns:** _Promise_<_null_ \| string\>

Defined in: [packages/react-utils/src/helpers/dataLoaders.ts:56](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/helpers/dataLoaders.ts#L56)

---

### getQueryParams

▸ `Const`**getQueryParams**(`location`: _Location_<unknown\>): _ParsedUrlQuery_

Get query params from URL

#### Parameters:

| Name       | Type                 | Description |
| :--------- | :------------------- | :---------- |
| `location` | _Location_<unknown\> | from props  |

**Returns:** _ParsedUrlQuery_

Defined in: [packages/react-utils/src/components/Search/utils.tsx:13](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/Search/utils.tsx#L13)

---

### handleSessionOrTokenExpiry

▸ `Const`**handleSessionOrTokenExpiry**(): _Promise_<any\>

gets access token or redirects to login if session is expired

**Returns:** _Promise_<any\>

Defined in: [packages/react-utils/src/helpers/dataLoaders.ts:36](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/helpers/dataLoaders.ts#L36)

---

### isAuthorized

▸ `Const`**isAuthorized**(`roles`: _string_[], `activeRoles`: _string_[]): _boolean_

Util function to check if user is authorized to access a particular page

#### Parameters:

| Name          | Type       | Description                                    |
| :------------ | :--------- | :--------------------------------------------- |
| `roles`       | _string_[] | list of all user roles from keycloak           |
| `activeRoles` | _string_[] | list of roles required to access a module/page |

**Returns:** _boolean_

Defined in: [packages/react-utils/src/helpers/componentUtils.tsx:62](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/helpers/componentUtils.tsx#L62)

---

### useHandleBrokenPage

▸ `Const`**useHandleBrokenPage**(): _object_

custom hook that abstracts behavior of a broken page

**Returns:** _object_

| Name               | Type                       |
| :----------------- | :------------------------- |
| `broken`           | _boolean_                  |
| `errorMessage`     | _undefined_ \| _string_    |
| `handleBrokenPage` | (`error`: Error) => _void_ |

Defined in: [packages/react-utils/src/components/BrokenPage/index.tsx:45](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/BrokenPage/index.tsx#L45)

---

### useHandleUnauthorizedPage

▸ `Const`**useHandleUnauthorizedPage**(): _object_

custom hook that abstracts behavior of an unauthorized page

**Returns:** _object_

| Name                     | Type                       |
| :----------------------- | :------------------------- |
| `errorMessage`           | _undefined_ \| _string_    |
| `handleUnauthorizedPage` | (`error`: Error) => _void_ |
| `unauthorized`           | _boolean_                  |

Defined in: [packages/react-utils/src/components/UnauthorizedPage/index.tsx:42](https://github.com/OpenSRP/web/blob/c835e97a/packages/react-utils/src/components/UnauthorizedPage/index.tsx#L42)
