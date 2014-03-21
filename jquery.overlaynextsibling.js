(function( $ ){
	$.fn.overlayNextSibling = function(){
	var sibling = {
	width : this.next().outerWidth() ,
	height: this.next().outerHeight(),
	top: this.next().position().top,
	left: this.next().position().left
	};
	this.width(sibling.width);
	this.height(sibling.height);
	this.css({
	top : sibling.top + 'px',
	left: sibling.left + 'px'
	});
	this.show();
	return this;
	};
})(jQuery); 
