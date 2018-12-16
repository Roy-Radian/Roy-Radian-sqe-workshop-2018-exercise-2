import {
    isBinaryExpression,
    isComputationExpression,
    isIdentifier,
    isLiteral,
    isUnaryExpression,
    isConditionalExpression,
    ValueExpression,
    ComputationExpression,
    ConditionalExpression,
    MemberExpression,
    BinaryExpression,
    UnaryExpression,
    UpdateExpression,
    Assignable,
    Identifier,
    Program,
    Expression,
    isValueExpression,
    isAssignmentExpression,
    isVariableDeclaration,
    isLoopStatement,
    isIfStatement,
    isAtomicExpression,
    AtomicExpression,
    isReturnStatement,
    CompoundExpression,
    isExpressionStatement,
    LoopStatement,
    isWhileStatement,
    isDoWhileStatement,
    VariableDeclaration,
    literalToLitExp,
    AssignmentExpression,
    ReturnStatement,
    BreakStatement,
    isUpdateExpression,
    IfStatement,
    Body,
    isExpression, isFunctionDeclaration, FunctionDeclaration, WhileStatement, DoWhileStatement, ForStatement
} from "./Expression-Types";
import {AnalyzedLine, getAllAnalyzedLines, getFirstAnalyzedLine, getValOfValExp} from "./expression-analyzer";
import {parseCode} from "./code-analyzer";

type Value = number | string | boolean;

const isNumber = (x: Value): x is number => (typeof x) === "number";
const isString = (x: Value): x is string => (typeof x) === "string";
const isBoolean = (x: Value) : x is boolean => (typeof x) === "boolean";

const falseLiteral = 'false';
const trueLiteral = 'true';

