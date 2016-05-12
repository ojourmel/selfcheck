<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

$dao = realpath(dirname(__FILE__)) . "/dao.php";
require_once($dao);

if ($_SERVER['REQUEST_METHOD'] == 'GET'){
    if (isset($_GET['env'])) {
        envList();
    }
}

function envList()
{
    echo json_encode(['/bin/sh', '/bin/bash', '/bin/zsh', '/usr/bin/perl']);
}

/*
 * Depends on cron to implement check items
 *
 */
function activate($check, $script)
{
    $time = date_parse($check->time);
    $hour = str_pad($time["hour"], 2, "0", STR_PAD_LEFT);
    $min = str_pad($time["minute"], 2, "0", STR_PAD_LEFT);

    $job = "echo '$min $hour * * * $script'";
    $cron = "(crontab -l 2>&1 | grep -v 'no crontab' | grep -v '$script'; $job) 2>&1 | grep -v 'no crontab' | sort - | uniq - | crontab -";

    system($cron);
    return true;
}

function deactivate($check, $script)
{
    $cron = "(crontab -l) 2>&1 | grep -v 'no crontab' | grep -v '$script' | sort - | uniq - | crontab -";
    system($cron);
}

function clearCron()
{
    $cron = "echo '' | crontab - ";
    system($cron);
}
