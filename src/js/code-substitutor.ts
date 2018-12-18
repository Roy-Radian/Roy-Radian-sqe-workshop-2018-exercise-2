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
    createAtomicLiteralExpression,
    AssignmentExpression,
    ReturnStatement,
    BreakStatement,
    isUpdateExpression,
    IfStatement,
    Body,
    isExpression,
    isFunctionDeclaration,
    FunctionDeclaration,
    WhileStatement,
    DoWhileStatement,
    ForStatement,
    createBinaryExpression,
    createUnaryExpression,
    createConditionalExpression,
    createMemberExpression,
    isBody,
    Literal,
    isAtomicLiteral,
    ArrayExpression,
    ArrayObject,
    isArrayExpression,
    createArrayExpression,
    isArrayObject,
    isLogicalExpression,
    LogicalExpression,
    createLogicalExpression,
    isBlockStatement, createAssignmentExpression, isMemberExpression, getBlankLocation, ExpressionStatement
} from "./Expression-Types";
import {AnalyzedLine, getFirstAnalyzedLine, getValOfValExp} from "./expression-analyzer";
import {parseCode} from "./code-analyzer";

type Value = number | string | boolean | ValueArray;
interface ValueArray extends Array<Value> {};

const isNumber = (x: Value): x is number => (typeof x) === "number";
const isString = (x: Value): x is string => (typeof x) === "string";
const isBoolean = (x: Value) : x is boolean => (typeof x) === "boolean";
const isArray = (x: Value): x is any[] => x instanceof Array;

export interface VarTuple {
    name: string;
    value: ValueExpression;
    isParam : boolean;
}

export const isVarParam = (id: Identifier, varTable: VarTuple[]): boolean =>
    //varTable.length == 0 ? false :
    varTable[0].name == id.name ? varTable[0].isParam :
    isVarParam(id, varTable.slice(1));

const paramToValueTuple = (param: string): VarTuple =>
    ({name: param.trim().split('=')[0].trim(), value: parseCode(param.trim().split('=')[1].trim()).body[0].expression, isParam: true});

const parseParams = (paramsTxt: string): VarTuple[] =>
    paramsTxt.length > 0 ? paramsTxt.split(';').map(paramToValueTuple) : [];

const valueExpressionToValue = (v: ValueExpression, varTable: VarTuple[]): Value =>
    isLiteral(v) ? getValueOfLiteral(v, varTable) :
    isIdentifier(v) ? valueExpressionToValue(getValueExpressionOfIdentifier(v, varTable), varTable) :
    isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
    isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
    getValOfMemberExpression(v, varTable);

const getValueOfLiteral = (literal: Literal, varTable: VarTuple[]): Value =>
    isAtomicLiteral(literal) ? literal.value :
    getValueOfArrayExpression(literal, varTable);

const getValueOfArrayExpression = (arr: ArrayExpression, varTable: VarTuple[]): Value =>
    arr.elements.length > 0 ? arr.elements.map((v: ValueExpression): Value => valueExpressionToValue(v, varTable)) :
        [];

export const getValueExpressionOfIdentifier = (id: Identifier, varTable: VarTuple[]): ValueExpression =>
    //varTable.length == 0 ? null :
    varTable[0].name == id.name ? varTable[0].value :
    getValueExpressionOfIdentifier(id, varTable.slice(1));

const getValueOfComputationExpression = (comp: ComputationExpression, varTable: VarTuple[]): Value =>
    isBinaryExpression(comp) ? getValueOfBinaryExpression(comp, varTable) :
    isLogicalExpression(comp) ? getValueOfLogicalExpression(comp, varTable) :
    isUnaryExpression(comp) ? getValueOfUnaryExpression(comp, varTable) :
    "unsupported: update expression"; //getValueOfUpdateExpression(comp, varTable);

