module.exports.Model = class Model {
    /**
     * 
     * @param {{}} data
     */
    constructor(data) {
        this._data = data
    }
}

module.exports.ModelError = class ModelError extends Error { }
