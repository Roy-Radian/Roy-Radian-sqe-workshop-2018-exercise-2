import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {constructTable} from './html-visualisation';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        document.getElementById('tblDiv').innerHTML = constructTable(parsedCode);
    });
});
