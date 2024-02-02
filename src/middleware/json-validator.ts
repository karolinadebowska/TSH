import { Validator } from "express-json-validator-middleware"

const validator = new Validator({ allErrors: true })

export default validator.validate
