const {ResponseError} = require("./")

class V {
    /**
     * 
     * @param {String} message
     * @param {String} data
     */
    static isEmail(message, data) {
        const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        V.matchesRegex(data, regex, message)
    }
    /**
     * 
     * @param {String} message
     * @param {String} data 
     * @param {RegExp} regex
     */
    static matchesRegex(message, data, regex) {
        if(!regex.test(data)){
            throw new ResponseError(400, message)
        }
    }
    /**
     * 
     * @param {String} message
     * @param {Array<*>} fields
     */
    static allExist(message, ...fields) {

        if(fields.some(x => x === null || x === undefined)){
            throw new ResponseError(400, message)
        }
    }
    /**
     * 
     * @param {String} message 
     * @param {Boolean} expression 
     */
    static expr(message, expression) {
        if(!expression){
            throw new ResponseError(400, message)
        }
    }
}

module.exports = V