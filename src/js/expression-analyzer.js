"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Expression_Types_1 = require("./Expression-Types");
exports.isBinaryExpression = Expression_Types_1.isBinaryExpression;
exports.isConditionalExpression = Expression_Types_1.isConditionalExpression;
exports.isIdentifier = Expression_Types_1.isIdentifier;
exports.isLiteral = Expression_Types_1.isLiteral;
exports.isMemberExpression = Expression_Types_1.isMemberExpression;
exports.isUnaryExpression = Expression_Types_1.isUnaryExpression;
exports.isUpdateExpression = Expression_Types_1.isUpdateExpression;
exports.isProgram = Expression_Types_1.isProgram;
var code_substitutor_1 = require("./code-substitutor");
var EMPTY = '';
/*const expressionToAnalyzedLines = (exp: Expression): AnalyzedLine[] =>
    //isExpressionStatement(exp) ? expressionStatementToAnalyzedLines(exp) :
    isFunctionDeclaration(exp) ? functionDeclarationToAnalyzedLines(exp) :
    isVariableDeclaration(exp) ? variableDeclarationToAnalyzedLines(exp) :
    isValueExpression(exp) ? valueExpressionToAnalyzedLines(exp) :
    isAssignmentExpression(exp) ? assignmentExpressionToAnalyzedLines(exp) :
    isReturnStatement(exp) ? returnStatementToAnalyzedLines(exp) :
    isWhileStatement(exp) ? whileStatementToAnalyzedLines(exp) :
    isDoWhileStatement(exp) ? doWhileStatementToAnalyzedLines(exp) :
    isForStatement(exp) ? forStatementToAnalyzedLines(exp) :
    isBreakStatement(exp) ? breakStatementToAnalyzedLines(exp) :
    isIfStatement(exp) ? ifStatementToAnalyzedLines(exp) :
    conditionalExpressionToAnalyzedLines(exp);*/
/*const expressionStatementToAnalyzedLines = (expStatement: ExpressionStatement): AnalyzedLine[] =>
    expressionToAnalyzedLines(expStatement.expression);*/