const getValueOfConditionalExpression = (cond: ConditionalExpression, varTable: VarTuple[]): Value =>
    valueExpressionToValue(cond.test, varTable) ? valueExpressionToValue(cond.consequent, varTable) :
    valueExpressionToValue(cond.alternate, varTable);

const getValOfMemberExpression = (memberExpression: MemberExpression, varTable: VarTuple[]): Value =>
    computeMemberExpression(memberExpression.object, valueExpressionToValue(memberExpression.property, varTable), varTable);

const computeMemberExpression = (obj: ArrayObject, property: Value, varTable: VarTuple[]): Value =>
    isNumber(property) ? (isArrayExpression(obj) ? valueExpressionToValue(obj.elements[property], varTable) : getValueOfArrIdentifier(obj, property, varTable)) :
        "error: no property " + property + " in array";

const getValueOfArrIdentifier = (obj: Identifier, property: number, varTable: VarTuple[]): Value =>
    getElementOfArr(getValueExpressionOfIdentifier(obj, varTable), property, varTable);

const getElementOfArr = (arr: ValueExpression, index: number, varTable: VarTuple[]): Value =>
    isArrayExpression(arr) ? valueExpressionToValue(arr.elements[index], varTable) :
    isIdentifier(arr) ? getValueOfArrIdentifier(arr, index, varTable) :
    "error: not an array";

const getValueOfBinaryExpression = (binaryExpression: BinaryExpression, varTable: VarTuple[]): Value =>
    performBinaryOp(valueExpressionToValue(binaryExpression.left, varTable), valueExpressionToValue(binaryExpression.right, varTable), binaryExpression.operator);

const performBinaryOp = (left: Value, right: Value, op: string): Value =>
    op === '+' ? performAddition(left, right) :
    isNumber(left) && isNumber(right) && isNumericOp(op) ? performNumericBinaryOp(left, right, op) :
    performBooleanEqBinaryOp(left, right, op);

const performAddition = (left: Value, right: Value): Value =>
    isArray(left) || isArray(right) ? "Undefined operation on arrays" :
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

const performNumericBinaryOp = (left: number, right: number, op: string) : Value =>
    op === '-' ? left - right :
    op === '*' ? left * right :
    op === '/' ? left / right :
    left ** right;

const getValueOfLogicalExpression = (logicalExpression: LogicalExpression, varTable: VarTuple[]): Value =>
    computeLogicalOperation(valueExpressionToValue(logicalExpression.left, varTable), valueExpressionToValue(logicalExpression.right, varTable), logicalExpression.operator);

const computeLogicalOperation = (left: Value, right: Value, op: string): Value =>
    isBoolean(left) && isBoolean(right) ? performLogicalOperation(left, right, op) :
    "error: " + op + " is undefined on non-booleans";

const performLogicalOperation = (left: boolean, right: boolean, op: string): Value =>
    op[0] === '&' ? left && right :
    left || right;

const getValueOfUnaryExpression = (unaryExpression: UnaryExpression, varTable: VarTuple[]): Value =>
    performUnaryOp(valueExpressionToValue(unaryExpression.argument, varTable), unaryExpression.operator);

const performUnaryOp = (val: Value, op: string): Value =>
    op === '!' ? (isBoolean(val) ? !val : "undefined operation: not on a non-boolean") :
    op === '-' ? -val :
    val;

/*const getValueOfUpdateExpression = (updateExpression: UpdateExpression, varTable: VarTuple[]): Value =>
    performUpdate(updateExpression, updateExpression.argument, updateExpression.operator, updateExpression.prefix, varTable);*/

