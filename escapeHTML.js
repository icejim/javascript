function escapeHTML(myString){
    var pre = document.createElement('pre');
    var text = document.createTextNode(myString);
    pre.appendChild(text);
    return pre.innerHTML;
}
