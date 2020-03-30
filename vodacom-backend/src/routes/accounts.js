const router = require("express").Router();
const handler = require("../services/request-injector");
const {
  isAuthenticated,
  isAccountType,
  mustHaveRequirement
} = require("../middleware");
const upload = require("multer")();
const register = require("../controllers/auth/register");
const account_details = require("../controllers/accounts/details");
const {
  create: addAdmin,
  destroy: delistAdmin,
  retrieve: getAdmins
} = require("../controllers/business/admins");
const {
  destroy: delistVendor,
  retrieve: getVendors
} = require("../controllers/business/vendors");
const inviteVendor = require("../controllers/business/invite");
const user = require("../controllers/user");
const applyToBusiness = require("../controllers/vendors/apply");
const searchBusiness = require("../controllers/search/business");
const searchUser = require("../controllers/search/user");
const search = require("../controllers/search");
const searchVendor = require("../controllers/search/vendor");
const docUpload = require("../controllers/vendors/upload");
const inventory = require("../controllers/vendors/inventory");
const inventorySearch = require("../controllers/search/product");
const category = require("../controllers/business/category");
const approve = require("../controllers/business/approveVendor");
const vendorBusiness = require("../controllers/vendors/business");
const requirements = require("../controllers/business/requirements");
const fulfill = require("../controllers/vendors/fulfill-requirements");
const rate = require("../controllers/business/rate");

router.post(
  "/accounts/business/rate",
  isAuthenticated,
  isAccountType("business"),
  handler(rate)
);

// Get Account details
router.get("/accounts", isAuthenticated, handler(account_details));

// Delist a vendor from a business
router.delete(
  "/accounts/vendors",
  isAuthenticated,
  isAccountType("business"),
  handler(delistVendor)
);

router.post(
  "/accounts/business/approve",
  isAuthenticated,
  isAccountType("business"),
  handler(approve)
);
// For vendors to apply business
router.post(
  "/accounts/apply-to-business",
  isAuthenticated,
  isAccountType("vendor"),
  handler(applyToBusiness)
);

// For businesses to invite vendors
router.post(
  "/accounts/invite-vendor",
  isAuthenticated,
  isAccountType("business"),
  mustHaveRequirement,
  handler(inviteVendor)
);

// For vendors to upload their certificates
router.post(
  "/accounts/doc-upload",
  isAuthenticated,
  isAccountType("vendor"),
  upload.single("document"),
  handler(docUpload)
);
router.post(
  "/accounts/upload-avatar",
  isAuthenticated,
  // upload.single("image"),
  handler(user.uploadImage)
);

router.get("/search", isAuthenticated, handler(search));

// Search through the list of businesses
router.get(
  "/accounts/business-search",
  isAuthenticated,
  handler(searchBusiness)
);

// Search through the list of users
router.get("/accounts/user-search", isAuthenticated, handler(searchUser));

// For searching through products available
router.get(
  "/accounts/product-search",
  isAuthenticated,
  handler(inventorySearch)
);

// Search through the list of vendors
router.get("/accounts/vendor-search", handler(searchVendor));

// For businesses to remove admins
router.delete(
  "/accounts/admins",
  isAuthenticated,
  isAccountType("business"),
  handler(delistAdmin)
);

// for businesses to add admins
router.post(
  "/accounts/admins",
  isAuthenticated,
  isAccountType("business"),
  handler(addAdmin)
);

// for businesses to fetch vendors
router.get(
  "/accounts/vendors",
  isAuthenticated,
  isAccountType("business"),
  handler(getVendors)
);

// for businessses to fetch admins
router.get(
  "/accounts/admins",
  isAuthenticated,
  isAccountType("business"),
  handler(getAdmins)
);

// For creating one of business, vendor or regular accounts
router.post("/accounts", handler(register));

// For adding a product to vendor inventory
router.post(
  "/accounts/vendors/inventory",
  isAuthenticated,
  isAccountType("vendor"),
  handler(inventory.add)
);

// For deleting a product from vendor inventory
router.delete(
  "/accounts/vendors/inventory",
  isAuthenticated,
  isAccountType("vendor"),
  handler(inventory.remove)
);

// For fetching a list of all products by a vendor
router.get(
  "/accounts/vendors/inventory",
  isAuthenticated,
  handler(inventory.retrieveAll)
);

// For managing business authored vendor categories
router.post(
  "/accounts/business/category",
  isAuthenticated,
  isAccountType("business"),
  handler(category.add)
);
router.delete(
  "/accounts/business/category",
  isAuthenticated,
  isAccountType("business"),
  handler(category.remove)
);
router.get(
  "/accounts/business/category",
  isAuthenticated,
  isAccountType("business"),
  handler(category.getCategories)
);

router.post(
  "/accounts/business/add-vendor-to-category",
  isAuthenticated,
  isAccountType("business"),
  handler(category.addVendor)
);
router.post(
  "/accounts/business/remove-vendor-from-category",
  isAuthenticated,
  isAccountType("business"),
  handler(category.removeVendor)
);

router.get(
  "/accounts/vendors/businesses",
  isAuthenticated,
  isAccountType("vendor"),
  handler(vendorBusiness.retrieveAll)
);
router.get(
  "/accounts/vendors/businesses/:id",
  isAuthenticated,
  isAccountType("vendor"),
  handler(vendorBusiness.retrieve)
);

// For managing requirements
router.post(
  "/accounts/requirements",
  isAuthenticated,
  isAccountType("business"),
  handler(requirements.set)
);
router.put(
  "/accounts/requirements",
  isAuthenticated,
  isAccountType("business"),
  handler(requirements.edit)
);
router.get(
  "/accounts/requirements",
  isAuthenticated,
  isAccountType("business", "vendor"),
  handler(requirements.get)
);
router.delete(
  "/accounts/requirements",
  isAuthenticated,
  isAccountType("business"),
  handler(requirements.remove)
);

router.post(
  "/vendors/fulfill-requirements",
  isAuthenticated,
  isAccountType("vendor"),
  upload.single("document"),
  handler(fulfill.set)
);
router.get(
  "/see-fulfillments",
  isAuthenticated,
  isAccountType("vendor", "business"),
  handler(fulfill.get)
);
router.post(
  "/fulfillments/approve",
  isAuthenticated,
  isAccountType("business"),
  handler(fulfill.approve)
);
router.post(
  "/fulfillments/reject",
  isAuthenticated,
  isAccountType("business"),
  handler(fulfill.reject)
);

module.exports = router;
