const { Model } = require("../model");
const _apply_to_business = require("./_apply_to_business");

module.exports = class Vendor extends Model {
  constructor(data) {
    super(data);
  }
  get objects() {
    return this._data;
  }
  apply_to_business(email, requirements = {}) {
    return _apply_to_business(email, requirements, this.objects);
  }
};
