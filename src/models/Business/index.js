const { Model } = require("../model");
const _invite_admin = require("./_invite_admin")
const _invite_vendor = require("./_invite_vendor")
const _vendors = require("./_vendors")
const c = require("../../data/collections");

module.exports = class Business extends Model {
  constructor(data) {
    super(data);
  }
  get objects() {
    return this._data;
  }
  invite_admin(email){
    return _invite_admin(email, this.objects)
  }
  invite_vendor(email){
    return _invite_vendor(email, this.objects)
  }
  vendors(category){
    return _vendors(category, this.objects)
  }
};
