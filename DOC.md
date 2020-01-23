# Vodafone Vendor Management System Documentation

Note: Home is https://vodafone-backend.herokuapp.com

## Register
```json
POST /accounts

{
    email: string,
    userType: business|regular|vendor,
    password: string,
    phone: string
}
```
## Login
```json
POST /login

{
    email: string,
    password: string
}
```
## Get account details
```json
GET /accounts

Authorization: Bearer <token>
```
## Assign admins
```json
POST /accounts/admins

Authorization: Bearer <token>

{
    email: string
}
```
## Upload vendor requirements
```json
POST /accounts/vendor-requirements

Authorization: Bearer <token>

{
    requirements: nin|nationalid|driverslicense|certofownership|tin|intlpassport
}
```