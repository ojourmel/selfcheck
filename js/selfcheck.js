/*
 * @author ojourmel
 *
 */

var CHECKS = [
        {
            id: 0,
            time: '',
            env: '',
            body: '',
            active: false
        }
    ];

function startClock() {
    var t = new Date();
    var h = leftpad(t.getHours(),"00");
    var m = leftpad(t.getMinutes(),"00");
    var s = leftpad(t.getSeconds(),"00");

    var mn = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var dn = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    var day = dn[t.getDay()];
    var mon = mn[t.getMonth()];
    var d = leftpad(t.getDate(),"00");
    var y = t.getFullYear();

    document.getElementById('clock').innerHTML = h+":"+m+":"+s;
    document.getElementById('date').innerHTML = day +", "+mon+" "+d+", "+y;
    setTimeout(startClock, 500);
}

function leftpad(v, p) {
    v = v.toString();
    p = p.toString();
    return (p.substring(0, (p.length - v.length)) + v);
}

function getRelPath() {
    var p = window.location.href.split('/');
    p.splice(-1,1);
    return p.join('/');
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 * @see http://stackoverflow.com/a/35385518
 */
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function toggleFocus(event) {
    var elm = event.target;
    if ($(elm).hasClass( 'active' )) {
        $(elm).removeClass('active inverted');
    } else {
        $(elm).addClass('active inverted');
    }
}

function toggleCheck(event) {
    d = $(event.target).closest('.checkitem')[0];

    if(d != null) {
        if ($(d).hasClass( 'active' )) {
            $(d).removeClass('active');
            CHECKS[d.id].active = 'inactive';
        } else {
            $(d).addClass('active');
            CHECKS[d.id].active = 'active';
        }

        $.ajax({
            url: getRelPath() + '/php/check.php?id=' + d.id + '&toggle=active' ,
            type: 'POST'
        });
    }
}

function addCheck(check) {
    var row = document.createElement('div');
    row.id = check.id;
    row.className = 'ui row selection checkitem';
    row.onclick = function () { toggleCheck(event); };

    var time = document.createElement('div');
    time.className = 'time ui three wide column text-center text-large large-padding tt';
    time.innerHTML = check.time;

    var e = document.createElement('div');
    e.className = 'ui one wide column';
    var eicon = document.createElement('i');
    eicon.className = 'force-btn big options icon';
    eicon.onclick = function () { editCheckModal(event); };
    e.appendChild(eicon);

    var d = document.createElement('div');
    d.className = 'ui one wide column';
    var dicon = document.createElement('i');
    dicon.className = 'force-btn big remove icon';
    dicon.onclick = function () { deleteCheckModal(event); };
    d.appendChild(dicon);

    row.appendChild(time);
    row.appendChild(e);
    row.appendChild(d);

    if (check.active == 'active') {
        row.className += ' active';
    }

    var checklist = document.getElementById('checklist');
    checklist.appendChild(row);

    CHECKS[check.id] = check;
}

function settings() {
    $('#settingsmodal').modal('show');
}

function editCheckModal(event) {
    event.stopPropagation();
    var d = event.target.parentNode.parentNode;
    var check = CHECKS[d.id];

    $('#checkmodal #time').removeClass('disabled');
    $('#checkmodal #time input').val(check.time);
    fillEnv($('#checkmodal #env'));
    $('#checkmodal #env').removeClass('disabled');
    $('#checkmodal #env input').val(check.env);
    $('#checkmodal #env .text').html(check.env);
    $('#checkmodal #env .text').removeClass('default');
    $('#checkmodal .negative').html('Cancel');
    $('#checkmodal .positive').html('Save');

    var text = CodeMirror.fromTextArea(document.getElementById('codetextarea'), {
        lineNumbers: true,
        mode: 'shell'
    });

    text.setValue(check.body);


    $('#checkmodal').modal({
        closable  : false,
        onDeny    : function(){
            text.toTextArea();
            text.setValue('');
        },
        onApprove : function() {
            text.toTextArea();
            $('#checkmodal #body #codetextarea').html(text.getValue());
            editCheckSubmit(check.id);
        }
    })
    .modal('show');

    text.refresh();
}

function deleteCheckModal(event) {
    event.stopPropagation();
    var d = event.target.parentNode.parentNode;
    var check = CHECKS[d.id];

    $('#checkmodal #time').addClass('disabled');
    $('#checkmodal #time input').val(check.time);
    fillEnv($('#checkmodal #env'));
    $('#checkmodal #env').addClass('disabled');
    $('#checkmodal #env input').val(check.env);
    $('#checkmodal #env .text').html(check.env);
    $('#checkmodal #env .text').removeClass('default');
    $('#checkmodal .negative').html('Cancel');
    $('#checkmodal .positive').html('Delete');

    var text = CodeMirror.fromTextArea(document.getElementById('codetextarea'), {
        lineNumbers: true,
        mode: 'shell',
        readOnly: 'true'
    });

    text.setValue(check.body);

    $('#checkmodal').modal({
        closable  : false,
        onDeny    : function(){
            text.toTextArea();
        },
        onApprove : function() {
            text.toTextArea();
            deleteCheckSubmit(check.id);
        }
    })
    .modal('show');

    text.refresh();
}

function addCheckModal() {
    $('#checkmodal #time').removeClass('disabled');
    $('#checkmodal #time input').val('');
    fillEnv($('#checkmodal #env'));
    $('#checkmodal #env').removeClass('disabled');
    $('#checkmodal #env input').val('/bin/sh');
    $('#checkmodal #env .text').html('/bin/sh');
    $('#checkmodal #env .text').addClass('default');
    $('#checkmodal #body #codetextarea').html('');

    $('#checkmodal .negative').html('Cancel');
    $('#checkmodal .positive').html('Add');
    var text = CodeMirror.fromTextArea(document.getElementById('codetextarea'), {
        lineNumbers: true,
        mode: 'shell'
    });

    text.setValue('');

    $('#checkmodal').modal({
        closable  : false,
        onDeny    : function(){
            text.toTextArea();
        },
        onApprove : function() {
            text.toTextArea();
            $('#checkmodal #body #codetextarea').html(text.getValue());
            addCheckSubmit();
        }
    })
    .modal('show');

    text.refresh();
}

function editCheckSubmit(id) {
    CHECKS[id].time = $('#checkmodal #time input').val();
    CHECKS[id].env = $('#checkmodal #env input').val();
    CHECKS[id].body = $('#checkmodal #body #codetextarea').html();
    CHECKS[id].active = 'active';

    var fd = new FormData();
    fd.append('time', CHECKS[id].time);
    fd.append('env', CHECKS[id].env);
    fd.append('body', CHECKS[id].body);
    fd.append('active', CHECKS[id].active);

    $.ajax({
        url: getRelPath() + '/php/check.php?id=' + id + '&update=true',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
            $('#' + id).addClass('active');
            $('#' + id + ' .time').html(CHECKS[id].time);
        }
    });
}

