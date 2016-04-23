/*
 * @author ojourmel
 *
 */

function startClock() {
    var t = new Date();
    var h = leftpad(t.getHours(),"00");
    var m = leftpad(t.getMinutes(),"00");
    var s = leftpad(t.getSeconds(),"00");

    var mn = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var dn = ["Sunday","Monday","Tueday","Wedday","Thuday","Friday","Satday"];

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

function toggleFocusClock()
{
    if ($('#clock').hasClass( 'active' )) {
        $('#clock').removeClass('active inverted');
    } else {
        $('#clock').addClass('active inverted');
    }
}

function toggleCheck(event)
{
    var d = event.target;
    if (d.id == '') {
        d = d.parentNode;
    }

    if ($(d).hasClass( 'active' )) {
        $(d).removeClass('active');
    } else {
        $(d).addClass('active');
    }
}

function settings()
{
    $('#settingsmodal').modal('show');
}

function editCheck(event)
{
    var d = event.target.parentNode.parentNode;
    var id = "#" + d.id + "edit";
    $(id).modal('show');
}

function deleteCheck(event)
{
    var d = event.target.parentNode.parentNode;
    var id = "#" + d.id + "delete";
    $(id).modal('show');
}

function addCheck()
{
    $('#checkadd').modal('show');
}
