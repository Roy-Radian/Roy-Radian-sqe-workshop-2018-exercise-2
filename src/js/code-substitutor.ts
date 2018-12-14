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
    UpdateExpression, Assignable, Identifier
} from "./Expression-Types";

type Value = number | string | boolean;

const isNumber = (x: Value): x is number => (typeof x) === "number";

const falseLiteral = 'false';
const trueLiteral = 'true';

const isNumericString = (x: string) : boolean => !isNaN(Number(x));
const isBooleanString = (x: string): boolean => x.toLowerCase() === falseLiteral || x.toLowerCase() == trueLiteral;

const stringToValue = (str: string): Value =>
    isNumericString(str) ? Number(str) :
    isBooleanString(str) ? Boolean(str) :
    str;

interface VarTuple {
    name: string;
    value: Value;
}

const paramToValueTuple = (param: string): VarTuple =>
    [{name: param.trim().split('=')[0], value: stringToValue(param.trim().split('=')[1])}][0];

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
    isNumber(left) && isNumber(right) && isNumericOp(op) ? performNumericBinaryOp(left, right, op) :
    performBooleanBinaryOp(left, right, op);

const isNumericOp = (op: string): boolean =>
   ['+', '-', '*', '/', '**'].indexOf(op) != -1;

const performBooleanBinaryOp = (left: Value, right: Value, op: string): Value =>
    op === '>' ? left > right :
    op === '<=' ? left <= right :
    op === '<' ? left < right :
    op === '<=' ? left < right :
    op === '==' ? left == right :
    left === right;

const performNumericBinaryOp = (left: Value, right: Value, op: string) : Value =>
    op === '+' ? left + right :
    op === '-' ? left - right :
    op === '*' ? left * right :
    op === '/' ? left / right :
    left ** right;

const getValueOfUnaryExpression = (unaryExpression: UnaryExpression, varTable: VarTuple[]): Value =>
    performUnaryOp(valueExpressionToValue(unaryExpression.argument, varTable), unaryExpression.operator);

const performUnaryOp = (val: Value, op: string): Value =>
    op === '!' ? !val :
    op === '-' ? -val :
    val;

const getValueOfUpdateExpression = (updateExpression: UpdateExpression, varTable: VarTuple[]): Value =>
    performUpdate(updateExpression.argument, updateExpression.operator, updateExpression.prefix, varTable);

const performUpdate = (assignable: Assignable, op: string, prefix: boolean, varTable: VarTuple[]): Value => {
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

const updateVarTable = (varTable: VarTuple[], id: Identifier, newValue: Value): void => {
    for (let i = 0; i < varTable.length; i++) {
        if (varTable[i].name === id.name)
            varTable[i].value = newValue;
    }
}

const performUpdateOp = (value: number, op: string): Value =>
    op === '++' ? value + 1 :
    value - 1;


export {valueExpressionToValue, parseParams}; // To be able to test getting value of expressions

// TODO: support spaces in input vector (e.g x = 3)
// TODO: fix binary operations on non numbers
// TODO: fix unary operations on non numbers