const isNumericString = (x: string) : boolean => !isNaN(Number(x));
const isBooleanString = (x: string): boolean => x.toString().toLowerCase() === falseLiteral || x.toString().toLowerCase() === trueLiteral;
const stringToValue = (str: string): Value =>
    isBooleanString(str) ? str ://str === trueLiteral :
    isNumericString(str) ? Number(str) :
    str.replace(/"/g, '');

export interface VarTuple {
    name: string;
    value: ValueExpression;
    isParam : boolean;
}

export const isVarParam = (id: Identifier, varTable: VarTuple[]): boolean =>
    varTable.length == 0 ? false :
    varTable[0].name == id.name ? varTable[0].isParam :
    isVarParam(id, varTable.slice(1));

const paramToValueTuple = (param: string): VarTuple =>
    ({name: param.trim().split('=')[0].trim(), value: parseCode(param.trim().split('=')[1].trim()).body[0].expression, isParam: true});

const parseParams = (paramsTxt: string): VarTuple[] =>
    paramsTxt.split(',').map(paramToValueTuple);

const valueExpressionToValue = (v: ValueExpression, varTable: VarTuple[]): Value =>
    isLiteral(v) ? stringToValue(v.value) :
    isIdentifier(v) ? valueExpressionToValue(getValueExpressionOfIdentifier(v, varTable), varTable) :
    isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
    isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
    getValOfMemberExpression(v, varTable);

export const getValueExpressionOfIdentifier = (id: Identifier, varTable: VarTuple[]): ValueExpression =>
    varTable.length == 0 ? null :
    varTable[0].name == id.name ? varTable[0].value :
    getValueExpressionOfIdentifier(id, varTable.slice(1));

const getValueOfIdentifier = (id: Identifier, varTable: VarTuple[]): Value =>
    valueExpressionToValue(getValueExpressionOfIdentifier(id, varTable), varTable);

const getValueOfComputationExpression = (comp: ComputationExpression, varTable: VarTuple[]): Value =>
    isBinaryExpression(comp) ? getValueOfBinaryExpression(comp, varTable) :
    isUnaryExpression(comp) ? getValueOfUnaryExpression(comp, varTable) :
    getValueOfUpdateExpression(comp, varTable);

const getValueOfConditionalExpression = (cond: ConditionalExpression, varTable: VarTuple[]): Value =>
    valueExpressionToValue(cond.test, varTable) ? valueExpressionToValue(cond.consequent, varTable) :
    valueExpressionToValue(cond.alternate, varTable);

const getValOfMemberExpression = (memberExpression: MemberExpression, varTable: VarTuple[]): Value =>
    "unsupported: array: " + memberExpression.object + "[" + memberExpression.property + "]";

const getValueOfBinaryExpression = (binaryExpression: BinaryExpression, varTable: VarTuple[]): Value =>
    performBinaryOp(valueExpressionToValue(binaryExpression.left, varTable), valueExpressionToValue(binaryExpression.right, varTable), binaryExpression.operator);

const performBinaryOp = (left: Value, right: Value, op: string): Value =>
    op === '+' ? performAddition(left, right) :
    //isBoolean(left) && isBoolean(right) ? performBooleanBinaryOp(left, right, op) :
    isNumber(left) && isNumber(right) && isNumericOp(op) ? performNumericBinaryOp(left, right, op) :
    performBooleanEqBinaryOp(left, right, op);

const performAddition = (left: Value, right: Value): Value =>
    isString(left) ? left + right :
    isString(right) ? left + right :
    isBoolean(left) || isBoolean(right) ? "undefined operation + between booleans" :
    left + right;

const isNumericOp = (op: string): boolean =>
   ['-', '*', '/', '**'].indexOf(op) != -1;

const performBooleanEqBinaryOp = (left: Value, right: Value, op: string): Value =>
    op === '>' ? left > right :
    op === '<=' ? left <= right :
    op === '<' ? left < right :
    op === '<=' ? left < right :
    op === '==' ? left == right :
    left === right;

/*const performLogicalExpression = (left: boolean, right: boolean, op: string): Value =>
    op[0] === '&' ? left && right :
    left || right;*/

const performNumericBinaryOp = (left: number, right: number, op: string) : Value =>
    op === '-' ? left - right :
    op === '*' ? left * right :
    op === '/' ? left / right :
    left ** right;

const getValueOfUnaryExpression = (unaryExpression: UnaryExpression, varTable: VarTuple[]): Value =>
    performUnaryOp(valueExpressionToValue(unaryExpression.argument, varTable), unaryExpression.operator);

const performUnaryOp = (val: Value, op: string): Value =>
    op === '!' ? (isBoolean(val) ? !val : "undefined operation: not on a non-boolean") :
    op === '-' ? -val :
    val;

const getValueOfUpdateExpression = (updateExpression: UpdateExpression, varTable: VarTuple[]): Value =>
    performUpdate(updateExpression, updateExpression.argument, updateExpression.operator, updateExpression.prefix, varTable);

const performUpdate = (updateExpression: UpdateExpression, assignable: Assignable, op: string, prefix: boolean, varTable: VarTuple[]): Value => { // Mutations due to changing varTable
    if (isIdentifier(assignable)) {
        let oldValue = valueExpressionToValue(assignable, varTable);
        if (isNumber(oldValue)) {
            updateVarTable(varTable, assignable, {type: "BinaryExpression", operator: op[0], left: assignable, right: literalToLitExp(1), loc: updateExpression.loc}); // Transform the update exp into a binary exp so it would not be calculated more than once
            return (prefix ? performUpdateOp(oldValue, op) : oldValue);
        }
        return "error: cannot update a non numeric value: " + oldValue;
    }
    else
        return "unsupported: array";
}

const updateVarTable = (varTable: VarTuple[], id: Identifier, newValue: ValueExpression): void => { // Mutations due to changing varTable
    for (let i = 0; i < varTable.length; i++) {
        if (varTable[i].name == id.name) {
            varTable[i].value = newValue;
            return;
        }
    }
    varTable.push({name: id.name, value: newValue, isParam: false});
}

const performUpdateOp = (value: number, op: string): Value =>
    op === '++' ? value + 1 :
    value - 1;


export interface ValuedLine {
    analyzedLine: AnalyzedLine;
    value: Value;
}

const analyzedLineToValuedLine = (expression: Expression, value: Value, varTable: VarTuple[]): ValuedLine =>
    ({analyzedLine: getFirstAnalyzedLine(expression, varTable), value: value});

const NO_LINES = [];

const closeBlockLine: ValuedLine = {
    analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
    value: 0
};

const doWhileEndLine = (cond: string, value: Value): ValuedLine => ({
    analyzedLine: {line: -1, type: 'DoWhileEnd', name: '', condition: cond, value: ''},
    value: value
});

const copyArr = <T>(arr: T[]): T[] => arr.slice();

const substituteExpression = (exp: Expression, varTable: VarTuple[]): ValuedLine[] =>
    isAtomicExpression(exp) ? substituteAtomicExpression(exp, varTable) :
    substituteCompoundExpression(exp, varTable);

const substituteAtomicExpression = (exp: AtomicExpression, varTable: VarTuple[]): ValuedLine[] =>
    isVariableDeclaration(exp) ? substituteVariableDeclaration(exp, varTable) :
    isAssignmentExpression(exp) ? substituteAssignmentExpression(exp, varTable) :
    isReturnStatement(exp) ? substituteReturnStatement(exp, varTable) :
    substituteBreakStatement(exp, varTable);

const substituteCompoundExpression = (exp: CompoundExpression, varTable: VarTuple[]): ValuedLine[] =>
    isFunctionDeclaration(exp) ? substituteFunctionDeclaration(exp, varTable) :
    isValueExpression(exp) ? substituteValueExpression(exp, varTable) :
    isExpressionStatement(exp) ? substituteExpression(exp.expression, varTable) :
    isIfStatement(exp) ? substituteIfStatement(exp, varTable) :
    substituteLoopStatement(exp, varTable);

const substituteFunctionDeclaration = (func: FunctionDeclaration, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(func, 0, varTable)].concat(getValuedLinesOfBody(func.body, varTable));

const substituteValueExpression = (exp: ValueExpression, varTable: VarTuple[]): ValuedLine[] =>
    isUpdateExpression(exp) ? substituteUpdateExpression(exp, varTable) : NO_LINES;

const substituteUpdateExpression = (updateExpression: UpdateExpression, varTable: VarTuple[]): ValuedLine[] => { // Mutation due to chancing varTable
    getValueOfUpdateExpression(updateExpression, varTable); // This will update varTable - we don't need the value
    return NO_LINES;
}

const getValuedLinesOfBody = (body: Body, varTable: VarTuple[]): ValuedLine[] =>
    (isExpression(body) ? substituteExpression(body, copyArr(varTable)) : body.body.map(getSubstituteExpFunc(copyArr(varTable))).reduce(concatValuedLines)).concat([closeBlockLine]);

const substituteIfStatement = (ifStatement: IfStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(ifStatement, valueExpressionToValue(ifStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(ifStatement.consequent, varTable));

const substituteLoopStatement = (loopStatement: LoopStatement, varTable: VarTuple[]): ValuedLine[] =>
    isWhileStatement(loopStatement) ? substituteWhileStatement(loopStatement, varTable) :
    isDoWhileStatement(loopStatement) ? substituteDoWhileStatement(loopStatement, varTable) :
    substituteForStatement(loopStatement, varTable);

const substituteWhileStatement = (whileStatement: WhileStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(whileStatement, valueExpressionToValue(whileStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(whileStatement.body, varTable));

const substituteDoWhileStatement = (doWhileStatement: DoWhileStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(doWhileStatement, valueExpressionToValue(doWhileStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(doWhileStatement.body, varTable)).concat(getDoWhileEndLine(getValOfValExp(doWhileStatement.test, varTable), valueExpressionToValue(doWhileStatement.test, varTable)));

const getDoWhileEndLine = (cond: string, value: Value): ValuedLine[] =>
    [doWhileEndLine(cond, value)];

const substituteForStatement = (forStatement: ForStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(forStatement, valueExpressionToValue(forStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(forStatement.body, varTable));

const substituteVariableDeclaration = (varDeclaration: VariableDeclaration, varTable: VarTuple[]): ValuedLine[] => { // Mutations due to changing varTable
    for (let i = 0; i < varDeclaration.declarations.length; i++) {
        updateVarTable(varTable, varDeclaration.declarations[i].id, (varDeclaration.declarations[i].init == null ? literalToLitExp(0) : varDeclaration.declarations[i].init));
    }
    return NO_LINES;
}

const substituteAssignmentExpression = (assignmentExpression: AssignmentExpression, varTable: VarTuple[]): ValuedLine[] => { // Mutation due to changing varTable
    addAssignmentToVarTable(assignmentExpression.left, assignmentExpression.operator, assignmentExpression.right, varTable);
    let left = assignmentExpression.left;
    if (isIdentifier(left)) {
        if (isVarParam(left, varTable))
            return [analyzedLineToValuedLine(left, valueExpressionToValue(assignmentExpression.right, varTable), varTable)];
    }
    return NO_LINES;
}

const addAssignmentToVarTable = (assignable: Assignable, op: string, value: ValueExpression, varTable: VarTuple[]): void => { // Mutation due to changing varTable
    if (isIdentifier(assignable))
        updateVarTable(varTable, assignable, value);
}

const substituteReturnStatement = (returnStatement: ReturnStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(returnStatement, valueExpressionToValue(returnStatement.argument, varTable), varTable)];

const substituteBreakStatement = (b: BreakStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(b, 0, varTable)]

const getSubstituteExpFunc = (varTable: VarTuple[]) =>
    (exp: Expression) =>
        substituteExpression(exp, varTable);

const concatValuedLines = (previous: ValuedLine[], current: ValuedLine[]) => previous.concat(current);

const substituteProgram = (program: Program, varTable: VarTuple[]): ValuedLine[] =>
    program.body.map(getSubstituteExpFunc(varTable)).reduce(concatValuedLines);


export {parseParams, substituteProgram};

// TODO: Allow an empty input vector
// TODO: Should I support logical expressions?
/* TODO: should I support arrays? If so I need to:
*          * Support ArrayExpression as a value expression
*          * Somehow support array values in input vector
*          * Support arrays in value calculations: The type of all the functions will remain Value (and not Value[]) and I will force getValueOfIdentifier to return Value.
*               I will create a new function getValueOfArrayIdentifier which will return Value as well.
*/