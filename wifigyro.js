function toInt(hi, lo) {
   var i = lo + hi*256;
   if (i > 32767) i -= 65536;
   return i;
}

var ws, buffer = "";

function ws_conn() {
      
   // Let us open a web socket
   var server = "ws:" + document.querySelector('#host').value +
                ":" + document.querySelector('#port').value;
   ws = new WebSocket(server);
   ws.binaryType = 'arraybuffer';

   ws.onopen = function() {
      document.querySelector('#connect').disabled = true;
      document.querySelector('#disconn').disabled = false;
      document.querySelector('#read').disabled = false;
      document.querySelector('#read1').disabled = false;
      document.querySelector('#host').disabled = true;
      document.querySelector('#port').disabled = true;
      document.querySelector('#send').disabled = false;
      document.querySelector('#string').disabled = false;
      document.querySelector('#wifi').disabled = false;
      document.querySelector('#ssid').disabled = false;
      document.querySelector('#pwd').disabled = false;
   };

   ws.onmessage = function (evt) {
      if (evt.data instanceof ArrayBuffer) mpuData(evt.data);
      else document.querySelector('#receive').value = evt.data;
   };
				
   ws.onclose = function() { 
      document.querySelector('#connect').disabled = false;
      document.querySelector('#disconn').disabled = true;
      document.querySelector('#read').disabled = true;
      document.querySelector('#read1').disabled = true;
      document.querySelector('#read1').innerHTML = "Continuous";
      document.querySelector('#host').disabled = false;
      document.querySelector('#port').disabled = false;
      document.querySelector('#send').disabled = true;
      document.querySelector('#string').disabled = true;
      document.querySelector('#wifi').disabled = true;
      document.querySelector('#ssid').disabled = true;
      document.querySelector('#pwd').disabled = true;
   };

}

function ws_send() {
  var str = document.querySelector('#string').value;
  if (str !== "") ws.send(str);
}

function toggle_read() {
   var str = document.querySelector('#read1').innerHTML;
   if (str === 'Stop Reading') {
      document.querySelector('#read1').innerHTML = "Continuous";
      document.querySelector('#read').disabled = false;
   } else {
      document.querySelector('#read1').innerHTML = "Stop Reading";
      document.querySelector('#read').disabled = true;
      buffer = "";
      ws.send("\n100");
   }
}

function save_wifi() {
   var ssid = document.querySelector('#ssid').value;
   var pwd = document.querySelector('#pwd').value;
   if (ssid === "") return;
   if (pwd === "") return;
   document.querySelector('#ssid').value = "SSID";
   document.querySelector('#pwd').value = "PASSWORD";
   ws.send("\007" + ssid + "," + pwd);	// \007 = bell = \a in c
}

function download() {
  var filename = document.querySelector('#fn').value;
  var text = document.querySelector('#ta').value;
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
    encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function clear_ta() {
  buffer = "";
  document.querySelector('#ta').value = buffer;
}
