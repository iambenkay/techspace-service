const router = require("express").Router()
const { handler } = require("../utils")
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

module.exports = router