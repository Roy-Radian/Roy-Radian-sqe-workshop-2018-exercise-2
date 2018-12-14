"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var falseLiteral = 'false';
var trueLiteral = 'true';
var isNumericString = function (x) { return !isNaN(Number(x)); };
var isBooleanString = function (x) { return x.toLowerCase() === falseLiteral || x.toLowerCase() == trueLiteral; };
var stringToValue = function (str) {
    return isNumericString(str) ? Number(str) :
        isBooleanString(str) ? Boolean(str) :
            str;
};
var paramToValueTuple = function (param) {
    return [param.trim().split('=')[0], stringToValue(param.trim().split('=')[1])];
};
var parseParams = function (paramsTxt) {
    return paramsTxt.split(',').map(paramToValueTuple);
};
/*const valueExpressionToValue = (v: ValueExpression, constTable: [string, Value]): Value =>
    isLiteral(v) ? stringToValue(v.value) :
    isIdentifier(v) ? getValueOfIdentifier(v.name, constTable) :
    isBinaryExpression(v) ? getValueOfBinaryExpression(v.name, constTable)*/ 