function deleteCheckSubmit(id) {
    $.ajax({
        url: getRelPath() + '/php/check.php?id=' + id,
        type: 'DELETE',
        success: function(data){
            CHECKS.splice(id,1);

            /*
             * Use same deletion algorithm as php/dao.php
             * checks->remove()
             * This is done to maintain consistency between
             * array indexes and file names
             */
            for (var i=id; i<CHECKS.length; i++){
                CHECKS[i].id = i;
                document.getElementById(i+1).id = i;
            }

            $('#' + id).remove();
        }
    });
}

function addCheckSubmit() {
    var check = {};
    check.time = $('#checkmodal #time input').val();
    check.env = $('#checkmodal #env input').val();
    check.body = $('#checkmodal #body #codetextarea').html();
    check.active = 'active';

    var fd = new FormData();
    fd.append('time', check.time);
    fd.append('env', check.env);
    fd.append('body', check.body);
    fd.append('active', check.active);

    $.ajax({
        url: getRelPath() + '/php/check.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
            check.id = parseInt(data);
            addCheck(check);
        }
    });
}

function fillEnv( dropdown ) {
    $.ajax({
        url: getRelPath() + '/php/system.php?env=true',
        type: 'GET',
        success: function(data){
            var envs = JSON.parse(data);
            dropdown.children('.menu').children().remove();

            for (var i=0; i<envs.length; i++) {
                var item = document.createElement('div');
                item.className = 'item';
                item.setAttribute('data-value',envs[i]);
                item.innerHTML = envs[i];
                dropdown.children('.menu')[0].appendChild(item);
            }
        }
    });
}
