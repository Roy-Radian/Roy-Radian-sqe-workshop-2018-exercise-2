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
var variableDeclarationToAnalyzedLines = function (varDec) {
    return varDec.declarations.map(function (varDeclarator) { return variableDeclaratorToAnalyzedLine(varDeclarator); });
};
var variableDeclaratorToAnalyzedLine = function (varDec) {
    return ({ line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init) });
};
var getValOfInit = function (init) {
    return Expression_Types_1.isValueExpression(init) ? getValOfValExp(init) :
        'null';
};
var getValOfValExp = function (v) {
    return Expression_Types_1.isLiteral(v) ? v.raw :
        Expression_Types_1.isIdentifier(v) ? v.name :
            Expression_Types_1.isComputationExpression(v) ? getValOfComputationExpression(v) :
                Expression_Types_1.isConditionalExpression(v) ? getValOfConditionalExpression(v) :
                    getValOfMemberExpression(v);
};
var getValOfComputationExpression = function (c) {
    return Expression_Types_1.isBinaryExpression(c) ? '(' + getValOfValExp(c.left) + ' ' + c.operator + ' ' + getValOfValExp(c.right) + ')' :
        Expression_Types_1.isUnaryExpression(c) ? c.operator + getValOfValExp(c.argument) : // If there were non-prefix unary expressions: (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
            (c.prefix ? c.operator + getValOfValExp(c.argument) : getValOfValExp(c.argument) + c.operator);
};
var getValOfConditionalExpression = function (cond) {
    return "(" + getValOfValExp(cond.test) + " ? " + getValOfValExp(cond.consequent) + " : " + getValOfValExp(cond.alternate) + ")";
};
var getValOfMemberExpression = function (m) {
    return m.computed ? getValOfValExp(m.object) + '[' + getValOfValExp(m.property) + ']' :
        getValOfValExp(m.object) + '.' + getValOfValExp(m.property);
};
var valueExpressionToAnalyzedLines = function (val) {
    return Expression_Types_1.isLiteral(val) ? literalExpressionToAnalyzedLines(val) :
        Expression_Types_1.isIdentifier(val) ? identifierToAnalyzedLines(val) :
            Expression_Types_1.isComputationExpression(val) ? computationExpressionToAnalyzedLines(val) :
                Expression_Types_1.isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val) :
                    memberExpressionToAnalyzedLines(val);
};
var computationExpressionToAnalyzedLines = function (comp) {
    return Expression_Types_1.isUpdateExpression(comp) ? updateExpressionToAnalyzedLines(comp) :
        Expression_Types_1.isBinaryExpression(comp) ? binaryExpressionToAnalyzedLines(comp) :
            unaryExpressionToAnalyzedLines(comp);
};
var literalExpressionToAnalyzedLines = function (l) {
    return [{ line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw }];
};
var identifierToAnalyzedLines = function (i) {
    return [{ line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY }];
};
var binaryExpressionToAnalyzedLines = function (b) {
    return [{ line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b) }];
};
var unaryExpressionToAnalyzedLines = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u) }];
};
var updateExpressionToAnalyzedLines = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: getNameOfAssignable(u.argument), condition: EMPTY, value: getValOfValExp(u) }];
};
var assignmentExpressionToAnalyzedLines = function (assignmentExpression) {
    return [{ line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: getNameOfAssignable(assignmentExpression.left), condition: EMPTY, value: getValOfAssignmentExpression(assignmentExpression) }];
};
var getNameOfAssignable = function (a) {
    return Expression_Types_1.isMemberExpression(a) ? getValOfValExp(a) : a.name;
};
var getValOfAssignmentExpression = function (a) {
    return (a.operator.length > 1 ? getValOfValExp(a.left) + ' ' + a.operator[0] + ' ' : '') + getValOfValExp(a.right);
};
var returnStatementToAnalyzedLines = function (ret) {
    return [{ line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument) }];
};
var whileStatementToAnalyzedLines = function (whileStatement) {
    return [{ line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY }];
};
var forStatementToAnalyzedLines = function (forStatement) {
    return forConditionToAnalyzedLines(forStatement).concat(forInitToAnalyzedLines(forStatement)).concat(forUpdateToAnalyzedLines(forStatement));
};
var forConditionToAnalyzedLines = function (forStatement) {
    return [{ line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY }];
};
var breakStatementToAnalyzedLines = function (breakStatement) {
    return [{ line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var ifStatementToAnalyzedLines = function (ifStatement) {
    return [{ line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY }];
};
var elseToAnalyzedLines = function (alt) {
    return [{ line: alt.loc.start.line, type: 'Else', name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var conditionalExpressionToAnalyzedLines = function (conditionalExpression) {
    return [{ line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY }];
};
var memberExpressionToAnalyzedLines = function (memberExpression) {
    return [{ line: memberExpression.loc.start.line, type: memberExpression.type, name: getNameOfAssignable(memberExpression), condition: EMPTY, value: EMPTY }];
};
var doWhileStatementToAnalyzedLines = function (doWhileStatement) {
    return [{ line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY }];
};
var concatAnalyzedLines = function (prev, curr) { return prev.concat(curr); };
var programToAnalyzedLines = function (program) {
    return program.body.length > 0 ? program.body.map(function (exp) { return getAllAnalyzedLines(exp); }).reduce(concatAnalyzedLines) : [];
};
exports.programToAnalyzedLines = programToAnalyzedLines;
var getAllAnalyzedLines = function (exp) {
    return Expression_Types_1.isAtomicExpression(exp) ? getAnalyzedLinesFromAtomicExpression(exp) :
        getAnalyzedLinesFromCompoundExpression(exp);
};
var getAnalyzedLinesFromAtomicExpression = function (a) {
    return Expression_Types_1.isVariableDeclaration(a) ? variableDeclarationToAnalyzedLines(a) :
        Expression_Types_1.isAssignmentExpression(a) ? assignmentExpressionToAnalyzedLines(a) :
            Expression_Types_1.isReturnStatement(a) ? returnStatementToAnalyzedLines(a) :
                breakStatementToAnalyzedLines(a);
};
var getAnalyzedLinesFromCompoundExpression = function (comp) {
    return Expression_Types_1.isExpressionStatement(comp) ? getAllAnalyzedLines(comp.expression) :
        Expression_Types_1.isFunctionDeclaration(comp) ? getAnalyzedLinesFromFunctionDeclaration(comp) :
            Expression_Types_1.isValueExpression(comp) ? valueExpressionToAnalyzedLines(comp) :
                Expression_Types_1.isLoopStatement(comp) ? getAnalyzedLinesFromLoopStatement(comp) :
                    getAnalyzedLinesFromIfStatement(comp);
};
var getAnalyzedLinesFromLoopStatement = function (loop) {
    return Expression_Types_1.isWhileStatement(loop) ? getAnalyzedLinesFromWhileStatement(loop) :
        Expression_Types_1.isDoWhileStatement(loop) ? getAnalyzedLinesFromDoWhileStatement(loop) :
            getAnalyzedLinesFromForStatement(loop);
};
var getAnalyzedLinesFromBody = function (b) {
    return Expression_Types_1.isBlockStatement(b) ? b.body.map(function (exp) { return getAllAnalyzedLines(exp); }).reduce(concatAnalyzedLines) :
        getAllAnalyzedLines(b);
};
var getAnalyzedLinesFromFunctionDeclaration = function (func) {
    return functionDeclarationToAnalyzedLines(func).concat(getDeclarationsOfParams(func)).concat(getAnalyzedLinesFromBody(func.body));
};
var makeDeclaratorOfIdentifier = function (id) {
    return ({ type: 'VariableDeclarator', id: id, init: null, loc: id.loc });
};
var getAnalyzedLinesFromWhileStatement = function (whileStatement) {
    return whileStatementToAnalyzedLines(whileStatement).concat(getAnalyzedLinesFromBody(whileStatement.body));
};
var getAnalyzedLinesFromDoWhileStatement = function (doWhileStatement) {
    return doWhileStatementToAnalyzedLines(doWhileStatement).concat(getAnalyzedLinesFromBody(doWhileStatement.body));
};
var getAnalyzedLinesFromForStatement = function (forStatement) {
    return forStatementToAnalyzedLines(forStatement).concat(getAnalyzedLinesFromBody(forStatement.body));
};
var forInitToAnalyzedLines = function (forStatement) {
    return Expression_Types_1.isVariableDeclaration(forStatement.init) ? variableDeclarationToAnalyzedLines(forStatement.init) :
        assignmentExpressionToAnalyzedLines(forStatement.init);
};
var forUpdateToAnalyzedLines = function (forStatement) {
    return Expression_Types_1.isAssignmentExpression(forStatement.update) ? assignmentExpressionToAnalyzedLines(forStatement.update) :
        updateExpressionToAnalyzedLines(forStatement.update);
};
var getAnalyzedLinesFromIfStatement = function (ifStatement) {
    return ifStatementToAnalyzedLines(ifStatement).concat(getAnalyzedLinesFromBody(ifStatement.consequent)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate));
};
var getAnalyzedLinesFromAlternate = function (altBody) {
    return Expression_Types_1.isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody)) : [];
};
