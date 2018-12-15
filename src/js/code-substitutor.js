"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Expression_Types_1 = require("./Expression-Types");
var code_analyzer_1 = require("./code-analyzer");
var isNumber = function (x) { return (typeof x) === "number"; };
var isString = function (x) { return (typeof x) === "string"; };
var isBoolean = function (x) { return (typeof x) === "boolean"; };
var falseLiteral = 'false';
var trueLiteral = 'true';
var isNumericString = function (x) { return !isNaN(Number(x)); };
var isBooleanString = function (x) { return x.toString().toLowerCase() === falseLiteral || x.toString().toLowerCase() === trueLiteral; };
var stringToValue = function (str) {
    return isBooleanString(str) ? str : //str === trueLiteral :
        isNumericString(str) ? Number(str) :
            str.replace(/"/g, '');
};
var paramToValueTuple = function (param) {
    return ({ name: param.trim().split('=')[0].trim(), value: code_analyzer_1.parseCode(param.trim().split('=')[1].trim()).body[0].expression });
};
var parseParams = function (paramsTxt) {
    return paramsTxt.split(',').map(paramToValueTuple);
};
exports.parseParams = parseParams;
var valueExpressionToValue = function (v, varTable) {
    return Expression_Types_1.isLiteral(v) ? stringToValue(v.value) :
        Expression_Types_1.isIdentifier(v) ? valueExpressionToValue(exports.getValueOfIdentifier(v, varTable), varTable) :
            Expression_Types_1.isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
                Expression_Types_1.isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
                    getValOfMemberExpression(v, varTable);
};
exports.valueExpressionToValue = valueExpressionToValue;
exports.getValueOfIdentifier = function (id, varTable) {
    return varTable.length == 0 ? null :
        varTable[0].name === id.name ? varTable[0].value :
            exports.getValueOfIdentifier(id, varTable.slice(1));
};
var getValueOfComputationExpression = function (comp, varTable) {
    return Expression_Types_1.isBinaryExpression(comp) ? getValueOfBinaryExpression(comp, varTable) :
        Expression_Types_1.isUnaryExpression(comp) ? getValueOfUnaryExpression(comp, varTable) :
            getValueOfUpdateExpression(comp, varTable);
};
var getValueOfConditionalExpression = function (cond, varTable) {
    return valueExpressionToValue(cond.test, varTable) ? valueExpressionToValue(cond.consequent, varTable) :
        valueExpressionToValue(cond.alternate, varTable);
};
var getValOfMemberExpression = function (memberExpression, varTable) {
    return "unsupported: array: " + memberExpression.object + "[" + memberExpression.property + "]";
};
var getValueOfBinaryExpression = function (binaryExpression, varTable) {
    return performBinaryOp(valueExpressionToValue(binaryExpression.left, varTable), valueExpressionToValue(binaryExpression.right, varTable), binaryExpression.operator);
};
var performBinaryOp = function (left, right, op) {
    return op === '+' ? performAddition(left, right) :
        //isBoolean(left) && isBoolean(right) ? performBooleanBinaryOp(left, right, op) :
        isNumber(left) && isNumber(right) && isNumericOp(op) ? performNumericBinaryOp(left, right, op) :
            performBooleanEqBinaryOp(left, right, op);
};
var performAddition = function (left, right) {
    return isString(left) ? left + right :
        isString(right) ? left + right :
            isBoolean(left) || isBoolean(right) ? "undefined operation + between booleans" :
                left + right;
};
var isNumericOp = function (op) {
    return ['-', '*', '/', '**'].indexOf(op) != -1;
};
var performBooleanEqBinaryOp = function (left, right, op) {
    return op === '>' ? left > right :
        op === '<=' ? left <= right :
            op === '<' ? left < right :
                op === '<=' ? left < right :
                    op === '==' ? left == right :
                        left === right;
};
/*const performLogicalExpression = (left: boolean, right: boolean, op: string): Value =>
    op[0] === '&' ? left && right :
    left || right;*/
var performNumericBinaryOp = function (left, right, op) {
    return op === '-' ? left - right :
        op === '*' ? left * right :
            op === '/' ? left / right :
                Math.pow(left, right);
};
var getValueOfUnaryExpression = function (unaryExpression, varTable) {
    return performUnaryOp(valueExpressionToValue(unaryExpression.argument, varTable), unaryExpression.operator);
};
var performUnaryOp = function (val, op) {
    return op === '!' ? (isBoolean(val) ? !val : "undefined operation: not on a non-boolean") :
        op === '-' ? -val :
            val;
};
var getValueOfUpdateExpression = function (updateExpression, varTable) {
    return performUpdate(updateExpression, updateExpression.argument, updateExpression.operator, updateExpression.prefix, varTable);
};
var performUpdate = function (updateExpression, assignable, op, prefix, varTable) {
    if (Expression_Types_1.isIdentifier(assignable)) {
        var oldValue = valueExpressionToValue(assignable, varTable);
        if (isNumber(oldValue)) {
            updateVarTable(varTable, assignable, { type: "BinaryExpression", operator: op[0], left: assignable, right: Expression_Types_1.literalToLitExp(1), loc: updateExpression.loc }); // Transform the update exp into a binary exp so it would not be calculated more than once
            return (prefix ? performUpdateOp(oldValue, op) : oldValue);
        }
        return "error: cannot update a non numeric value: " + oldValue;
    }
    else
        return "unsupported: array";
};
var updateVarTable = function (varTable, id, newValue) {
    for (var i = 0; i < varTable.length; i++) {
        if (varTable[i].name === id.name) {
            varTable[i].value = newValue;
            return;
        }
    }
    varTable.push({ name: id.name, value: newValue });
};
var performUpdateOp = function (value, op) {
    return op === '++' ? value + 1 :
        value - 1;
};
// TODO: implement all unimplemented functions
// TODO: Allow an empty input vector
// TODO: Should I support logical expressions?
/* TODO: should I support arrays? If so I need to:
*          * Support ArrayExpression as a value expression
*          * Somehow support array values in input vector
*          * Support arrays in value calculations: The type of all the functions will remain Value (and not Value[]) and I will force getValueOfIdentifier to return Value.
*               I will create a new function getValueOfArrayIdentifier which will return Value as well.
*/ 
