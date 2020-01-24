# Vodafone Vendor Management System Documentation

Note: Home is https://voda-api.herokuapp.com

## Register
```js
POST /api/v1/accounts

{
    email: string,
    userType: business|regular|vendor,
    password: string,
    phone: string
}
```
## Login
```js
POST /api/v1/login

{
    email: string,
    password: string
}
```
## Get account details
```js
GET /api/v1/accounts

Authorization: Bearer <token>
```
## Assign admins
```js
POST /api/v1/accounts/admins

Authorization: Bearer <token>

{
    email: string
}
```
## Upload vendor requirements
```js
POST /api/v1/accounts/vendor-requirements

Authorization: Bearer <token>

{
    requirements: nin|nationalid|driverslicense|certofownership|tin|intlpassport
}
```
## Upload vendor documents
```js
POST /api/v1/accounts/doc-upload

Authorization: Bearer <token>
Content-Type: multipart/form-data

{
    type: nin|nationalid|driverslicense|certofownership|tin|intlpassport,
    document: PDF file
}
```