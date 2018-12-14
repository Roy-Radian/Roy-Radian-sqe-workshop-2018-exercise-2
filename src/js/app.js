import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {constructTable} from './html-visualisation';
import {parseParams, valueExpressionToValue} from './code-substitutor';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        //$('#substitutedCode').val(JSON.stringify(parsedCode.body[0].expression, null, 2));
        $('#substitutedCode').val(JSON.stringify(parsedCode, null, 2));
        document.getElementById('tblDiv').innerHTML = constructTable(parsedCode);
    });
});
