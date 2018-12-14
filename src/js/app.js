import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {constructTable} from './html-visualisation';
import {parseParams, valueExpressionToValue} from './code-substitutor';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let params = $('#params').val();

        let parsedParams = parseParams(params);
        $('#substitutedCode').val(valueExpressionToValue(parsedCode.body[0].expression, parsedParams));
        //$('#substitutedCode').val(JSON.stringify(parsedCode.body[0].expression, null, 2));
        document.getElementById('tblDiv').innerHTML = constructTable(parsedCode);
    });
});
