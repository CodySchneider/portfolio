var now = new Date();
$(document).ready(function(){
//**** Initialize Form ******************************************************
	$('.disabled').css('display','none');
	$('.pb, .cb').hide();
	$('#pb1, #cb1').show();
	$("fieldset li:visible:even").css({'background-color':'#F6F6F6'});
	$("fieldset label.required").append('<span class="asterisk"> * </span>');
	
//**** Button Event Handlers ******************************************************	
	$('.addBen').click(function(){
		$(this).parents('fieldset').next('fieldset').slideDown().find('input:first').focus();
		return false;
	});
	$('.delBen').click(function(){
		$(this).parents('fieldset').fadeOut('slow');
		$(this).parents('fieldset').find('input').each(function(){
			$(this).val("");
		});
		return false;
	});
	$('.copyAddress').click(function(){
		var address = $('#address1_7').val();
		$(this).parents('li').children('input').val(address);
		return false;
	});

//**** Define Custom Rules **************************************************	
	$.validator.addClassRules({
	  name: {
	    required: true,
	    minlength: 2
	  },
	  zip: {
	    required: false,
	    digits: true,
	    minlength: 5,
	    maxlength: 5
	  }
	});

//**** Form Validation ******************************************************	
	$("#hsa").validate({
		errorPlacement: function(error, element) {
			error.appendTo( element.parents("li") );
		},
		rules: {
			firstname_4: {required: true, lettersonly: true},
			mi_5: {lettersonly: true, maxlength:1},
			lastname_6: {required: true, lettersonly: true},
			address1_7: {required: true},
			address2_8: {required: false},
			city_9: {required: true, lettersonly: true},
			state_10: {required: true},
			zip_11: {},
	    ssn1_13: {required: true, number: true, minlength: 3},
	    ssn2_13: {required: true, number: true, minlength: 2},
	    ssn3_13: {required: true, number: true, minlength: 4},
	    dob1_14: {required: true, max: 12},
	    dob2_14: {required: true, max: 31},
	    dob3_14: {required: true, range: [1900,now.getFullYear()]},
	    phone1_15: {required: true, number: true, minlength: 3},
	    phone2_15: {required: true, number: true, minlength: 3},
	    phone3_15: {required: true, number: true, minlength: 4},
	    email_16: {required: true, email: true},
			email_verify:  {required: true, email: true, equalTo: "#email_16"},
	    effdate1_18: {required: true, max: 12},
	    effdate2_18: {required: true, max: 31},
	    effdate3_18: {required: true, range: [2008,9999]},
	    maiden_29: {lettersonly: true},
			dlnumber_30: {required: false},
			employeeMothersMaidenName_37: {required: false, lettersonly: true},
			employeeDriversLicense_38: {required: true},
			employeeAccountNumberReleaseIndicator_39: {required: true},
			healthPlanEmployeeID_40: {required: false},
			healthPlanGroupID_41: {required: false},
//**** Primary Beneficiary 1 ******************************************************
			pben1Name_42: {required: false, lettersonly: true},
			pben1Address_43: {required: '#pben1Name_42:filled'},
			pben1City_44: {required: '#pben1Name_42:filled'},
			pben1State_45: {required: '#pben1Name_42:filled'},
			pben1Zip_46: {required: '#pben1Name_42:filled', number: true, minlength: 5},
	    pben1ssn1_47: {required: '#pben1Name_42:filled', number: true, minlength: 3},
	    pben1ssn2_47: {required: '#pben1Name_42:filled', number: true, minlength: 2},
	    pben1ssn3_47: {required: '#pben1Name_42:filled', number: true, minlength: 4},
	    relation_48: {required: '#pben1Name_42:filled'},
	    percent_49: {required: '#pben1Name_42:filled', max: 100},
	    month_50: {required: '#pben1Name_42:filled', max: 12},
	    day_50: {required: '#pben1Name_42:filled', max: 31},
	    year_50: {required: '#pben1Name_42:filled', range: [1900,now.getFullYear()]},
//**** Primary Beneficiary 2 ******************************************************
			name_51: {required: false, lettersonly: true},
			address_52: {required: '#name_51:filled'},
			city_53: {required: '#name_51:filled'},
			state_54: {required: '#name_51:filled'},
			zip_55: {required: '#name_51:filled', number: true, minlength: 5},
	    ssn1_56: {required: '#name_51:filled', number: true, minlength: 3},
	    ssn2_56: {required: '#name_51:filled', number: true, minlength: 2},
	    ssn3_56: {required: '#name_51:filled', number: true, minlength: 4},
			relation_57: {required:'#name_51:filled'},
	    percent_58: {required: '#name_51:filled', max: 100},
	    month_59: {required: '#name_51:filled', max: 12},
	    day_59: {required: '#name_51:filled', max: 31},
	    year_59: {required: '#name_51:filled', range: [1900,now.getFullYear()]},
//**** Primary Beneficiary 3 ******************************************************
			name_60: {required: false, lettersonly: true},
			address_61: {required: '#name_60:filled'},
			city_62: {required: '#name_60:filled'},
			state_63: {required: '#name_60:filled'},
			zip_64: {required: '#name_60:filled', number: true, minlength: 5},
	    ssn1_65: {required: '#name_60:filled', number: true, minlength: 3},
	    ssn2_65: {required: '#name_60:filled', number: true, minlength: 2},
	    ssn3_65: {required: '#name_60:filled', number: true, minlength: 4},
			relation_66: {required:'#name_60:filled'},
	    percent_67: {required: '#name_60:filled', max: 100},
	    month_68: {required: '#name_60:filled', max: 12},
	    day_68: {required: '#name_60:filled', max: 31},
	    year_68: {required: '#name_60:filled', range: [1900,now.getFullYear()]},
//**** Contingency Beneficiary 1 ***************************************************
			name_69: {required: false, lettersonly: true},
			address_70: {required: '#name_69:filled'},
			city_71: {required: '#name_69:filled'},
			state_72: {required: '#name_69:filled'},
			zip_73: {required: '#name_69:filled', number: true, minlength: 5},
	    ssn1_74: {required: '#name_69:filled', number: true, minlength: 3},
	    ssn2_74: {required: '#name_69:filled', number: true, minlength: 2},
	    ssn3_74: {required: '#name_69:filled', number: true, minlength: 4},
			relation_75: {required:'#name_69:filled'},
	    percent_76: {required: '#name_69:filled', max: 100},
	    month_77: {required: '#name_69:filled', max: 12},
	    day_77: {required: '#name_69:filled', max: 31},
	    year_77: {required: '#name_69:filled', range: [1900,now.getFullYear()]},
//**** Contingency Beneficiary 2 ***************************************************
			name_78: {required: false, lettersonly: true},
			address_79: {required: '#name_78:filled'},
			city_80: {required: '#name_78:filled'},
			state_81: {required: '#name_78:filled'},
			zip_82: {required: '#name_78:filled', number: true, minlength: 5},
	    ssn1_83: {required: '#name_78:filled', number: true, minlength: 3},
	    ssn2_83: {required: '#name_78:filled', number: true, minlength: 2},
	    ssn3_83: {required: '#name_78:filled', number: true, minlength: 4},
			relation_84: {required:'#name_78:filled'},
	    percent_85: {required: '#name_78:filled', max: 100},
	    month_86: {required: '#name_78:filled', max: 12},
	    day_86: {required: '#name_78:filled', max: 31},
	    year_86: {required: '#name_78:filled', range: [1900,now.getFullYear()]},
//**** Contingency Beneficiary 3 ***************************************************
			name_87: {required: false, lettersonly: true},
			address_88: {required: '#name_87:filled'},
			city_89: {required: '#name_87:filled'},
			state_90: {required: '#name_87:filled'},
			zip_91: {required: '#name_87:filled', number: true, minlength: 5},
	    ssn1_92: {required: '#name_87:filled', number: true, minlength: 3},
	    ssn2_92: {required: '#name_87:filled', number: true, minlength: 2},
	    ssn3_92: {required: '#name_87:filled', number: true, minlength: 4},
			relation_93: {required:'#name_87:filled'},
	    percent_94: {required: '#name_87:filled', max: 100},
	    month_95: {required: '#name_87:filled', max: 12},
	    day_95: {required: '#name_87:filled', max: 31},
	    year_95: {required: '#name_87:filled', range: [1900,now.getFullYear()]},
//**** Dependant Check Card ********************************************************
			depcardfirst_102: {required: true, lettersonly: true},
			depcardmid_103: {lettersonly: true, maxlength:1},
			depcardlast_104: {required: true, lettersonly: true},
	    month_106: {required: true, max: 12},
	    day_106: {required: true, max: 31},
	    year_106: {required: true, range: [1900,now.getFullYear()]},
	    ssn1_105: {required: false, number: true, minlength: 3},
	    ssn1_105: {required: false, number: true, minlength: 2},
	    ssn1_105: {required: false, number: true, minlength: 4},

			dldate1_123: {required: false, max: 12},
			dldate2_123: {required: false, max: 31},
			dldate3_123: {required: false, range: [now.getFullYear(),(now.getFullYear()+20)]},
			employerName_124: {required: false}
	  },
//**** Custom Error Messages ******************************************************	
		messages : {
			dob1_14:{
				required:"Please enter the month.",
				max:"Please enter a month less than 12."
			},
			dob2_14:{
				required:"Please enter the day.",
				max:"Please enter a day less than 31."},
			dob3_14:{required:"Please enter the year."},
			email_verify: {
				required:"Please verify your email address.",
				equalTo:"Addresses do not match."
			}
		}
	});

	$.validator.addMethod('isFilled', function (element) {
		console.log(element);
		return $(element).parent('fieldset').find('input:first').val() != "";
	});
});

