"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Expression_Types_1 = require("./Expression-Types");
var expression_analyzer_1 = require("./expression-analyzer");
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
exports.isVarParam = function (id, varTable) {
    return varTable.length == 0 ? false :
        varTable[0].name == id.name ? varTable[0].isParam :
            exports.isVarParam(id, varTable.slice(1));
};
var paramToValueTuple = function (param) {
    return ({ name: param.trim().split('=')[0].trim(), value: code_analyzer_1.parseCode(param.trim().split('=')[1].trim()).body[0].expression, isParam: true });
};
var parseParams = function (paramsTxt) {
    return paramsTxt.length > 0 ? paramsTxt.split(';').map(paramToValueTuple) : [];
};
exports.parseParams = parseParams;
var valueExpressionToValue = function (v, varTable) {
    return Expression_Types_1.isLiteral(v) ? stringToValue(v.value) :
        Expression_Types_1.isIdentifier(v) ? valueExpressionToValue(exports.getValueExpressionOfIdentifier(v, varTable), varTable) :
            Expression_Types_1.isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
                Expression_Types_1.isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
                    getValOfMemberExpression(v, varTable);
};
exports.getValueExpressionOfIdentifier = function (id, varTable) {
    return varTable.length == 0 ? null :
        varTable[0].name == id.name ? varTable[0].value :
            exports.getValueExpressionOfIdentifier(id, varTable.slice(1));
};
var getValueOfIdentifier = function (id, varTable) {
    return valueExpressionToValue(exports.getValueExpressionOfIdentifier(id, varTable), varTable);
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
        if (varTable[i].name == id.name) {
            varTable[i].value = newValue;
            return;
        }
    }
    varTable.push({ name: id.name, value: newValue, isParam: false });
};
var performUpdateOp = function (value, op) {
    return op === '++' ? value + 1 :
        value - 1;
};
var analyzedLineToValuedLine = function (expression, value, varTable) {
    return ({ analyzedLine: expression_analyzer_1.getFirstAnalyzedLine(expression, varTable), value: value });
};
var NO_LINES = [];
var closeBlockLine = {
    analyzedLine: { line: -1, type: 'BlockClosing', name: '', condition: '', value: '' },
    value: 0
};
var doWhileEndLine = function (cond, value) { return ({
    analyzedLine: { line: -1, type: 'DoWhileEnd', name: '', condition: cond, value: '' },
    value: value
}); };
var elseLine = {
    analyzedLine: { line: -1, type: "Else", name: '', condition: '', value: '' },
    value: 0
};
var copyArr = function (arr) { return JSON.parse(JSON.stringify(arr)); };
var replaceVarInValueExpression = function (id, valueExpression, varTable) {
    return Expression_Types_1.isIdentifier(valueExpression) ? (id.name == valueExpression.name ? exports.getValueExpressionOfIdentifier(valueExpression, varTable) : valueExpression) :
        Expression_Types_1.isLiteral(valueExpression) ? valueExpression :
            Expression_Types_1.isComputationExpression(valueExpression) ? replaceVarsInComputationExpression(id, valueExpression, varTable) :
                Expression_Types_1.isConditionalExpression(valueExpression) ? replaceVarsInCondtionalExpression(id, valueExpression, varTable) :
                    replaceVarInMemberExpression(id, valueExpression, varTable);
};
var replaceVarsInComputationExpression = function (id, comp, varTable) {
    return Expression_Types_1.isBinaryExpression(comp) ? Expression_Types_1.createBinaryExpression(comp.operator, replaceVarInValueExpression(id, comp.left, varTable), replaceVarInValueExpression(id, comp.right, varTable), comp.loc) :
        Expression_Types_1.createUnaryExpression(comp.operator, replaceVarInValueExpression(id, comp.argument, varTable), comp.prefix, comp.loc);
};
var replaceVarInMemberExpression = function (id, memberExpression, varTable) {
    return Expression_Types_1.createMemberExpression(memberExpression.computed, replaceVarInValueExpression(id, memberExpression.object, varTable), replaceVarInValueExpression(id, memberExpression.property, varTable), memberExpression.loc);
};
var replaceVarsInCondtionalExpression = function (id, cond, varTable) {
    return Expression_Types_1.createConditionalExpression(cond.test, cond.consequent, cond.alternate, cond.loc);
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
    return Expression_Types_1.isFunctionDeclaration(exp) ? substituteFunctionDeclaration(exp, varTable) :
        Expression_Types_1.isValueExpression(exp) ? substituteValueExpression(exp, varTable) :
            Expression_Types_1.isExpressionStatement(exp) ? substituteExpression(exp.expression, varTable) :
                Expression_Types_1.isIfStatement(exp) ? substituteIfStatement(exp, varTable) :
                    substituteLoopStatement(exp, varTable);
};
var substituteFunctionDeclaration = function (func, varTable) {
    return [analyzedLineToValuedLine(func, 0, varTable)].concat(getValuedLinesOfBody(func.body, varTable));
};
var substituteValueExpression = function (exp, varTable) {
    return Expression_Types_1.isUpdateExpression(exp) ? substituteUpdateExpression(exp, varTable) : NO_LINES;
};
var substituteUpdateExpression = function (updateExpression, varTable) {
    getValueOfUpdateExpression(updateExpression, varTable); // This will update varTable - we don't need the value
    return NO_LINES;
};
var getValuedLinesOfBody = function (body, varTable) {
    return Expression_Types_1.isBody(body) ? (Expression_Types_1.isExpression(body) ? substituteExpression(body, copyArr(varTable)) : body.body.map(getSubstituteExpFunc(copyArr(varTable))).reduce(concatValuedLines)).concat([closeBlockLine]) : [];
};
var substituteIfStatement = function (ifStatement, varTable) {
    return [analyzedLineToValuedLine(ifStatement, valueExpressionToValue(ifStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(ifStatement.consequent, varTable)).concat([elseLine]).concat(getValuedLinesOfBody(ifStatement.alternate, varTable));
};
var substituteLoopStatement = function (loopStatement, varTable) {
    return Expression_Types_1.isWhileStatement(loopStatement) ? substituteWhileStatement(loopStatement, varTable) :
        Expression_Types_1.isDoWhileStatement(loopStatement) ? substituteDoWhileStatement(loopStatement, varTable) :
            substituteForStatement(loopStatement, varTable);
};
var substituteWhileStatement = function (whileStatement, varTable) {
    return [analyzedLineToValuedLine(whileStatement, valueExpressionToValue(whileStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(whileStatement.body, varTable));
};
var substituteDoWhileStatement = function (doWhileStatement, varTable) {
    return [analyzedLineToValuedLine(doWhileStatement, valueExpressionToValue(doWhileStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(doWhileStatement.body, varTable)).concat(getDoWhileEndLine(expression_analyzer_1.getValOfValExp(doWhileStatement.test, varTable), valueExpressionToValue(doWhileStatement.test, varTable)));
};
var getDoWhileEndLine = function (cond, value) {
    return [doWhileEndLine(cond, value)];
};
var substituteForStatement = function (forStatement, varTable) {
    return [analyzedLineToValuedLine(forStatement, valueExpressionToValue(forStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(forStatement.body, varTable));
};
var substituteVariableDeclaration = function (varDeclaration, varTable) {
    for (var i = 0; i < varDeclaration.declarations.length; i++) {
        updateVarTable(varTable, varDeclaration.declarations[i].id, (varDeclaration.declarations[i].init == null ? Expression_Types_1.literalToLitExp(0) : varDeclaration.declarations[i].init));
    }
    return NO_LINES;
};
var substituteAssignmentExpression = function (assignmentExpression, varTable) {
    var left = assignmentExpression.left;
    if (Expression_Types_1.isIdentifier(left)) {
        var newValue = replaceVarInValueExpression(left, assignmentExpression.right, varTable);
        addAssignmentToVarTable(assignmentExpression.left, assignmentExpression.operator, newValue, varTable);
        if (exports.isVarParam(left, varTable)) {
            return [analyzedLineToValuedLine(assignmentExpression, valueExpressionToValue(newValue, varTable), varTable)];
        }
    }
    return NO_LINES;
};
var addAssignmentToVarTable = function (assignable, op, value, varTable) {
    if (Expression_Types_1.isIdentifier(assignable))
        updateVarTable(varTable, assignable, value);
};
var substituteReturnStatement = function (returnStatement, varTable) {
    return [analyzedLineToValuedLine(returnStatement, valueExpressionToValue(returnStatement.argument, varTable), varTable)];
};
var substituteBreakStatement = function (b, varTable) {
    return [analyzedLineToValuedLine(b, 0, varTable)];
};
var getSubstituteExpFunc = function (varTable) {
    return function (exp) {
        return substituteExpression(exp, varTable);
    };
};
var concatValuedLines = function (previous, current) { return previous.concat(current); };
var substituteProgram = function (program, varTable) {
    return program.body.length > 0 ? program.body.map(getSubstituteExpFunc(varTable)).reduce(concatValuedLines) : [];
};
exports.substituteProgram = substituteProgram;
// TODO: Should I support logical expressions?
/* TODO: should I support arrays? If so I need to:
*          * Support ArrayExpression as a value expression
*          * Somehow support array values in input vector
*          * Support arrays in value calculations: The type of all the functions will remain Value (and not Value[]) and I will force getValueOfIdentifier to return Value.
*               I will create a new function getValueOfArrayIdentifier which will return Value as well.
*/ 
