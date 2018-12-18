"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Expression_Types_1 = require("./Expression-Types");
var expression_analyzer_1 = require("./expression-analyzer");
var code_analyzer_1 = require("./code-analyzer");
;
var isNumber = function (x) { return (typeof x) === "number"; };
var isString = function (x) { return (typeof x) === "string"; };
var isBoolean = function (x) { return (typeof x) === "boolean"; };
var isArray = function (x) { return x instanceof Array; };
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
    return Expression_Types_1.isLiteral(v) ? getValueOfLiteral(v, varTable) :
        Expression_Types_1.isIdentifier(v) ? valueExpressionToValue(exports.getValueExpressionOfIdentifier(v, varTable), varTable) :
            Expression_Types_1.isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
                Expression_Types_1.isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
                    getValOfMemberExpression(v, varTable);
};
var getValueOfLiteral = function (literal, varTable) {
    return Expression_Types_1.isAtomicLiteral(literal) ? literal.value :
        getValueOfArrayExpression(literal, varTable);
};
var getValueOfArrayExpression = function (arr, varTable) {
    return arr.elements.length > 0 ? arr.elements.map(function (v) { return valueExpressionToValue(v, varTable); }) :
        [];
};
exports.getValueExpressionOfIdentifier = function (id, varTable) {
    return varTable.length == 0 ? null :
        varTable[0].name == id.name ? varTable[0].value :
            exports.getValueExpressionOfIdentifier(id, varTable.slice(1));
};
var getValueOfComputationExpression = function (comp, varTable) {
    return Expression_Types_1.isBinaryExpression(comp) ? getValueOfBinaryExpression(comp, varTable) :
        Expression_Types_1.isLogicalExpression(comp) ? getValueOfLogicalExpression(comp, varTable) :
            Expression_Types_1.isUnaryExpression(comp) ? getValueOfUnaryExpression(comp, varTable) :
                getValueOfUpdateExpression(comp, varTable);
};
var getValueOfConditionalExpression = function (cond, varTable) {
    return valueExpressionToValue(cond.test, varTable) ? valueExpressionToValue(cond.consequent, varTable) :
        valueExpressionToValue(cond.alternate, varTable);
};
var getValOfMemberExpression = function (memberExpression, varTable) {
    return computeMemberExpression(memberExpression.object, valueExpressionToValue(memberExpression.property, varTable), varTable);
};
var computeMemberExpression = function (obj, property, varTable) {
    return isNumber(property) ? (Expression_Types_1.isArrayExpression(obj) ? valueExpressionToValue(obj.elements[property], varTable) : getValueOfArrIdentifier(obj, property, varTable)) :
        "error: no property " + property + " in array";
};
var getValueOfArrIdentifier = function (obj, property, varTable) {
    return getElementOfArr(exports.getValueExpressionOfIdentifier(obj, varTable), property, varTable);
};
var getElementOfArr = function (arr, index, varTable) {
    return Expression_Types_1.isArrayExpression(arr) ? valueExpressionToValue(arr.elements[index], varTable) :
        Expression_Types_1.isIdentifier(arr) ? getValueOfArrIdentifier(arr, index, varTable) :
            "error: not an array";
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
    return isArray(left) || isArray(right) ? "Undefined operation on arrays" :
        isString(left) ? left + right :
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
var performNumericBinaryOp = function (left, right, op) {
    return op === '-' ? left - right :
        op === '*' ? left * right :
            op === '/' ? left / right :
                Math.pow(left, right);
};
var getValueOfLogicalExpression = function (logicalExpression, varTable) {
    return computeLogicalOperation(valueExpressionToValue(logicalExpression.left, varTable), valueExpressionToValue(logicalExpression.right, varTable), logicalExpression.operator);
};
var computeLogicalOperation = function (left, right, op) {
    return isBoolean(left) && isBoolean(right) ? performLogicalOperation(left, right, op) :
        "error: " + op + " is undefined on non-booleans";
};
var performLogicalOperation = function (left, right, op) {
    return op[0] === '&' ? left && right :
        left || right;
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
            updateVarTable(varTable, assignable, Expression_Types_1.createBinaryExpression(op[0], replaceVarInIdentifier(assignable, assignable, varTable), Expression_Types_1.createAtomicLiteralExpression(1), updateExpression.loc)); // Transform the update exp into a binary exp so it would not be calculated more than once
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
    return Expression_Types_1.isIdentifier(valueExpression) ? replaceVarInIdentifier(id, valueExpression, varTable) :
        Expression_Types_1.isLiteral(valueExpression) ? valueExpression :
            Expression_Types_1.isComputationExpression(valueExpression) ? replaceVarsInComputationExpression(id, valueExpression, varTable) :
                Expression_Types_1.isConditionalExpression(valueExpression) ? replaceVarsInConditionalExpression(id, valueExpression, varTable) :
                    replaceVarInMemberExpression(id, valueExpression, varTable);
};
var replaceVarInIdentifier = function (id, replaceIn, varTable) {
    return id.name == replaceIn.name ? exports.getValueExpressionOfIdentifier(replaceIn, varTable) : replaceIn;
};
var replaceVarsInComputationExpression = function (id, comp, varTable) {
    return Expression_Types_1.isBinaryExpression(comp) ? Expression_Types_1.createBinaryExpression(comp.operator, replaceVarInValueExpression(id, comp.left, varTable), replaceVarInValueExpression(id, comp.right, varTable), comp.loc) :
        Expression_Types_1.isLogicalExpression(comp) ? Expression_Types_1.createLogicalExpression(comp.operator, replaceVarInValueExpression(id, comp.left, varTable), replaceVarInValueExpression(id, comp.right, varTable), comp.loc) :
            Expression_Types_1.createUnaryExpression(comp.operator, replaceVarInValueExpression(id, comp.argument, varTable), comp.prefix, comp.loc);
};
var replaceVarInMemberExpression = function (id, memberExpression, varTable) {
    return Expression_Types_1.createMemberExpression(memberExpression.computed, replaceVarInMemberObject(id, memberExpression.object, varTable), replaceVarInValueExpression(id, memberExpression.property, varTable), memberExpression.loc);
};
var replaceVarInMemberObject = function (id, obj, varTable) {
    return Expression_Types_1.isArrayExpression(obj) ? (obj.elements.length > 0 ?
        Expression_Types_1.createArrayExpression(obj.elements.map(function (v) {
            return replaceVarInValueExpression(id, v, varTable);
        }), obj.loc) :
        Expression_Types_1.createArrayExpression([], obj.loc)) :
        valueExpressionToArrObject(replaceVarInIdentifier(id, obj, varTable));
};
var valueExpressionToArrObject = function (valueExpression) {
    return Expression_Types_1.isArrayObject(valueExpression) ? valueExpression :
        Expression_Types_1.createArrayExpression([], valueExpression.loc);
}; // Error: not an array
var replaceVarsInConditionalExpression = function (id, cond, varTable) {
    return Expression_Types_1.createConditionalExpression(replaceVarInValueExpression(id, cond.test, varTable), replaceVarInValueExpression(id, cond.consequent, varTable), replaceVarInValueExpression(id, cond.alternate, varTable), cond.loc);
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
    var value = getValueOfUpdateExpression(updateExpression, varTable); // This will update varTable - we don't need the value
    var arg = updateExpression.argument;
    if (Expression_Types_1.isIdentifier(arg) && !exports.isVarParam(arg, varTable))
        return NO_LINES;
    return [analyzedLineToValuedLine(updateExpression, value, varTable)];
};
var getValuedLinesOfBody = function (body, varTable) {
    return Expression_Types_1.isBody(body) ?
        (Expression_Types_1.isExpression(body) ? substituteExpression(body, copyArr(varTable)) :
            (body.body.length > 0 ?
                body.body.map(getSubstituteExpFunc(copyArr(varTable))).reduce(concatValuedLines) :
                [])).concat([closeBlockLine]) :
        [];
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
        updateVarTable(varTable, varDeclaration.declarations[i].id, (varDeclaration.declarations[i].init == null ? Expression_Types_1.createAtomicLiteralExpression(0) : varDeclaration.declarations[i].init));
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
    else {
        return substituteArrayAssignment(assignmentExpression, left, varTable);
    }
    return NO_LINES;
};
var substituteArrayAssignment = function (assignmentExpression, left, varTable) {
    var obj = left.object;
    if (Expression_Types_1.isIdentifier(obj)) {
        var oldValue = exports.getValueExpressionOfIdentifier(obj, varTable);
        while (!Expression_Types_1.isArrayExpression(oldValue)) // If it's an array pointer
            oldValue = exports.getValueExpressionOfIdentifier(obj, varTable);
        if (Expression_Types_1.isArrayExpression(oldValue)) {
            var i_1 = valueExpressionToValue(left.property, varTable);
            if (isNumber(i_1)) {
                var newElements = oldValue.elements.map(function (v, index) {
                    return index == i_1 ? assignmentExpression.right : v;
                });
                var newValue = Expression_Types_1.createArrayExpression(newElements, left.loc);
                updateVarTable(varTable, obj, newValue);
                if (exports.isVarParam(obj, varTable))
                    return [analyzedLineToValuedLine(assignmentExpression, valueExpressionToValue(newValue, varTable), varTable)];
            }
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
