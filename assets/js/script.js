/**
 * Created by hayk on 28/02/2017.
 */

var URL = "https://www.foaas.com/";
var initOptions = function() {
    $.ajax({
        url: URL + "operations",
        dataType: "json"
    }).done(function (data) {
        fillOptions(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    });
};

var fillOptions = function(data){
    data.forEach(function (obj, key) {
        if (obj.url.includes("deraadt")) {
            data[key].name = "Deraadt";
        }
        if (obj.url.includes("version")) {
            data.splice(key, 1);
            return;
        }
        $("#options").append('<option value="' + obj.url.split('/')[1] + '"'
            + generateOptionDataFields(obj.fields) + '>' + obj.name + '</option>');
    });
};

var generateOptionDataFields = function (fields) {
    var dataFields = 'data-fields="';
    fields.forEach(function (field) {
        dataFields += field.name + '/'
    });
    return dataFields + '"';
};

var sendRequest = function (path) {
    $.ajax({
        url: URL + path,
        dataType: "json"
    }).done(function (data) {
        fuckIt(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    })
};

var fuckIt = function (data) {
    $('#data-message p').html(data.message);
    $('#data-message footer').html(data.subtitle.replace('- ', ''));
    $('#messageModal').modal('show');
};

var loadFields = function (e) {
    var $dataFields = $('#data-fields');
    $dataFields.empty();
    var fieldsPath = $("#options option:selected").attr('data-fields');
    var fields = fieldsPath.split('/');
    fields.pop();
    fields.forEach(function (field) {
        var $input = $('<input type="text" placeholder="' + field + '"' +
            ' class="form-control" id="' + field + '" name="' + field + '" +' +
            ' required="required"/>');
        var $formGroup = $('<p>').addClass('form-group').append($input);
        $dataFields.append($formGroup);
    });
    $('#btn-fuck').attr("data-fuck", fieldsPath);
};

var processRequest = function (e) {
    if ($('form')[0].checkValidity()) {
        $('#prepModal').modal('hide');
        var path = $(this).attr('data-fuck');

        var fields = path.split("/");
        fields.pop();
        fields.forEach(function (field) {
            path = path.replace(field, $('#' + field).val());
        });
        path =  $('#options option:selected').val() + '/' + path;
        sendRequest(path);
    }
};

var preventSubmit = function (e) {
    e.preventDefault();
};

var init = function () {
    initOptions();
    $('#go').on('click', loadFields);
    $('#btn-fuck').on('click', processRequest);
    $('form').on('submit', preventSubmit);
};

$(document).ready(init);