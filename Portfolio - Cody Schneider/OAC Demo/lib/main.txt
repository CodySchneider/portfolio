/**
 * @author e1032477
 */
$(function() {
	//Disable Development Navigation
	$("#Navigation li a").click(function() {
      return false;
  });

	//Activate pop-up for inactive links
  $(".Inactive").click(function() {
      GB_Show(1, this.href, 150, 320);
      return false;
  });
	
	//Reset defaults and optional fields
  $('select, :input').clearForm();
	$(".option").hide();

	//Standard dynamic field behavior Type 1
	//Toggles adjacent table rows with option class
	$(".dynType1").change(function(){
		var $target = $(this).parents('fieldset').find('.option')
		$(this).toggleOptionalFields($target);
	});
	
	//Standard dynamic field behavior Type 2
	//Toggles adjacent fieldset with option class
	$(".dynType2").change(function(){
		var $target = $(this).parents('fieldset').nextAll('.option');
		$(this).toggleOptionalFields($target);
	});
});

$.fn.clearForm = function() {
	return this.each(function() {
		var type = this.type, tag = this.tagName.toLowerCase();
		if (tag == 'form')
			return $(':input',this).clearForm();
		if (type == 'text' || type == 'password' || tag == 'textarea')
			this.value = '';
//		else if (type == 'checkbox' || type == 'radio')
//			this.checked = false;
		else if (tag == 'select')
			this.selectedIndex = -1;
	});
};

$.fn.toggleOptionalFields = function($target) {
	return this.each(function() {
		//console.log($(this).val());
		if ($(this).val() == "1") {
			$target.show();
		} else if (($(this).val() == "0") || ($(this).val() == null)) {
			$target.hide();
		}
	});
};