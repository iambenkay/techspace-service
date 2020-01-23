# Vodafone Vendor Management System Documentation

Note: Home is https://voda-api.herokuapp.com

## Register
```js
POST /accounts

{
    email: string,
    userType: business|regular|vendor,
    password: string,
    phone: string
}
```
## Login
```js
POST /login

{
    email: string,
    password: string
}
```
## Get account details
```js
GET /accounts

Authorization: Bearer <token>
```
## Assign admins
```js
POST /accounts/admins

Authorization: Bearer <token>

{
    email: string
}
```
## Upload vendor requirements
```js
POST /accounts/vendor-requirements

Authorization: Bearer <token>

{
    requirements: nin|nationalid|driverslicense|certofownership|tin|intlpassport
}
```