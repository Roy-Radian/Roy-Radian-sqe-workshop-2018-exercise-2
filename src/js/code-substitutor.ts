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
    CompoundExpression, isExpressionStatement, LoopStatement, isWhileStatement, isDoWhileStatement
} from "./Expression-Types";

type Value = number | string | boolean;

const isNumber = (x: Value): x is number => (typeof x) === "number";
const isString = (x: Value): x is string => (typeof x) === "string";
const isBoolean = (x: Value) : x is boolean => (typeof x) === "boolean";

const falseLiteral = 'false';
const trueLiteral = 'true';

const isNumericString = (x: string) : boolean => !isNaN(Number(x));
const isBooleanString = (x: string): boolean => x.toLowerCase() === falseLiteral || x.toLowerCase() == trueLiteral;

const stringToValue = (str: string): Value =>
    isNumericString(str) ? Number(str) :
    isBooleanString(str) ? str === "true" :
    str.replace(/"/g, '');

interface VarTuple {
    name: string;
    value: Value;
}

const paramToValueTuple = (param: string): VarTuple =>
    ({name: param.trim().split('=')[0].trim(), value: stringToValue(param.trim().split('=')[1].trim())});

const parseParams = (paramsTxt: string): VarTuple[] =>
    paramsTxt.split(',').map(paramToValueTuple);

const valueExpressionToValue = (v: ValueExpression, varTable: VarTuple[]): Value =>
    isLiteral(v) ? stringToValue(v.value) :
    isIdentifier(v) ? getValueOfIdentifier(v, varTable) :
    isComputationExpression(v) ? getValueOfComputationExpression(v, varTable) :
    isConditionalExpression(v) ? getValueOfConditionalExpression(v, varTable) :
    getValOfMemberExpression(v, varTable);

const getValueOfIdentifier = (id: Identifier, varTable: VarTuple[]): Value =>
    varTable.length == 0 ? "" :
    varTable[0].name === id.name ? varTable[0].value :
    getValueOfIdentifier(id, varTable.slice(1));

const getValueOfComputationExpression = (comp: ComputationExpression, varTable: VarTuple[]): Value =>
    isBinaryExpression(comp) ? getValueOfBinaryExpression(comp, varTable) :
    isUnaryExpression(comp) ? getValueOfUnaryExpression(comp, varTable) :
    getValueOfUpdateExpression(comp, varTable);

const getValueOfConditionalExpression = (cond: ConditionalExpression, varTable: VarTuple[]): Value =>
    valueExpressionToValue(cond.test, varTable) ? valueExpressionToValue(cond.consequent, varTable) :
    valueExpressionToValue(cond.alternate, varTable);

const getValOfMemberExpression = (memberExpression: MemberExpression, varTable: VarTuple[]): Value =>
    "unsupported: array";

const getValueOfBinaryExpression = (binaryExpression: BinaryExpression, varTable: VarTuple[]): Value =>
    performBinaryOp(valueExpressionToValue(binaryExpression.left, varTable), valueExpressionToValue(binaryExpression.right, varTable), binaryExpression.operator);

const performBinaryOp = (left: Value, right: Value, op: string): Value =>
    op === '+' ? performAddition(left, right) :
    isNumber(left) && isNumber(right) && isNumericOp(op) ? performNumericBinaryOp(left, right, op) :
    performBooleanBinaryOp(left, right, op);

const performAddition = (left: Value, right: Value): Value =>
    isString(left) ? left + right :
    isString(right) ? left + right :
    isBoolean(left) || isBoolean(right) ? "undefined operation + between booleans" :
    left + right;

const isNumericOp = (op: string): boolean =>
   ['-', '*', '/', '**'].indexOf(op) != -1;

const performBooleanBinaryOp = (left: Value, right: Value, op: string): Value =>
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

const getValueOfUnaryExpression = (unaryExpression: UnaryExpression, varTable: VarTuple[]): Value =>
    performUnaryOp(valueExpressionToValue(unaryExpression.argument, varTable), unaryExpression.operator);

const performUnaryOp = (val: Value, op: string): Value =>
    op === '!' ? (isBoolean(val) ? !val : "undefined operation: not on a non-boolean") :
    op === '-' ? -val :
    val;

const getValueOfUpdateExpression = (updateExpression: UpdateExpression, varTable: VarTuple[]): Value =>
    performUpdate(updateExpression.argument, updateExpression.operator, updateExpression.prefix, varTable);

const performUpdate = (assignable: Assignable, op: string, prefix: boolean, varTable: VarTuple[]): Value => { // Mutations due to changing varTable
    if (isIdentifier(assignable)) {
        let oldValue = valueExpressionToValue(assignable, varTable);
        if (isNumber(oldValue)) {
            if (prefix)
                updateVarTable(varTable, assignable, performUpdateOp(oldValue, op));

            let returnValue = getValueOfIdentifier(assignable, varTable);

            if (!prefix)
                updateVarTable(varTable, assignable, performUpdateOp(oldValue, op));

            return returnValue;
        }
        return "error: cannot update a non numeric value: " + oldValue;
    }
    else
        return "unsupported: array";
}

const updateVarTable = (varTable: VarTuple[], id: Identifier, newValue: Value): void => { // Mutations due to changing varTable
    for (let i = 0; i < varTable.length; i++) {
        if (varTable[i].name === id.name)
            varTable[i].value = newValue;
    }
}

const performUpdateOp = (value: number, op: string): Value =>
    op === '++' ? value + 1 :
    value - 1;


const substituteExpression = (exp: Expression, varTable: VarTuple[]): Expression =>
    isAtomicExpression(exp) ? substituteAtomicExpression(exp, varTable) :
    substituteCompoundExpression(exp, varTable);

const substituteAtomicExpression = (exp: AtomicExpression, varTable: VarTuple[]): Expression =>
    isVariableDeclaration(exp) ? substituteVariableDeclaration(exp, varTable) :
    isAssignmentExpression(exp) ? substituteAssignmentExpression(exp, varTable) :
    isReturnStatement(exp) ? substituteReturnStatement(exp, varTable) :
    substituteBreakStatement(exp, varTable);

const substituteCompoundExpression = (exp: CompoundExpression, varTable: VarTuple[]): Expression =>
    isValueExpression(exp) ? substituteValueExpression(exp, varTable) :
    isExpressionStatement(exp) ? substituteExpression(exp.expression, varTable) :
    isLoopStatement(exp) ? substituteLoopStatement(exp, varTable) :
    substituteIfStatement(exp, varTable);

const substituteValueExpression = (exp: ValueExpression, varTable: VarTuple[]): Expression =>
    isLiteral(exp) ? exp :
    isIdentifier(exp) ? substituteIdentifier(exp, varTable) :
    isComputationExpression(exp) ? substituteComputationExpression(exp, varTable) :
    isConditionalExpression(exp) ? substituteConditionalExpression(exp, varTable) :
    substituteMemberExpression(exp, varTable);

const substituteLoopStatement = (loopStatement: LoopStatement, varTable: VarTuple[]): Expression =>
    isWhileStatement(loopStatement) ? substituteWhileStatement(loopStatement, varTable) :
    isDoWhileStatement(loopStatement) ? substituteDoWhileStatement(loopStatement, varTable) :
    substituteForStatement(loopStatement, varTable);

const getSubstituteExpFunc = (varTable: VarTuple[]) =>
    (exp: Expression) =>
        substituteExpression(exp, varTable);

const substituteProgram = (program: Program, varTable: VarTuple[]): Program =>
    ({type: "Program", body: program.body.map(getSubstituteExpFunc(varTable))});

// TODO: implement all unimplemented functions
/* TODO: should I support arrays? If so I need to:
*          * Support ArrayExpression as a value expression
*          * Somehow support array values in input vector
*          * Support arrays in value calculations
*/