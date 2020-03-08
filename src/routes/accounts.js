const router = require("express").Router()
const handler = require("../services/request-injector")
const { isAuthenticated, isAccountType } = require("../middleware")
const upload = require("multer")()
const register = require("../controllers/auth/register")
const account_details = require("../controllers/accounts/details")
const { create: addAdmin, destroy: delistAdmin, retrieve: getAdmins } = require("../controllers/business/admins")
const { destroy: delistVendor, retrieve: getVendors } = require("../controllers/business/vendors")
const inviteVendor = require("../controllers/business/invite")
const requirements = require("../controllers/business/requirements")
const applyToBusiness = require("../controllers/vendors/apply")
const searchBusiness = require("../controllers/search/business")
const searchUser = require("../controllers/search/user")
const searchVendor = require("../controllers/search/vendor")
const docUpload = require("../controllers/vendors/upload")
const inventory = require("../controllers/vendors/inventory")
const inventorySearch = require("../controllers/search/product")
const category = require("../controllers/business/category")

// Get Account details
router.get("/accounts", isAuthenticated, handler(account_details))

// Delist a vendor from a business
router.delete("/accounts/vendors", isAuthenticated, isAccountType("business"), handler(delistVendor))

// For vendors to apply business
router.post("/accounts/apply-to-business", isAuthenticated, isAccountType("vendor"), handler(applyToBusiness))

// For businesses to invite vendors
router.post("/accounts/invite-vendor", isAuthenticated, isAccountType("business"), handler(inviteVendor))

// For vendors to upload their certificates
router.post("/accounts/doc-upload", isAuthenticated, isAccountType("vendor"), upload.single("document"), handler(docUpload))

// Search through the list of businesses
router.get("/accounts/business-search", isAuthenticated, handler(searchBusiness))

// Search through the list of users
router.get("/accounts/user-search", isAuthenticated, handler(searchUser))

// Search through the list of vendors
router.get("/accounts/vendor-search", isAuthenticated, handler(searchVendor))

// For businesses to post what they require of vendors
router.post("/accounts/vendor-requirements", isAuthenticated, isAccountType("business"), handler(requirements))

// For businesses to remove admins
router.delete("/accounts/admins", isAuthenticated, isAccountType("business"), handler(delistAdmin))

// for businesses to add admins
router.post("/accounts/admins", isAuthenticated, isAccountType("business"), handler(addAdmin))

// for businesses to fetch vendors
router.get("/accounts/vendors", isAuthenticated, isAccountType("business"), handler(getVendors))

// for businessses to fetch admins
router.get("/accounts/admins", isAuthenticated, isAccountType("business"), handler(getAdmins))

// For creating one of business, vendor or regular accounts
router.post("/accounts", handler(register))

// For adding a product to vendor inventory
router.post("/accounts/vendors/inventory", isAuthenticated, isAccountType("vendor"), handler(inventory.add))

// For deleting a product from vendor inventory
router.delete("/accounts/vendors/inventory", isAuthenticated, isAccountType("vendor"), handler(inventory.remove))

// For fetching a list of all products by a vendor
router.get("/accounts/vendors/inventory", isAuthenticated, isAccountType("vendor"), handler(inventory.retrieveAll))

// For searching through products available
router.get("/accounts/product-search", isAuthenticated, handler(inventorySearch))

// For managing business authored vendor categories
router.post("/accounts/business/category", isAuthenticated, isAccountType("business"), handler(category.add))
router.delete("/accounts/business/category", isAuthenticated, isAccountType("business"), handler(category.remove))
router.get("/accounts/business/category", isAuthenticated, isAccountType("business"), handler(category.getCategories))

router.post("/accounts/business/add-vendor-to-category", isAuthenticated, isAccountType("business"), handler(category.addVendor))

module.exports = router