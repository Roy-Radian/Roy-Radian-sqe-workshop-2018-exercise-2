import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {constructTable} from './html-visualisation';
import {parseParams} from './code-substitutor';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let params = $('#params').val();

        document.getElementById('tblDiv').innerHTML = constructTable(parsedCode);
    });
});