/*const performUpdate = (updateExpression: UpdateExpression, assignable: Assignable, op: string, prefix: boolean, varTable: VarTuple[]): Value => { // Mutations due to changing varTable
    if (isIdentifier(assignable)) {
        let oldValue = valueExpressionToValue(assignable, varTable);
        if (isNumber(oldValue)) {
            let newValue = performUpdateOp(oldValue, op);
            updateVarTable(varTable, assignable, createBinaryExpression(op[0], replaceVarInIdentifier(assignable, assignable, varTable), createAtomicLiteralExpression(1), updateExpression.loc)); // Transform the update exp into a binary exp so it would not be calculated more than once
            return (prefix ? newValue : oldValue);
        }
        return "error: cannot update a non numeric value: " + oldValue;
    }
    else {
        let arr = assignable.object;
        let i = valueExpressionToValue(assignable.property, varTable);
        if (isNumber(i) && isIdentifier(arr)) {
            let oldValue = replaceVarInValueExpression(arr, getValueExpressionOfIdentifier(arr, varTable), varTable);
            if (isArrayExpression(oldValue)) {
                let newElements = oldValue.elements.map((v: ValueExpression, index: number): ValueExpression =>
                    index == i ? createBinaryExpression(updateExpression.operator[0], v, createAtomicLiteralExpression(1), updateExpression.loc) : v);
                let newArr = createArrayExpression(newElements, arr.loc);
                updateVarTable(varTable, arr, newArr);
                return (prefix) ? valueExpressionToValue(newElements[i], varTable) : valueExpressionToValue(oldValue.elements[i], varTable);
            }
        }
        return "error: not a valid array";
    }
}*/

const updateVarTable = (varTable: VarTuple[], id: Identifier, newValue: ValueExpression): void => { // Mutations due to changing varTable
    for (let i = 0; i < varTable.length; i++) {
        if (varTable[i].name == id.name) {
            varTable[i].value = newValue;
            return;
        }
    }
    varTable.push({name: id.name, value: newValue, isParam: false});
}

/*const performUpdateOp = (value: number, op: string): Value =>
    op === '++' ? value + 1 :
    value - 1;*/


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

const elseLine = {
    analyzedLine: {line: -1, type: "Else", name: '', condition: '', value: ''},
    value: 0
};

const copyArr = <T>(arr: T[]): T[] => JSON.parse(JSON.stringify(arr));

const replaceVarInValueExpression = (id: Identifier, valueExpression: ValueExpression, varTable: VarTuple[]): ValueExpression =>
    isIdentifier(valueExpression) ? replaceVarInIdentifier(id, valueExpression, varTable) :
    isLiteral(valueExpression) ? valueExpression :
    isComputationExpression(valueExpression) ? replaceVarsInComputationExpression(id, valueExpression, varTable) :
    isConditionalExpression(valueExpression) ? replaceVarsInConditionalExpression(id, valueExpression, varTable) :
    replaceVarInMemberExpression(id, valueExpression, varTable);

const replaceVarInIdentifier = (id: Identifier, replaceIn: Identifier, varTable: VarTuple[]): ValueExpression =>
    id.name == replaceIn.name ? getValueExpressionOfIdentifier(replaceIn, varTable) : replaceIn;

const replaceVarsInComputationExpression = (id: Identifier, comp: ComputationExpression, varTable: VarTuple[]): ValueExpression =>
    isBinaryExpression(comp) ? createBinaryExpression(comp.operator, replaceVarInValueExpression(id, comp.left, varTable),
        replaceVarInValueExpression(id, comp.right, varTable), comp.loc) :
    isLogicalExpression(comp) ? createLogicalExpression(comp.operator, replaceVarInValueExpression(id, comp.left, varTable),
        replaceVarInValueExpression(id, comp.right, varTable), comp.loc) :
    isUnaryExpression(comp) ? createUnaryExpression(comp.operator, replaceVarInValueExpression(id, comp.argument, varTable), comp.prefix, comp.loc) :
    comp;

const replaceVarInMemberExpression = (id: Identifier, memberExpression: MemberExpression, varTable: VarTuple[]): ValueExpression =>
    createMemberExpression(memberExpression.computed, replaceVarInMemberObject(id, memberExpression.object, varTable),
        replaceVarInValueExpression(id, memberExpression.property, varTable), memberExpression.loc);

