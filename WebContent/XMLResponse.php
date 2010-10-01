<?php
$request_time = $_SERVER['REQUEST_TIME'];
$success = false;  // リクエストパラメータ('success')
$format = NULL;  // リクエストパラメータ('format')


get_request_parameters();  // リクエストパラメータの取得
output_http_response();  // HTTPレスポンスの出力


/*
 * リクエストパラメータを取得する。
 */
function get_request_parameters() {
  global $success, $format;
  
  if (isset($_REQUEST['success'])) {
    if ($_REQUEST['success'] == 'true') {
      $success = true;
    }
  }
  
  if (isset($_REQUEST['format'])) {
    $format = $_REQUEST['format'];
  }
}


/*
 * HTTPレスポンスを出力する。
 */
function output_http_response() {
  global $success, $format;
  
  mb_http_output('UTF-8');
  
  if ($success) {
    if (strtoupper($format) == 'TEXT') {
      header('Content-type: text/plain');
      print(create_text());
    } else if (strtoupper($format) == 'XML') {
      header('Content-type: text/xml');
      print(create_xml());
    } else if (strtoupper($format) == 'JSON') {
      header('Content-type: text/javascript');
      print(create_json());
    } else {
      header('Content-type: text/xml');
      print(create_error());
    }
  } else {
    header("HTTP/1.0 403 Forbidden", false, 403);
  }
}


/*
 * レスポンス用テキストデータを生成する。
 */
function create_text() {
  global $request_time;
  
  return date('Y年m月d日 H時i分s秒', $request_time);
}


/*
 * レスポンス用XMLデータを生成する。
 */
function create_xml() {
  global $request_time;
  
  $data = '<?xml version="1.0" encoding="UTF-8" ?><result></result>';
  $sxe = new SimpleXMLElement($data);
  
  $sxe->addChild('success', 'true');
  $time_node = $sxe->addChild('time');
  $time_node->addChild('year', date('Y', $request_time));
  $time_node->addChild('month', date('m', $request_time));
  $time_node->addChild('day', date('d', $request_time));
  $time_node->addChild('hour', date('H', $request_time));
  $time_node->addChild('minute', date('i', $request_time));
  $time_node->addChild('second', date('s', $request_time));
  
  return $sxe->asXML();
}


/*
 * レスポンス用JSONデータを生成する。
 */
function create_json() {
  global $request_time;
  
  $time = array();
  $time['year'] = date('Y', $request_time);
  $time['month'] = date('m', $request_time);
  $time['day'] = date('d', $request_time);
  $time['hour'] = date('H', $request_time);
  $time['minute'] = date('i', $request_time);
  $time['second'] = date('s', $request_time);
    
  return json_encode($time);
}


/*
 * エラーレスポンス用XMLデータを生成する。
 */
function create_error() {
  $data = '<?xml version="1.0" encoding="UTF-8" ?><result></result>';
  $sxe = new SimpleXMLElement($data);
  
  $sxe->addChild('success', 'false');
  
  return $sxe->asXML();
}
?>
