"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isWithType = function (x) { return x != null && x.hasOwnProperty('type'); };
exports.isProgram = function (x) { return isWithType(x) ? x.type == 'Program' : false; };
exports.isLoopStatement = function (x) { return exports.isWhileStatement(x) || exports.isDoWhileStatement(x) || exports.isForStatement(x); };
exports.isAtomicExpression = function (x) {
    return exports.isVariableDeclaration(x) || exports.isAssignmentExpression(x) || exports.isReturnStatement(x) || exports.isBreakStatement(x);
};
exports.isCompoundExpression = function (x) {
    return exports.isExpressionStatement(x) || exports.isFunctionDeclaration(x) || exports.isValueExpression(x) || exports.isLoopStatement(x) || exports.isIfStatement(x);
};
exports.isExpression = function (x) { return exports.isAtomicExpression(x) || exports.isCompoundExpression(x); };
exports.isExpressionStatement = function (x) { return isWithType(x) ? x.type === 'ExpressionStatement' : false; };
exports.isIdentifier = function (x) { return isWithType(x) ? x.type === 'Identifier' : false; };
exports.isLiteral = function (x) { return exports.isAtomicLiteral(x) || exports.isArrayExpression(x); };
exports.isAtomicLiteral = function (x) { return isWithType(x) ? x.type === 'Literal' : false; };
exports.isBinaryExpression = function (x) { return isWithType(x) ? x.type === 'BinaryExpression' : false; };
exports.createBinaryExpression = function (operator, left, right, loc) {
    return ({ type: 'BinaryExpression', operator: operator, left: left, right: right, loc: loc });
};
exports.isUnaryExpression = function (x) { return isWithType(x) ? x.type === 'UnaryExpression' : false; };
exports.createUnaryExpression = function (operator, argument, prefix, loc) {
    return ({ type: 'UnaryExpression', operator: operator, argument: argument, prefix: prefix, loc: loc });
};
exports.isComputationExpression = function (x) {
    return exports.isBinaryExpression(x) || exports.isLogicalExpression(x) || exports.isUnaryExpression(x) || exports.isUpdateExpression(x);
};
exports.isValueExpression = function (x) {
    return exports.isLiteral(x) || exports.isIdentifier(x) || exports.isComputationExpression(x) || exports.isConditionalExpression(x) || exports.isMemberExpression(x);
};
exports.isBlockStatement = function (x) { return isWithType(x) ? x.type === 'BlockStatement' : false; };
exports.isBody = function (x) { return exports.isBlockStatement(x) || exports.isExpression(x); };
exports.isFunctionDeclaration = function (x) { return isWithType(x) ? x.type === 'FunctionDeclaration' : false; };
exports.isVariableDeclaration = function (x) { return isWithType(x) ? x.type === 'VariableDeclaration' : false; };
exports.isAssignmentExpression = function (x) { return isWithType(x) ? x.type === 'AssignmentExpression' : false; };
exports.isUpdateExpression = function (x) { return isWithType(x) ? x.type === 'UpdateExpression' : false; };
exports.isLogicalExpression = function (x) { return isWithType(x) ? x.type === 'LogicalExpression' : false; };
exports.createLogicalExpression = function (operator, left, right, loc) {
    return ({ type: 'LogicalExpression', operator: operator, left: left, right: right, loc: loc });
};
exports.isConditionalExpression = function (x) { return isWithType(x) ? x.type === 'ConditionalExpression' : false; };
exports.createConditionalExpression = function (test, consequent, alternate, loc) {
    return ({ type: 'ConditionalExpression', test: test, consequent: consequent, alternate: alternate, loc: loc });
};
exports.isArrayObject = function (x) { return exports.isIdentifier(x) || exports.isArrayExpression(x); };
exports.isMemberExpression = function (x) { return isWithType(x) ? x.type === 'MemberExpression' : false; };
exports.createMemberExpression = function (computed, object, property, loc) {
    return ({ type: 'MemberExpression', computed: computed, object: object, property: property, loc: loc });
};
exports.isArrayExpression = function (x) { return isWithType(x) ? x.type === 'ArrayExpression' : false; };
exports.createArrayExpression = function (elements, loc) {
    return ({ type: 'ArrayExpression', elements: elements, loc: loc });
};
exports.isReturnStatement = function (x) { return isWithType(x) ? x.type === 'ReturnStatement' : false; };
exports.isWhileStatement = function (x) { return isWithType(x) ? x.type === 'WhileStatement' : false; };
exports.isDoWhileStatement = function (x) { return isWithType(x) ? x.type === 'DoWhileStatement' : false; };
exports.isForStatement = function (x) { return isWithType(x) ? x.type === 'ForStatement' : false; };
exports.isBreakStatement = function (x) { return isWithType(x) ? x.type === 'BreakStatement' : false; };
exports.isIfStatement = function (x) { return isWithType(x) ? x.type === 'IfStatement' : false; };
exports.literalToLitExp = function (x) {
    return ({ type: "Literal", value: x, raw: String(x), loc: null });
};
