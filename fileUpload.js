function backendUpload(receiverid,title){
	window.onbeforeunload = function() {
	    return "Data you have entered may not be saved if you leave the page, are you sure?";
	};
	
	var oImg=document.createElement("img");
	oImg.setAttribute('src', '../images/uploading.gif');	
	$('#bar'+receiverid).append(oImg);
	
	var form = $('#messageaction'+receiverid)[0];
	var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe"+receiverid);
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
    
    // Add to document...
    document.body.appendChild(iframe);
    window.frames['upload_iframe'].name = "upload_iframe";
 
    iframeId = document.getElementById("upload_iframe"+receiverid);
    
    var eventHandler = function () {
    	 
        if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
        else iframeId.removeEventListener("load", eventHandler, false);

        // Message from server...
        if (iframeId.contentDocument) {
            content = iframeId.contentDocument.body.innerHTML;
        } else if (iframeId.contentWindow) {
            content = iframeId.contentWindow.document.body.innerHTML;
        } else if (iframeId.document) {
            content = iframeId.document.body.innerHTML;
        }

        // Del the iframe...
        setTimeout('document.body.removeChild(iframeId)', 250);
        cancelUpload(receiverid);
        $('#content'+receiverid).val('');
        showMessageList();
        displayTab(receiverid,title);
    }
    
    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
 
    // Set properties of form...
    form.setAttribute("target", "upload_iframe");
 
    // Submit the form...
    form.submit();
    
    window.onbeforeunload = null;
}

function ajaxUpload(receiverid,title){
	window.onbeforeunload = function() {
	    return "Data you have entered may not be saved if you leave the page, are you sure?";
	};
	
	//var file = document.getElementById('fileUpload'+receiverid).files[0];
	var formElement = document.getElementById("messageaction"+receiverid);
	var file = new FormData(formElement);
	var fupb = document.createElement('progress');
	fupb.setAttribute("id", "fupb"+receiverid);
	fupb.max = 1000;
	$('#bar'+receiverid).append(fupb);
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
            displayTab(receiverid,title);
        }
    };
    xhr.open('post', "sendmessage.action", true);
    xhr.send(file);
    
    window.onbeforeunload = null;
}

function sendMessage(receiverid,title){
	if(receiverid){
		if($('#fileUpload'+receiverid).val()){
			if($('#content'+receiverid).val()){
				var r = confirm("Message can only be text only or file only. This message will be sent as a file message. Text: " + $('#content'+receiverid).val() + " will be ignored.");
				if (r == true)
				  {
					var supportsProgress = (document.createElement('progress').max !== undefined);
					$('#bar'+receiverid).empty();
					if(supportsProgress){
						ajaxUpload(receiverid,title);
					}else{
						backendUpload(receiverid,title);
					}					
				  }
				else
				  {
				  }
			}
			else{
				var supportsProgress = (document.createElement('progress').max !== undefined);
				$('#bar'+receiverid).empty();
				if(supportsProgress){
					ajaxUpload(receiverid,title);
				}else{
					backendUpload(receiverid,title);
				}		
			}
		}
		else if($('#content'+receiverid).val()){
			$('body').mask('Sending message ...');
			$('#filename'+receiverid).text('');
			$('#filename'+receiverid).css("color","black");
			$.ajax({
				type: "POST",
				url: 'sendmessage.action',
				async: false,
				data:{
					receiverid:receiverid,
					content:$('#content'+receiverid).val()
				}
			}).done(function(result) {
				$('body').mask(result);
				$('#content'+receiverid).val('');
				setTimeout("$('body').unmask();",4000);
				displayTab(receiverid,title);		
			}).fail(function(jqXHR, textStatus) {
				$('body').unmask();
				$('body').mask('sendmessage:An error occurred. Please relogin.');
				setTimeout("window.location = \"<%=request.getContextPath()%>/login.jsp\"",4000);
			}); 
		}
		else{
			$('#filename'+receiverid).text("Message can not be empty. Please input message content");
			$('#filename'+receiverid).css("color","red");
		}
	}
	else{
		alert("Please select receiver of your message");
	}
	
}