const replaceVarInMemberObject = (id: Identifier, obj: ArrayObject, varTable: VarTuple[]): ArrayObject =>
    isArrayExpression(obj) ? (obj.elements.length > 0 ?
        createArrayExpression(obj.elements.map((v: ValueExpression): ValueExpression =>
            replaceVarInValueExpression(id, v, varTable)), obj.loc) :
        createArrayExpression([], obj.loc)):
    valueExpressionToArrObject(replaceVarInIdentifier(id, obj, varTable));

const valueExpressionToArrObject = (valueExpression: ValueExpression): ArrayObject =>
    isArrayObject(valueExpression) ? valueExpression :
    createArrayExpression([], valueExpression.loc); // Error: not an array

const replaceVarsInConditionalExpression = (id: Identifier, cond: ConditionalExpression, varTable: VarTuple[]): ValueExpression =>
    createConditionalExpression(replaceVarInValueExpression(id, cond.test, varTable),
        replaceVarInValueExpression(id, cond.consequent, varTable), replaceVarInValueExpression(id, cond.alternate, varTable), cond.loc);

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
    isExpressionStatement(exp) ? substituteExpressionStatement(exp, varTable).concat(substituteExpression(exp.expression, varTable)) :
    isIfStatement(exp) ? substituteIfStatement(exp, varTable) :
    substituteLoopStatement(exp, varTable);

const substituteFunctionDeclaration = (func: FunctionDeclaration, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(func, 0, varTable)].concat(getValuedLinesOfBody(func.body, varTable));

const substituteValueExpression = (exp: ValueExpression, varTable: VarTuple[]): ValuedLine[] =>  {
    [analyzedLineToValuedLine(exp, 0, varTable)];
    return NO_LINES;
}

const substituteExpressionStatement = (exp: ExpressionStatement, varTable: VarTuple[]): ValuedLine[] => {
    [analyzedLineToValuedLine(exp, 0, varTable)];
    return NO_LINES;
}

/*const substituteUpdateExpression = (updateExpression: UpdateExpression, varTable: VarTuple[]): ValuedLine[] => { // Mutation due to chancing varTable
    let arg = updateExpression.argument;
    let ret = [analyzedLineToValuedLine(updateExpression, 0, varTable)];
    if (isIdentifier(arg)) {
        if (isVarParam(arg, varTable))
            return ret;
    }
    else {
        let obj = arg.object;
        if (isIdentifier(obj) && isVarParam(obj, varTable))
            return ret;
    }
    return NO_LINES;
}*/

const getValuedLinesOfBody = (body: Body, varTable: VarTuple[]): ValuedLine[] =>
    (isExpression(body) ? substituteExpression(body, copyArr(varTable)) :
    (body.body.length > 0 ?
        body.body.map(getSubstituteExpFunc(copyArr(varTable))).reduce(concatValuedLines) :
        [])).concat([closeBlockLine]);

