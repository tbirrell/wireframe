<?php
  require 'import.php';

  use flight\Engine;

  $app = new Engine();

  $app->route('/', function(){
      echo 'hello world!';
  });

  $app->start();