module.exports = class Model {
    static ModelError = ModelError
    /**
     * 
     * @param {{}} data
     */
    constructor(data) {
        this._model = resource
        this._data = data
    }
}

class ModelError extends Error { }