/*****************************************************
		BEGIN copyApplicant
			copies address, city, state, zip from applicant
			to the fields passed, also sets new focus to element passed
********************************************************/
    function copyApplicant(address,city,state,zip,newfocus) 
    { 
        var formHandle = document.hsa;
		
		var address1 = formHandle.address1_7.value;
		var address2 = formHandle.address2_8.value;
		var applicantAddress = address1 + " " + address2;//beneficiary only has one field for address
		var applicantCity = formHandle.city_9.value;
		var applicantState = formHandle.state_10.value;
		var applicantZip = formHandle.zip_11.value;
		
		formHandle[address].value = applicantAddress;
		formHandle[city].value = applicantCity;
		formHandle[state].value = applicantState;
		formHandle[zip].value = applicantZip;
		formHandle[newfocus].focus();
		
		return true;
    } 
 /*****************************************************
		END copyApplicant
********************************************************/

/*****************************************************
		BEGIN spousalConsent(elementID, beneficiary, state, percentage)
			shows or hides legal notice depending on state person lives in
********************************************************/
function spousalConsent(elementID, beneficiary, state, percentage){
		
		
		var formHandle = document.hsa		
		var fieldName1 = formHandle[beneficiary].value;
		var fieldName2 = formHandle[state].value;
		var fieldName3 = formHandle[percentage].value;
		
		var applicableStates = new Array("AZ","CA","ID","LA","NV","NM","TX","WA","WI")//States that the law applies to
		
		
		if(verifyState(applicableStates, fieldName2) ){//notice applies to user's state
			if( fieldName1 != "Spouse" && fieldName1 != ""){	//Benificiary is not spouse				
				showNotice(elementID);
				return;
			}//end if	
			else if ( (fieldName1 == "Spouse") && (parseInt(fieldName3) < 100) ){//Beneficiary is spouse, but less than 100%
				showNotice(elementID);
				return;
			}//end else if
			else{
				hideNotice(elementID);
			}//end else
			
		}//End Applicable State
		
	//***Helper Functions***//		
			
	function showNotice(elementID){
	
		if (spousalConsentNotShown)
			document.getElementById(elementID).style.display="block";//Shows notice
		else
			return;
		spousalConsentNotShown = 0;
	}
	
	function hideNotice(elementID){
		
		document.getElementById(elementID).style.display="none";//Hides notice
		spousalConsentNotShown = 1;
	}
	
	function verifyState(applicableStates, state){
		//Verifies the state is in the array of aplicable states, returns true if it is in the array
		
		var j;
			for (j in applicableStates){
				if (applicableStates[j] == state)
					return true;
					
			}
			return false;
	}		
}
 /*****************************************************
		END spousalConsent(elementID, beneficiary, state, percentage)
********************************************************/