const substituteIfStatement = (ifStatement: IfStatement, varTable: VarTuple[]): ValuedLine[] =>
    ifStatement.alternate != null ? [analyzedLineToValuedLine(ifStatement, valueExpressionToValue(ifStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(ifStatement.consequent, varTable))
        .concat([elseLine]).concat(getValuedLinesOfBody(ifStatement.alternate, varTable)) :
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

const substituteForStatement = (forStatement: ForStatement, varTable: VarTuple[]): ValuedLine[] => {
    if (isVariableDeclaration(forStatement.init))
        substituteVariableDeclaration(forStatement.init, varTable); // Add declaration to var table
    return [analyzedLineToValuedLine(forStatement, valueExpressionToValue(forStatement.test, varTable), varTable)].concat(getValuedLinesOfBody(forStatement.body, varTable));
}

const substituteVariableDeclaration = (varDeclaration: VariableDeclaration, varTable: VarTuple[]): ValuedLine[] => { // Mutations due to changing varTable
    for (let i = 0; i < varDeclaration.declarations.length; i++) {
        updateVarTable(varTable, varDeclaration.declarations[i].id, (varDeclaration.declarations[i].init == null ? createAtomicLiteralExpression(0) : varDeclaration.declarations[i].init));
    }
    return NO_LINES;
}

const substituteAssignmentExpression = (assignmentExpression: AssignmentExpression, varTable: VarTuple[]): ValuedLine[] => // Mutation due to changing varTable
    assignmentExpression.operator != '=' ?
        substituteAssignmentExpression(createAssignmentExpression('=', assignmentExpression.left,
            createBinaryExpression(assignmentExpression.operator[0], assignmentExpression.left, assignmentExpression.right,
                assignmentExpression.loc), assignmentExpression.loc), varTable) :
    substituteAssginmentIdOrArr(assignmentExpression, assignmentExpression.left, varTable);

const substituteAssginmentIdOrArr = (assignmentExpression: AssignmentExpression, left: Assignable, varTable: VarTuple[]): ValuedLine[] =>
    isIdentifier(left) ? substituteIdentifierAssignment(assignmentExpression, left, varTable) :
    substituteArrayAssignment(assignmentExpression, left, varTable);

const substituteIdentifierAssignment = (assignmentExpression: AssignmentExpression, left: Identifier, varTable: VarTuple[]): ValuedLine[] => {
    let newValue: ValueExpression = replaceVarInValueExpression(left, assignmentExpression.right, varTable);
    updateVarTable(varTable, left, newValue);
    return (isVarParam(left, varTable) ? [analyzedLineToValuedLine(assignmentExpression, 0, varTable)] : NO_LINES);
}

const replaceElement = (arr: ArrayExpression, index: number, newElement: ValueExpression): ArrayExpression =>
    createArrayExpression(arr.elements.map((v: ValueExpression, curr: number): ValueExpression => curr == index ? newElement : v), arr.loc);

const substituteArrayAssignment = (assignmentExpression: AssignmentExpression, left: MemberExpression, varTable: VarTuple[]): ValuedLine[] => {
    let id = left.object;
    if (isArrayExpression(id))
        return NO_LINES;
    else {
        let arr: ArrayExpression = extractArrayExpression(left.object, varTable);
        let index = extractNumber(valueExpressionToValue(left.property, varTable));
        let newArr = replaceElement(arr, index, replaceVarInValueExpression(id, assignmentExpression.right, varTable));
        updateVarTable(varTable, id, newArr);
        return [analyzedLineToValuedLine(assignmentExpression, valueExpressionToValue(newArr, varTable), varTable)];
    }
}

const extractArrayExpression = (arr: ValueExpression, varTable: VarTuple[]): ArrayExpression =>
    isArrayExpression(arr) ? arr :
    isIdentifier(arr) ? extractArrayExpression(getValueExpressionOfIdentifier(arr, varTable), varTable) :
    createArrayExpression([], getBlankLocation()); // Create an empty array

const extractNumber = (v: Value): number =>
    isNumber(v) ? v : 0;

const substituteReturnStatement = (returnStatement: ReturnStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(returnStatement, valueExpressionToValue(returnStatement.argument, varTable), varTable)];

const substituteBreakStatement = (b: BreakStatement, varTable: VarTuple[]): ValuedLine[] =>
    [analyzedLineToValuedLine(b, 0, varTable)]

const getSubstituteExpFunc = (varTable: VarTuple[]) =>
    (exp: Expression) =>
        substituteExpression(exp, varTable);

const concatValuedLines = (previous: ValuedLine[], current: ValuedLine[]) => previous.concat(current);

const substituteProgram = (program: Program, varTable: VarTuple[]): ValuedLine[] =>
    program.body.length > 0 ? program.body.map(getSubstituteExpFunc(varTable)).reduce(concatValuedLines) : [];


export {parseParams, substituteProgram};