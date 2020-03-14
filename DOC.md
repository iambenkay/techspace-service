# Vodacom Vendor Management System Documentation

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
## Upload vendor requirements from business
```js
POST /api/v1/accounts/vendor-requirements

Authorization: Bearer <token>

{
    requirements: <value>|<value>|<value> ...
}
```
value  can be any of `nin`, `nationalid`, `driverslicense`, `certofownership`, `tin`, `intlpassport`
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
## Apply to business as vendor
```js
POST /api/v1/accounts/apply-to-business

Authorization: Bearer <token>

{
    email: string
}
```
## Invite vendor to business
```js
POST /api/v1/accounts/invite-vendor

Authorization: Bearer <token>

{
    email: string
}
```
## Delisting a vendor
```js
DELETE /api/v1/accounts/vendors

Authorization: Bearer <token>

{
    email: string
}
```
## Search businesses
```js
GET /api/v1/accounts/business-search?q=<query>&by="name|email"

Authorization: Bearer <token>
```
## Search vendors
```js
GET /api/v1/accounts/vendor-search?q=<query>&by="name|email"

Authorization: Bearer <token>
```
## Search users
```js
GET /api/v1/accounts/user-search?q=<query>&by="name|email"

Authorization: Bearer <token>
```
## Get vendors for a particular business
```js
GET /api/v1/accounts/vendors

Authorization: Bearer <token>
```
## Get admins of a business
```js
GET /api/v1/accounts/admins

Authorization: Bearer <token>
```
## Delisting admins
```js
DELETE /api/v1/accounts/admins

Authorization: Bearer <token>

{
    email: string
}
```
## Read a notification
```js
POST /api/v1/notifications

Authorization: Bearer  <token>
{

}
```
## Create RFQ
```js
POST /api/v1/rfqs

Authorization: Bearer  <token>

{
	"title": "Building materials",
	"description": "I need ",
	"category": "Survey and Informatics",
	"deadline": 1581874494183,
	"location": "12345678",
	"quantity": 50
}
```
## Delete RFQ
```js
DELETE /api/v1/rfqs

Authorization: Bearer <token>

{
    id: "ck23131mkd1313425225"
}
```
## Retrieve all RFQs
```js
GET /api/v1/rfqs

Authorization: Bearer <token>
```
## Retrieve an RFQ
```js
GET /api/v1/rfqs/<id>

Authorization: Bearer <token>
```
## Get all notifications
```js
GET /api/v1/notifications

Authorization: Bearer <token>
```
## Add product to vendor inventory
```js
POST /api/v1/accounts/vendors/inventory

Authorization: Bearer <token>
{
	"name": "Cement",
	"description": "Well granulated cement for housing needs",
	"price": "34",
	"oem": "Dangote"
}
Example result:
{
  "error": false,
  "message": "Product has been succesfully added to Inventory",
  "data": {
    "id": "ck7flrq0z0000hscufyir8pzp",
    "createdAt": 1583464316291,
    "updatedAt": 1583464316291,
    "name": "Cement",
    "description": "Well granulated cement for housing needs",
    "price": "34",
    "oem": "Dangote",
    "vendorId": "ck7fli7ga0000nhcufn9b1qao"
  }
}
```
## Remove product from vendor inventory
```js
DELETE /api/v1/accounts/vendors/inventory

Authorization: Bearer <token>
{
	"productId": "ck7fm0sb600000hcu07l8httr"
}
Example result:
{
  "error": false,
  "message": "Product has been succesfully removed from Inventory"
}
```
## Fetch all products from inventory
```js
GET /api/v1/accounts/vendors/inventory

Authorization: Bearer <token>

Example result:
{
  "error": false,
  "data": [
    {
      "id": "ck7ldc43h0000m7cu50kg1ki1",
      "createdAt": 1583812948157,
      "updatedAt": 1583812948157,
      "name": "Cement",
      "description": "Well granulated cement for housing needs",
      "price": "34",
      "oem": "Dangote",
      "vendorId": "ck7g99r3j0001tqcugfj1a2o6"
    }
  ]
}
```
## Add vendor category (business)
```js
POST /api/v1/accounts/business/category

Authorization: Bearer <token>

{
	"category": "building materials"
}

Example result:
{
  "error": false,
  "message": "New category has been added"
}
```
## Remove vendor category (business)
```js
DELETE /api/v1/accounts/business/category

Authorization: Bearer <token>

Example result:
{
  "error": false,
  "products": []
}
```
## Get vendor categories (business)
```js
GET /api/v1/accounts/business/category

Authorization: Bearer <token>

Example result:
{
  "error": false,
  "categories": [
    "building materials"
  ]
}
```
## Add vendor to category
```js
POST /api/v1/accounts/business/add-vendor-to-category

Authorization: Bearer <token>

{
	"email": "cement@dangote.com",
	"category": "building materials"
}

Example result:
{
  "error": false,
  "message": "You have added the vendor cement@dangote.com to the category building materials"
}
```
## Fetch businesses tied to a vendor
```js
GET /api/v1/accounts/vendors/businesses

Authorization

Example result:
{
  "error": false,
  "businesses": [
    {
      "businessId": "ck7llx5hi0002uvcu3lta5526",
      "name": "Vodacom",
      "email": "support@voda.com",
      "userType": "business",
      "accepted": true,
      "dateJoined": null,
      "business_category": null
    }
  ]
}
```
## Fetch a business tied to a vendor
```js
GET /api/v1/accounts/vendors/businesses/<id>

Authorization

Example result:
{
  "error": false,
  "business": {
    "businessId": "ck7llx5hi0002uvcu3lta5526",
    "name": "Vodacom",
    "email": "support@voda.com",
    "userType": "business",
    "accepted": true,
    "dateJoined": null
  }
}
```
## Fetch data for business dashboard
```js
GET /api/v1/ui/business-dashboard-data

Authorization

Example Result:
{
  "error": false,
  "account": {
    "id": "ck7llx5hi0002uvcu3lta5526",
    "createdAt": 1583827366662,
    "updatedAt": 1583914216119,
    "email": "support@voda.com",
    "name": "Vodacom",
    "userType": "business",
    "phone": "+2349080450823",
    "isVerified": true,
    "lastLogin": 1583914216117
  },
  "extras": {
    "no_of_admins": 0,
    "no_of_unread_notifications": 1,
    "no_of_vendors_linked_to": 1,
    "no_of_rfqs": 0
  }
}
```
