function iframeUpload(generalId){	
	window.onbeforeunload = function() {
	    return "Data you have entered may not be saved if you leave the page, are you sure?";
	};
	
	var oImg=document.createElement("img");
	oImg.setAttribute('src', '../images/uploading.gif');	
	$('#bar'+generalId).append(oImg);
	
	var form = $('#upload_form'+generalId)[0];
	var iframe = document.createElement("iframe");
	iframe.setAttribute("id", "upload_iframe"+generalId);
	iframe.setAttribute("name", "upload_iframe");
	iframe.setAttribute("width", "0");
	iframe.setAttribute("height", "0");
	iframe.setAttribute("border", "0");
	iframe.setAttribute("style", "width: 0; height: 0; border: none;");
	
	// Add to document...
	document.body.appendChild(iframe);
	
	var eventHandler = function () {
	     
	if (iframe.detachEvent) iframe.detachEvent("onload", eventHandler);
	else iframe.removeEventListener("load", eventHandler, false);
	
	// Message from server...
	if (iframe.contentDocument) {
	    content = iframe.contentDocument.body.innerHTML;
	} else if (iframe.contentWindow) {
	    content = iframe.contentWindow.document.body.innerHTML;
	} else if (iframe.document) {
	    content = iframe.document.body.innerHTML;
	}
	
	}
	
	if (iframe.addEventListener) iframe.addEventListener("load", eventHandler, true);
	if (iframe.attachEvent) iframe.attachEvent("onload", eventHandler);
	
	// Set properties of form...
	form.setAttribute("target", "upload_iframe");
	
	// Submit the form...
	form.submit();
	
	window.onbeforeunload = null;
}

function ajaxUpload(generalId){
	window.onbeforeunload = function() {
	    return "Data you have entered may not be saved if you leave the page, are you sure?";
	};
	
	var formElement = document.getElementById("form"+generalId);
	var formDate = new FormData(formElement);
	var fupb = document.createElement('progress');
	fupb.setAttribute("id", "fupb"+generalId);
	fupb.max = 1000;
	$('#bar'+generalId).append(fupb);
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('progress', function(e) {
	var done = e.position || e.loaded, total = e.totalSize || e.total;
	console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
	var pct = done / total;
	fupb.value = Math.min(1000, pct * 1000) || 1000;
	}, false);
	if ( xhr.upload ) {
	xhr.upload.onprogress = function(e) {
	    var done = e.position || e.loaded, total = e.totalSize || e.total;
	    console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
	    var pct = done / total;
	    fupb.value = Math.min(1000, pct * 1000) || 1000;
	};
	}
	xhr.onreadystatechange = function(e) {
	if ( 4 == this.readyState ) {
	    console.log(['xhr upload complete', e]);
	    var result = (xhr.status == 200 ? "success" : "failure");
	   //...result handler
	}
	};
	xhr.open('post', your_url, true);
	xhr.send(formDate);
	
	window.onbeforeunload = null;
}

function upload(generalId){
	var supportsProgress = (document.createElement('progress').max !== undefined);
	$('#bar'+generalId).empty();
	if(supportsProgress){
		ajaxUpload(generalId);
	}else{
		iframeUpload(generalId);
	}		
}
