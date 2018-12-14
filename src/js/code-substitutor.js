"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Expression_Types_1 = require("./Expression-Types");
var isNumber = function (x) { return (typeof x) === "number"; };
var isString = function (x) { return (typeof x) === "string"; };
var isBoolean = function (x) { return (typeof x) === "boolean"; };
var falseLiteral = 'false';
var trueLiteral = 'true';
var isNumericString = function (x) { return !isNaN(Number(x)); };
var isBooleanString = function (x) { return x.toLowerCase() === falseLiteral || x.toLowerCase() == trueLiteral; };
var stringToValue = function (str) {
    return isNumericString(str) ? Number(str) :
        isBooleanString(str) ? str === "true" :
            str.replace(/"/g, '');
};
var paramToValueTuple = function (param) {
    return ({ name: param.trim().split('=')[0].trim(), value: stringToValue(param.trim().split('=')[1].trim()) });
};
var parseParams = function (paramsTxt) {
    return paramsTxt.split(',').map(paramToValueTuple);
};
var valueExpressionToValue = function (v, varTable) {
    return Expression_Types_1.isLiteral(v) ? stringToValue(v.value) :
        Expression_Types_1.isIdentifier(v) ? getValueOfIdentifier(v, varTable) :
            Expression_Types_1.isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
                Expression_Types_1.isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
                    getValOfMemberExpression(v, varTable);
};
var getValueOfIdentifier = function (id, varTable) {
    return varTable.length == 0 ? "" :
        varTable[0].name === id.name ? varTable[0].value :
            getValueOfIdentifier(id, varTable.slice(1));
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
    return "unsupported: array";
};
var getValueOfBinaryExpression = function (binaryExpression, varTable) {
    return performBinaryOp(valueExpressionToValue(binaryExpression.left, varTable), valueExpressionToValue(binaryExpression.right, varTable), binaryExpression.operator);
};
var performBinaryOp = function (left, right, op) {
    return op === '+' ? performAddition(left, right) :
        isNumber(left) && isNumber(right) && isNumericOp(op) ? performNumericBinaryOp(left, right, op) :
            performBooleanBinaryOp(left, right, op);
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
var performBooleanBinaryOp = function (left, right, op) {
    return op === '>' ? left > right :
        op === '<=' ? left <= right :
            op === '<' ? left < right :
                op === '<=' ? left < right :
                    op === '==' ? left == right :
                        left === right;
};
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
    return performUpdate(updateExpression.argument, updateExpression.operator, updateExpression.prefix, varTable);
};
var performUpdate = function (assignable, op, prefix, varTable) {
    if (Expression_Types_1.isIdentifier(assignable)) {
        var oldValue = valueExpressionToValue(assignable, varTable);
        if (isNumber(oldValue)) {
            if (prefix)
                updateVarTable(varTable, assignable, performUpdateOp(oldValue, op));
            var returnValue = getValueOfIdentifier(assignable, varTable);
            if (!prefix)
                updateVarTable(varTable, assignable, performUpdateOp(oldValue, op));
            return returnValue;
        }
        return "error: cannot update a non numeric value: " + oldValue;
    }
    else
        return "unsupported: array";
};
var updateVarTable = function (varTable, id, newValue) {
    for (var i = 0; i < varTable.length; i++) {
        if (varTable[i].name === id.name)
            varTable[i].value = newValue;
    }
};
var performUpdateOp = function (value, op) {
    return op === '++' ? value + 1 :
        value - 1;
};
var substituteExpression = function (exp, varTable) {
    return Expression_Types_1.isAtomicExpression(exp) ? substituteAtomicExpression(exp, varTable) :
        substituteCompoundExpression(exp, varTable);
};
var substituteAtomicExpression = function (exp, varTable) {
    return Expression_Types_1.isVariableDeclaration(exp) ? substituteVariableDeclaration(exp, varTable) :
        Expression_Types_1.isAssignmentExpression(exp) ? substituteAssignmentExpression(exp, varTable) :
            Expression_Types_1.isReturnStatement(exp) ? substituteReturnStatement(exp, varTable) :
                substituteBreakStatement(exp, varTable);
};
var substituteCompoundExpression = function (exp, varTable) {
    return Expression_Types_1.isValueExpression(exp) ? substituteValueExpression(exp, varTable) :
        Expression_Types_1.isExpressionStatement(exp) ? substituteExpression(exp.expression, varTable) :
            Expression_Types_1.isLoopStatement(exp) ? substituteLoopStatement(exp, varTable) :
                substituteIfStatement(exp, varTable);
};
var substituteValueExpression = function (exp, varTable) {
    return Expression_Types_1.isLiteral(exp) ? exp :
        Expression_Types_1.isIdentifier(exp) ? substituteIdentifier(exp, varTable) :
            Expression_Types_1.isComputationExpression(exp) ? substituteComputationExpression(exp, varTable) :
                Expression_Types_1.isConditionalExpression(exp) ? substituteConditionalExpression(exp, varTable) :
                    substituteMemberExpression(exp, varTable);
};
var substituteLoopStatement = function (loopStatement, varTable) {
    return Expression_Types_1.isWhileStatement(loopStatement) ? substituteWhileStatement(loopStatement, varTable) :
        Expression_Types_1.isDoWhileStatement(loopStatement) ? substituteDoWhileStatement(loopStatement, varTable) :
            substituteForStatement(loopStatement, varTable);
};
var getSubstituteExpFunc = function (varTable) {
    return function (exp) {
        return substituteExpression(exp, varTable);
    };
};
var substituteProgram = function (program, varTable) {
    return ({ type: "Program", body: program.body.map(getSubstituteExpFunc(varTable)) });
};
// TODO: implement all unimplemented functions
/* TODO: should I support arrays? If so I need to:
*          * Support ArrayExpression as a value expression
*          * Somehow support array values in input vector
*          * Support arrays in value calculations
*/ 
