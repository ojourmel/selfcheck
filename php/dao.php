<?php
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);

$sys = realpath(dirname(__FILE__)) . "/system.php";
require_once($sys);

class check {
    public $id;
    public $fname;
    public $time;
    public $env;
    public $body;
    public $active;

    function __construct($_id, $_fname, $_time, $_active, $_env, $_body) {
        $this->id = $_id;
        $this->fname = $_fname;
        $this->time = $_time;
        $this->active = $_active;
        $this->env = $_env;
        $this->body = $_body;
    }

    function toString() {
        return "$this->time\n$this->active\n$this->env\n$this->body";
    }
}

class checks {
    private $BASE_DIR = '';
    private $ACTIVE_DIR = '';
    private $checks = '';

    function __construct() {
        $this->BASE_DIR = realpath(realpath(dirname(__FILE__)) . '/../checks/');
        $this->ACTIVE_DIR = realpath(realpath(dirname(__FILE__)) . '/../checks/active/');


		if (!file_exists($this->BASE_DIR)) {
			mkdir($this->BASE_DIR, 0777, true);
		}
		if (!file_exists($this->ACTIVE_DIR)) {
			mkdir($this->ACTIVE_DIR, 0777, true);
		}

        $this->checks = array();

        $files = scandir(realpath($this->BASE_DIR));
        foreach ($files as $f) {
            if (is_file(realpath("$this->BASE_DIR/$f"))) {
                $h = fopen(realpath("$this->BASE_DIR/$f"), 'r');
                fscanf($h, "%s", $t);
                fscanf($h, "%s", $a);
                fscanf($h, "%s", $e);
                $b = stream_get_contents($h);
                $id = count($this->checks);
                $check = new check($id,$f,$t,$a,$e,$b);
                array_push($this->checks, $check);
                fclose($h);
            }
        }
    }

    function all() {
        return $this->checks;
    }

    function write($c) {
        $h = fopen("$this->BASE_DIR/$c->fname", 'w+');
        fprintf($h, "%s", $c->toString());
        fclose($h);
    }

    function add($c) {
        $this->write($c);
        array_push($this->checks, $c);
    }

    function remove($c) {

        array_splice($this->checks, $c->id, 1);

        for($i=$c->id;$i<count($this->checks);$i++){
            $this->checks[$i]->id = $i;
            $this->checks[$i]->fname = $i . '.sc';
            $this->write($this->checks[$i]);
        }

        unlink("$this->BASE_DIR/".count($this->checks).".sc");
    }

    function isActive($id) {
        return ($this->checks[$id]->active == 'active');
    }

    function enable($id) {
        $this->checks[$id]->active = 'active';

        $c = $this->checks[$id];

        $h = fopen("$this->ACTIVE_DIR/$c->fname", 'w+');
        fprintf($h, "#!%s\n", $c->env);
        fprintf($h, "%s", $c->body);
        fclose($h);
		chmod("$this->ACTIVE_DIR/$c->fname", 0777);

        activate($c, "$this->ACTIVE_DIR/$c->fname");
    }

    function disable($id) {
        $this->checks[$id]->active = 'inactive';
        $c = $this->checks[$id];

        unlink("$this->ACTIVE_DIR/$c->fname");
        deactivate($c, "$this->ACTIVE_DIR/$c->fname");
    }

    function get($id) {
        return $this->checks[$id];
    }
}