var functionDeclarationToAnalyzedLines = function (func) {
    return [{ line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY }];
};
var getDeclarationsOfParams = function (func) {
    return func.params.map(function (id) { return variableDeclaratorToAnalyzedLine(makeDeclaratorOfIdentifier(id)); });
};
var variableDeclarationToAnalyzedLines = function (varDec, varTable) {
    if (varTable === void 0) { varTable = []; }
    return varDec.declarations.map(function (varDeclarator) { return variableDeclaratorToAnalyzedLine(varDeclarator, varTable); });
};
var variableDeclaratorToAnalyzedLine = function (varDec, varTable) {
    if (varTable === void 0) { varTable = []; }
    return ({ line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init, varTable) });
};
var getValOfInit = function (init, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isValueExpression(init) ? exports.getValOfValExp(init, varTable) :
        'null';
};
exports.getValOfValExp = function (v, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isLiteral(v) ? v.raw :
        Expression_Types_1.isIdentifier(v) ? (varTable.length == 0 || code_substitutor_1.isVarParam(v, varTable) ? v.name : String(code_substitutor_1.getValueOfIdentifier(v, varTable))) :
            Expression_Types_1.isComputationExpression(v) ? getValOfComputationExpression(v) :
                Expression_Types_1.isConditionalExpression(v) ? getValOfConditionalExpression(v) :
                    getValOfMemberExpression(v);
};
var getValOfComputationExpression = function (c) {
    return Expression_Types_1.isBinaryExpression(c) ? '(' + exports.getValOfValExp(c.left) + ' ' + c.operator + ' ' + exports.getValOfValExp(c.right) + ')' :
        Expression_Types_1.isUnaryExpression(c) ? c.operator + exports.getValOfValExp(c.argument) : // If there were non-prefix unary expressions: (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
            (c.prefix ? c.operator + exports.getValOfValExp(c.argument) : exports.getValOfValExp(c.argument) + c.operator);
};
var getValOfConditionalExpression = function (cond) {
    return "(" + exports.getValOfValExp(cond.test) + " ? " + exports.getValOfValExp(cond.consequent) + " : " + exports.getValOfValExp(cond.alternate) + ")";
};
var getValOfMemberExpression = function (m) {
    return m.computed ? exports.getValOfValExp(m.object) + '[' + exports.getValOfValExp(m.property) + ']' :
        exports.getValOfValExp(m.object) + '.' + exports.getValOfValExp(m.property);
};
var valueExpressionToAnalyzedLines = function (val, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isLiteral(val) ? literalExpressionToAnalyzedLines(val) :
        Expression_Types_1.isIdentifier(val) ? identifierToAnalyzedLines(val, varTable) :
            Expression_Types_1.isComputationExpression(val) ? computationExpressionToAnalyzedLines(val, varTable) :
                Expression_Types_1.isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val, varTable) :
                    memberExpressionToAnalyzedLines(val);
};
var computationExpressionToAnalyzedLines = function (comp, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isUpdateExpression(comp) ? updateExpressionToAnalyzedLines(comp, varTable) :
        Expression_Types_1.isBinaryExpression(comp) ? binaryExpressionToAnalyzedLines(comp, varTable) :
            unaryExpressionToAnalyzedLines(comp, varTable);
};
var literalExpressionToAnalyzedLines = function (l) {
    return [{ line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw }];
};
var identifierToAnalyzedLines = function (i, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: i.loc.start.line, type: i.type, name: (varTable.length == 0 ? i.name : String(code_substitutor_1.getValueOfIdentifier(i, varTable))), condition: EMPTY, value: EMPTY }];
};
var binaryExpressionToAnalyzedLines = function (b, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: exports.getValOfValExp(b, varTable) }];
};
var unaryExpressionToAnalyzedLines = function (u, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: exports.getValOfValExp(u, varTable) }];
};
var updateExpressionToAnalyzedLines = function (u, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: u.loc.start.line, type: u.type, name: getNameOfAssignable(u.argument), condition: EMPTY, value: exports.getValOfValExp(u, varTable) }];
};
var assignmentExpressionToAnalyzedLines = function (assignmentExpression, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: getNameOfAssignable(assignmentExpression.left), condition: EMPTY, value: getValOfAssignmentExpression(assignmentExpression, varTable) }];
};
var getNameOfAssignable = function (a) {
    return Expression_Types_1.isMemberExpression(a) ? exports.getValOfValExp(a) : a.name;
};
var getValOfAssignmentExpression = function (a, varTable) {
    if (varTable === void 0) { varTable = []; }
    return (a.operator.length > 1 ? exports.getValOfValExp(a.left, varTable) + ' ' + a.operator[0] + ' ' : '') + exports.getValOfValExp(a.right, varTable);
};
var returnStatementToAnalyzedLines = function (ret, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: exports.getValOfValExp(ret.argument, varTable) }];
};
var whileStatementToAnalyzedLines = function (whileStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: exports.getValOfValExp(whileStatement.test, varTable), value: EMPTY }];
};
var forStatementToAnalyzedLines = function (forStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return forConditionToAnalyzedLines(forStatement, varTable).concat(forInitToAnalyzedLines(forStatement, varTable)).concat(forUpdateToAnalyzedLines(forStatement, varTable));
};
var forConditionToAnalyzedLines = function (forStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: exports.getValOfValExp(forStatement.test, varTable), value: EMPTY }];
};
var forInitToAnalyzedLines = function (forStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isVariableDeclaration(forStatement.init) ? variableDeclarationToAnalyzedLines(forStatement.init, varTable) :
        assignmentExpressionToAnalyzedLines(forStatement.init, varTable);
};
var forUpdateToAnalyzedLines = function (forStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isAssignmentExpression(forStatement.update) ? assignmentExpressionToAnalyzedLines(forStatement.update, varTable) :
        updateExpressionToAnalyzedLines(forStatement.update, varTable);
};
var breakStatementToAnalyzedLines = function (breakStatement) {
    return [{ line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var ifStatementToAnalyzedLines = function (ifStatement) {
    return [{ line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: exports.getValOfValExp(ifStatement.test), value: EMPTY }];
};
var elseToAnalyzedLines = function (alt) {
    return [{ line: alt.loc.start.line, type: 'Else', name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var conditionalExpressionToAnalyzedLines = function (conditionalExpression, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: exports.getValOfValExp(conditionalExpression.test, varTable), value: EMPTY }];
};
var memberExpressionToAnalyzedLines = function (memberExpression) {
    return [{ line: memberExpression.loc.start.line, type: memberExpression.type, name: getNameOfAssignable(memberExpression), condition: EMPTY, value: EMPTY }];
};
var doWhileStatementToAnalyzedLines = function (doWhileStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return [{ line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: exports.getValOfValExp(doWhileStatement.test, varTable), value: EMPTY }];
};
var concatAnalyzedLines = function (prev, curr) { return prev.concat(curr); };
var programToAnalyzedLines = function (program, varTable) {
    if (varTable === void 0) { varTable = []; }
    return program.body.length > 0 ? program.body.map(function (exp) { return exports.getAllAnalyzedLines(exp, varTable); }).reduce(concatAnalyzedLines) : [];
};
exports.programToAnalyzedLines = programToAnalyzedLines;
exports.getAllAnalyzedLines = function (exp, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isAtomicExpression(exp) ? getAnalyzedLinesFromAtomicExpression(exp, varTable) :
        getAnalyzedLinesFromCompoundExpression(exp, varTable);
};
var getAnalyzedLinesFromAtomicExpression = function (a, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isVariableDeclaration(a) ? variableDeclarationToAnalyzedLines(a, varTable) :
        Expression_Types_1.isAssignmentExpression(a) ? assignmentExpressionToAnalyzedLines(a, varTable) :
            Expression_Types_1.isReturnStatement(a) ? returnStatementToAnalyzedLines(a, varTable) :
                breakStatementToAnalyzedLines(a);
};
var getAnalyzedLinesFromCompoundExpression = function (comp, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isExpressionStatement(comp) ? exports.getAllAnalyzedLines(comp.expression, varTable) :
        Expression_Types_1.isFunctionDeclaration(comp) ? getAnalyzedLinesFromFunctionDeclaration(comp, varTable) :
            Expression_Types_1.isValueExpression(comp) ? valueExpressionToAnalyzedLines(comp, varTable) :
                Expression_Types_1.isLoopStatement(comp) ? getAnalyzedLinesFromLoopStatement(comp, varTable) :
                    getAnalyzedLinesFromIfStatement(comp, varTable);
};
var getAnalyzedLinesFromLoopStatement = function (loop, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isWhileStatement(loop) ? getAnalyzedLinesFromWhileStatement(loop, varTable) :
        Expression_Types_1.isDoWhileStatement(loop) ? getAnalyzedLinesFromDoWhileStatement(loop, varTable) :
            getAnalyzedLinesFromForStatement(loop, varTable);
};
var getAnalyzedLinesFromBody = function (b, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isBlockStatement(b) ? b.body.map(function (exp) { return exports.getAllAnalyzedLines(exp, varTable); }).reduce(concatAnalyzedLines) :
        exports.getAllAnalyzedLines(b, varTable);
};
var getAnalyzedLinesFromFunctionDeclaration = function (func, varTable) {
    if (varTable === void 0) { varTable = []; }
    return functionDeclarationToAnalyzedLines(func).concat(getDeclarationsOfParams(func)).concat(getAnalyzedLinesFromBody(func.body, varTable));
};
var makeDeclaratorOfIdentifier = function (id) {
    return ({ type: 'VariableDeclarator', id: id, init: null, loc: id.loc });
};
var getAnalyzedLinesFromWhileStatement = function (whileStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return whileStatementToAnalyzedLines(whileStatement, varTable).concat(getAnalyzedLinesFromBody(whileStatement.body, varTable));
};
var getAnalyzedLinesFromDoWhileStatement = function (doWhileStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return doWhileStatementToAnalyzedLines(doWhileStatement, varTable).concat(getAnalyzedLinesFromBody(doWhileStatement.body, varTable));
};
var getAnalyzedLinesFromForStatement = function (forStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return forStatementToAnalyzedLines(forStatement, varTable).concat(getAnalyzedLinesFromBody(forStatement.body, varTable));
};
var getAnalyzedLinesFromIfStatement = function (ifStatement, varTable) {
    if (varTable === void 0) { varTable = []; }
    return ifStatementToAnalyzedLines(ifStatement).concat(getAnalyzedLinesFromBody(ifStatement.consequent, varTable)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate, varTable));
};
var getAnalyzedLinesFromAlternate = function (altBody, varTable) {
    if (varTable === void 0) { varTable = []; }
    return Expression_Types_1.isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody, varTable)) : [];
};
