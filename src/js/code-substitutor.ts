import {isBinaryExpression, isIdentifier, isLiteral, ValueExpression} from "./expression-analyzer";

type Value = number | string | boolean;

const falseLiteral = 'false';
const trueLiteral = 'true';

const isNumericString = (x: string) : boolean => !isNaN(Number(x));
const isBooleanString = (x: string): boolean => x.toLowerCase() === falseLiteral || x.toLowerCase() == trueLiteral;

const stringToValue = (str: string): Value =>
    isNumericString(str) ? Number(str) :
    isBooleanString(str) ? Boolean(str) :
    str;

const paramToValueTuple = (param: string): [string, Value] =>
    [param.trim().split('=')[0], stringToValue(param.trim().split('=')[1])];

const parseParams = (paramsTxt: string): [string, Value][] =>
    paramsTxt.split(',').map(paramToValueTuple);

/*const valueExpressionToValue = (v: ValueExpression, constTable: [string, Value]): Value =>
    isLiteral(v) ? stringToValue(v.value) :
    isIdentifier(v) ? getValueOfIdentifier(v.name, constTable) :
    isBinaryExpression(v) ? getValueOfBinaryExpression(v.name, constTable)*/