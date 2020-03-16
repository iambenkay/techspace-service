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
	"title": "Cement",
	"description": "benjamin cement is a boy",
	"service_category": "Industry and Housing",
	"deadline": 33323823893,
	"location": "Nigeria",
	"quantity": 50
}

Example result:
{
  "error": false,
  "id": "ck7ullvkt0000lqcu0rb9593y",
  "createdAt": 1584371036189,
  "updatedAt": 1584371036189,
  "title": "Cement",
  "deadline": 33323823893,
  "description": "benjamin cement is a boy",
  "service_category": "Industry and Housing",
  "location": "Nigeria",
  "quantity": 50,
  "initiator": "ck7uj5f5400004wcu2rqmcgke"
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

{
	"category": "building materials"
}

Example result:
{
  "error": false,
  "message": "Category has been removed"
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
## Remove vendor from category
```js
POST /api/v1/accounts/business/remove-vendor-from-category

Authorization: Bearer <token>

{
	"email": "benjamincath@gmail.com",
	"category": "building materials"
}

Example result:
{
  "error": false,
  "message": "You have removed the vendor benjamincath@gmail.com from the category building materials"
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
## Fetch requirements
```js
GET /api/v1/accounts/requirements

Authorization

Example result:
{
  "error": false,
  "requirements": [
    "ID Card"
  ]
}
```
## Set requirements
```js
POST /api/v1/accounts/requirements

Authorization

{
	"requirement": "Identification Document"
}

Example result:
{
  "error": false,
  "message": "Requirement has been set"
}
```
## Update requirements
```js
PUT /api/v1/accounts/requirements

Authorization

{
	"new_requirement": "ID Card",
	"old_requirement": "Identification Document"
}

Example result:
{
  "error": false,
  "message": "Requirement has been updated"
}
```
## Delete requirements
```js
DELETE /api/v1/accounts/requirements
Authorization

{
	"requirement": "ID Card"
}

Example result:
{
  "error": false,
  "message": "Requirement has been removed"
}
```
## Fetch data for vendor dashboard
```js
GET /api/v1/ui/vendor-dashboard-data

Authorization

Example Result:
{
  "error": false,
  "account": {
    "name": "Dangote Inc.",
    "email": "cement@dangote.com"
  },
  "extras": {
    "no_of_businesses_tied_to": 0,
    "no_of_unread_notifications": 4
  }
}
```
## Explore existing RFQs (vendor)
```js
GET /api/v1/rfqs/explore

Authorization

Example result:
{
  "error": false,
  "data": []
}
```
## Get business details
```js
GET /api/v1/details/business/<id>

Authorization

Example result:

{
  "error": false,
  "business": {
    "id": "ck7uj5f5400004wcu2rqmcgke",
    "name": "Vodacom",
    "email": "support@voda.com",
    "userType": "business",
    "phone": "+2349080450821",
    "location": "Nigeria"
  }
}
```
## Get vendor details
```js
GET /api/v1/details/vendor/<id>

Authorization

Example result:

{
  "error": false,
  "vendor": {
    "id": "ck7uj7xlq00014wcu2z17a94e",
    "name": "Dangote Inc.",
    "email": "cement@dangote.com",
    "userType": "vendor",
    "phone": "+2349080450822",
    "service_category": "Industry and Housing",
    "service_location": "Nigeria"
  }
}
```
## Send quote for RFQ
```js
POST /api/v1/quotes

Authorization

{
	"price": "500000",
	"description": "The quote of the future",
	"quantity": 70,
	"rfq_id": "ck7ullvkt0000lqcu0rb9593y",
	"delivery_date": 429482938234
}

Example result:
{
  "error": false,
  "message": "Your quote has been successfully sent"
}
```
