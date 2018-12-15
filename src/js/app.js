import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {constructTable, constructSubstitution} from './html-visualisation';
//import {parseParams, valueExpressionToValue} from './code-substitutor'; // To test value calculations

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let params = $('#params').val();

        /*let parsedParams = parseParams(params);
        $('#substitutedCode').val(String(valueExpressionToValue(parsedCode.body[0].expression, parsedParams)))*/ // To test value calculations

        //$('#substitutedCode').val(JSON.stringify(parsedCode, null, 2)); // Show parsed code
        document.getElementById('substitutedCode').innerHTML = constructSubstitution(parsedCode, params);

        document.getElementById('tblDiv').innerHTML = constructTable(parsedCode);
    });
});
