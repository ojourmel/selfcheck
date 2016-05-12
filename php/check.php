<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

$dao = realpath(dirname(__FILE__)) . "/dao.php";
require_once($dao);

$checks = new checks();

if ($_SERVER['REQUEST_METHOD'] == 'GET'){
    if (isset($_GET['id'])) {
        checkShow($_GET['id'], null);
    } else {
        checkList();
    }

} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ((isset($_GET['id'])) && (isset($_GET['id']) != '')) {
        if ((isset($_GET['update'])) && ($_GET['update'] == 'true')) {
            checkUpdate($_GET['id']);
        }
        if ((isset($_GET['toggle'])) && ($_GET['toggle'] == 'active')) {
            checkToggle($_GET['id']);
        }
    } else {
        checkCreate();
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if ((isset($_GET['id'])) && $_GET['id'] != '') {
        checkDestroy($_GET['id']);
    }
}

/* GET /php/check
 *
 */
function checkList() {
    global $checks;
    echo json_encode($checks->all());
}

/* GET /php/check?id=:id
 *
 */
function checkShow($id)
{
    global $checks;

    if ((!isset($id)) && ($id == '')){
        header("HTTP/1.0 404 Not Found");
        return;
    }

    if($id >= count($checks->all())){
        header("HTTP/1.0 404 Not Found");
        return;
    }

    echo json_encode($checks->get($id));
}

/* POST /php/check
 *
 */
function checkCreate()
{
    global $checks;
    $id = count($checks->all());
    $time = $_POST['time'];
    $env = $_POST['env'];
    $body = str_replace("\r", "", $_POST['body']);
    $active = $_POST['active'];

    $c = new check($id, "$id.sc", $time, $active, $env, $body);
    $checks->add($c);

    if ($checks->isActive($id)) {
        $checks->enable($id);
    } else {
        $checks->disable($id);
    }

    echo "$id";
}

/* POST /php/check?id=:id&update=true
 *
 */
function checkUpdate($id)
{
    global $checks;
    if ((isset($id)) && ($id != '') && ($id < count($checks->all()))) {
        $time = $_POST['time'];
        $env = $_POST['env'];
        $body = str_replace("\r", "", $_POST['body']);
        $active = $_POST['active'];

        $checks->get($id)->time = $time;
        $checks->get($id)->env = $env;
        $checks->get($id)->body = $body;
        $checks->get($id)->active = $active;

        if ($checks->isActive($id)) {
            $checks->enable($id);
        } else {
            $checks->disable($id);
        }

        $checks->write($checks->get($id));
        return;
    }
    header("HTTP/1.0 404 Not Found");
}

/* POST /php/check?id=:id&toggle=active
 *
 */
function checkToggle($id)
{
    global $checks;
    if ((isset($id)) && ($id != '') && ($id < count($checks->all()))) {

        if ($checks->isActive($id)) {
            $checks->disable($id);
        } else {
            $checks->enable($id);
        }
        $checks->write($checks->get($id));
        return;
    }
    header("HTTP/1.0 404 Not Found");
}

/* DELETE /php/check?id=:id
 *
 */
function checkDestroy($id)
{
    global $checks;
    $checks->remove($id);
}
