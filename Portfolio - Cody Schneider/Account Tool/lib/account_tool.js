
/**
 * @author w951ags
 */

$(function () {

//************* Initialize SIFR jQuery plug-in *************
	$('.sifr').sifr({
		font:'kozuka',
		path: 'lib/',
		width: 475
	});
//************* Navigation Event Handlers *************
	navigation.init();
	//Back Button
	$('.back').click(function(){
		navigation.back(this);
	});
	//Next Button
	$('.next').click(function(){
		navigation.next(this);
	});

//	$('img[@src$=.png]').ifixpng();
});

//************* Navigation Object Definition *************
navigation = {
	lastPage : '#page4',
	init : function() {
		$('.page').hide();
		$('#page1').show();
	},
	next : function(obj) {
		if (!$(obj).parents('.page').is(this.lastPage)) {
			$(obj).parents('.page').hide();
			$(obj).parents('.page').next('.page').show();
		} else {
			this.showResults();
			analysis.start('lib/accounts.xml', response);
		}
	},
	back : function(obj) {
		$(obj).parents('.page').hide();
		$(obj).parents('.page').prev('.page').show();
		$('#results').hide();
	},
	showResults : function() {
		//$(".footer p").css('background','url(./img/result_bg_foot_left.png) no-repeat left top');
		$('#results').show();
		$('#results').each(function(){
			//$("#results .footer p").css('background','url(./img/bg_foot_left.png) no-repeat left top');
			$(this)
				.css('top','-345px')
				.animate(
					{
						top:'-35px'
					},
					'slow');
		});
	}
}

//************* Response Object Definition *************
response = {
	'age':'',
	'student':'',
	'yield':'',
	'accountType':'', 
	'access': [{
			'atm': '0',
			'checkCard': '0',
			'checks': '0',
			'internet': '0',
			'otherATM': '0'
	}],
	'access_freq':'0',
	'avgBalance':'',
	'fees':'',
	'deposit':'',
	'read': function(){
		this.age = parseInt($('#age').val());
		this.student = parseInt($("input[name='student']:checked").val());
		this.yield = parseInt($("input[name='yield']:checked").val());
		this.accountType = $('#accountType').val();
		this.access.checks = parseInt($('#checks:checked').val());
		this.access.atm = parseInt($('#atm:checked').val());
		this.access.checkCard = parseInt($('#checkCard:checked').val());
		this.access.internet = parseInt($('#internet:checked').val());
		this.access.otherATM = parseInt($('#otherATM:checked').val());
		this.access_freq = parseInt($('#access_freq').val());
		this.avgBalance = parseInt($('#avgBalance').val());
		this.fees = parseInt($("input[name='fees']:checked").val());
		this.deposit = parseFloat($('#deposit').val());
		return this;
	}
};

//************* Analysis Object Definition *************
analysis = {
	'jsonResponseData':'',
	'jsonAccountData':'',
	'AccountArray': '',
	'start': function(xmlPath, responseObj) {
		var obj=this;
		var jsonResponse = responseObj;
		$.post(xmlPath, function(xml){
			obj.jsonAccountData = $.xml2json(xml);
			for (var i in obj.jsonAccountData.account) {
				obj.jsonAccountData.account[i].score = 0;
			}
			obj.jsonResponseData = jsonResponse.read();
			obj.accountArr = obj.jsonAccountData.account;
			obj.chooseAccount(jsonResponse);
			obj.sortAccounts();
			obj.displayResults();
		});
	},
	'chooseAccount': function(responseObj){
		this.checkYield(responseObj);
		this.checkFees(responseObj);
		this.checkDeposit(responseObj);
		this.checkAccess(responseObj);
		this.checkFrequency(responseObj);
		this.checkAccountType(responseObj);
		this.checkBalance(responseObj);
		this.checkStudent(responseObj);
		this.checkAge(responseObj);
		this.roundScores();
	},
	'roundScores': function(){
		for (var i in this.accountArr) {
			this.accountArr[i].score = Math.round(this.accountArr[i].score * 100) / 100;
		}
	},
	'checkYield': function(responseObj){
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].features.interest.weight);
			if (responseObj.yield) {
				switch (this.accountArr[i].features.interest.text) {
					case 'lowest':
						this.accountArr[i].score += weight * 0.1;
						break;
					case 'low':
						this.accountArr[i].score += weight * 0.2;
						break;
					case 'medium':
						this.accountArr[i].score += weight * 1;
						break;
					case 'high':
						this.accountArr[i].score += weight * 1.2;
						break;
					case 'higher':
						this.accountArr[i].score += weight * 1.5;
						break;
					case 'highest':
						this.accountArr[i].score += weight * 2;
						break;
					default:
						break;
				}
			} else {
				if (this.accountArr[i].requirements.term == 0) {
					this.accountArr[i].score += weight;
				}
			}
		}
	},
	'checkFees': function(responseObj){
		//No fees = 0, Higher Interest = 1
		for (var i in this.accountArr) {
			var weight = parseFloat(this.accountArr[i].maintFee.weight);
			var feeCount = 0;
/* TODO: Add calculation for feature fees.
			for (var j in this.accountArr[i].features) {
				if (this.accountArr[i].features[j].fee == 'false'){
					feeCount++;
				}
			}
*/
			if (responseObj.fees == 0) {
				if (this.accountArr[i].maintFee.value == 'false') {
					this.accountArr[i].score += weight;
				}
				// this.accountArr[i].score -= feeCount * weight * 0.25;
			} else if (responseObj.fees == 1) {
				switch (this.accountArr[i].features.interest.text) {
					case 'lowest':
						this.accountArr[i].score += weight * 0.1;
						break;
					case 'low':
						this.accountArr[i].score += weight * 0.2;
						break;
					case 'medium':
						this.accountArr[i].score += weight * 1;
						break;
					case 'high':
						this.accountArr[i].score += weight * 1.2;
						break;
					case 'higher':
						this.accountArr[i].score += weight * 1.5;
						break;
					case 'highest':
						this.accountArr[i].score += weight * 2;
						break;
					default:
						break;
				}
			}
		}
	},
	'checkStudent': function(responseObj){
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].requirements.student.weight);
			if ((responseObj.student) && this.accountArr[i].requirements.student == 'yes') {
				this.accountArr[i].score += weight;
			} else 
				if (!(responseObj.student) && this.accountArr[i].requirements.student == 'yes') {
				this.accountArr[i].score = 0;
			}
		}
	},
	'checkAge': function(responseObj){
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].requirements.age.weight);
			if (((responseObj.age < 18) && (this.accountArr[i].requirements.age < 18)) || 
				(responseObj.age > 55) && (this.accountArr[i].requirements.age >= 55) ) {
				this.accountArr[i].score += weight;
			} else 
				if (!(responseObj.age < 18) && (this.accountArr[i].requirements.age < 18)) {
					this.accountArr[i].score = 0;
			} else 
				if (!(responseObj.age > 55) && (this.accountArr[i].requirements.age >= 55)) {
					this.accountArr[i].score = 0;
				} 
		}
	},
	'checkAccess': function(responseObj){
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].features.weight);
			if ((responseObj.access.checks) && (this.accountArr[i].features.checks == 'true')){
				this.accountArr[i].score += weight;
			}
			if ((responseObj.access.atm) && (this.accountArr[i].features.debit == 'true')) {
				this.accountArr[i].score += weight;
			}
			if ((responseObj.access.checkCard) && (this.accountArr[i].features.checkCard == 'true')) {
				this.accountArr[i].score += weight;
			}
			if ((responseObj.access.internet) && (this.accountArr[i].features.ebanking == 'true')) {
				this.accountArr[i].score += weight;
			}
			if ((responseObj.access.otherATM) && ((this.accountArr[i].features.ebanking == 'false')
				&& (this.accountArr[i].features.debit == 'false')
				&& (this.accountArr[i].features.checkCard == 'false'))) {
				this.accountArr[i].score += weight;
			}
		}
	},
	'checkFrequency': function(responseObj){
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].requirements.term.weight);
			if (responseObj.access_freq == parseInt(this.accountArr[i].requirements.term)) {
				this.accountArr[i].score += weight;
			} else if ((responseObj.access_freq >= parseInt(this.accountArr[i].requirements.term)) 
				&& (parseInt(this.accountArr[i].requirements.term != 0))) {
				this.accountArr[i].score += weight * 0.5;
			} else if ((responseObj.access_freq >= parseInt(this.accountArr[i].requirements.term)) 
				&& (parseInt(this.accountArr[i].requirements.term = 0))) {
				this.accountArr[i].score += weight * 0.25;
			} else if (responseObj.access_freq < parseInt(this.accountArr[i].requirements.term)) {
				//this.accountArr[i].score -= weight;
			}
		}
	},
	'checkAccountType': function(responseObj){
		var accountType = '';
		switch (responseObj.accountType) {
			case '1':
				accountType = 'checking';
				break;
			case '2':
				accountType = 'savings';
				break;
			case '3':
				accountType = 'cd';
				break;
			case '4':
				accountType = 'money';
				break;
		}
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].type.weight);
			if (accountType == this.accountArr[i].type) {
		  	this.accountArr[i].score += weight;
		  }
		}
	},
	'checkBalance': function(responseObj){
		for (var i in this.accountArr){
			var weight = parseFloat(this.accountArr[i].requirements.minBalance.weight);
  		if ((responseObj.avgBalance == 0) && (this.accountArr[i].requirements.minBalance == 0)) {
		  	this.accountArr[i].score += weight;
		  } else if (this.accountArr[i].requirements.minBalance == 0){
				var denSub = Math.sqrt(responseObj.avgBalance) * 2;
	  		this.accountArr[i].score += weight * 1 / this.reduce(responseObj.avgBalance, denSub);
			} else if (responseObj.avgBalance >= this.accountArr[i].requirements.minBalance) {
	  		this.accountArr[i].score += weight * 1 / Math.pow(this.reduce(responseObj.avgBalance, parseFloat(this.accountArr[i].requirements.minBalance.text)), (1/3));
  		}
		}
	},
	'checkDeposit': function(responseObj){
		for (var i in this.accountArr){
			var min = parseFloat(this.accountArr[i].requirements.minDeposit.text);
			var weight = parseFloat(this.accountArr[i].requirements.minDeposit.weight);
  		if ((responseObj.deposit == 0)&&(min == 0)){
				this.accountArr[i].score += weight;
			} else if (this.accountArr[i].requirements.minDeposit == 0) {
				var denSub = Math.sqrt(responseObj.deposit) * 2;
	  		this.accountArr[i].score += weight * 1 / this.reduce(responseObj.deposit, denSub);
	  	} else if (responseObj.deposit >= this.accountArr[i].requirements.minDeposit) {
	  		this.accountArr[i].score += weight * 1 / Math.pow(this.reduce(responseObj.deposit, parseFloat(this.accountArr[i].requirements.minDeposit.text)), (1/3));
	  	}
		}
	},
	'reduce': function(num, den){
	  var factorX = 1;
	  //Find common factors of Numerator and Denominator
	  for ( var x = 2; x <= Math.min( num, den ); x ++ ) {
	    var check1 = num / x;
	    if ( check1 == Math.round( check1 ) ) {
	      var check2 = den / x;
	      if ( check2 == Math.round( check2 ) ) {
	        factorX = x;
	      }
	    }
	  }
	  num=(num/factorX);  //divide by highest common factor to reduce fraction then multiply by neg to make positive or negative
	  den=(den/factorX);  //divide by highest common factor to reduce fraction
	  //console.log(num, den, num/den);
	  return (num/den);

	},
	'sortAccounts': function(){
		var accounts = this.accountArr;
		var N = accounts.length;
		
		var compare = function(val1, val2, desc) {
	    return (desc) ? val1 > val2 : val1 < val2;
	  }
		
		var exchange = function(i, j) {
			var temp = accounts[j];
			accounts[j] = accounts[i];
			accounts[i] = temp;

	  }

		for(var j=N-1; j > 0; j--) { 
			for(var i=0; i < j; i++) {
				if(compare(accounts[i+1].score, accounts[i].score, true)) {
					exchange(i, i+1);
        }
			}
		} 
	},
	'displayResults': function(){
		var result = '';
		$('#results .product').remove();
		
		var prodFeature = {
			init : function() {
				$('.showAll').click(function(){
					$('.detail').removeClass('hidden');
					$('.showButton').addClass('hidden');
					$('.hideButton').removeClass('hidden');
				});
				$('.hideAll').click(function(){
					$('.detail').addClass('hidden');
					$('.showButton').removeClass('hidden');
					$('.hideButton').addClass('hidden');
				});
				$('.headline').css('cursor','pointer');
				$(".detail, .hideButton").addClass('hidden');
				$(".detail").css('display', 'block');
				$(".hideButton").css('display', 'inline');
/*
				$('.headline:first .hideButton').addClass('hidden');
				$('.headline:first').each(function() { 
					prodFeature.toggleText(this) 
				});
*/
				$('.headline').click(function() { prodFeature.toggleText(this) });
			},
			
			toggleText : function(elt) {
				$(elt).children('.detail').toggle().toggleClass('hidden').slideToggle('fast');
				$(elt).find('.showButton').toggleClass('hidden');
				$(elt).find('.hideButton').toggleClass('hidden');
			}
		}
		for (var i in this.accountArr) {
			result += "\n<div class=\'product headline\'>\n"
			+"	<div class='accountHead'>\n"
			+"		<p class=\'showHide\'>[ <strong class=\'showButton\'>+</strong><strong class=\'hideButton\'>&minus;</strong> ]</p>\n"
			+"		<h3 class='sifr'>"+this.accountArr[i].name+"</h3>\n"
			+"		<p class='score'>Score: "+this.accountArr[i].score+"</p><br class='clear'/>\n"
			+"	</div>\n"
			+"	<div class=\'detail\'>\n"
			+"		<table class=\'feature_tbl\' summary=\'"+this.accountArr[i].name+" Features\'>\n"
			+"			<tr><td>Minimum Deposit:</td><td>"+this.accountArr[i].requirements.minDeposit+"</td></tr>\n"
			+"			<tr><td>Minimum Balance:</td><td>"+this.accountArr[i].requirements.minBalance+"</td></tr>\n"
			+"			<tr><td>Maintenance Fee:</td><td>Monthly: $"+this.accountArr[i].maintFee.monthly
				+"<br/>Yearly: $"+this.accountArr[i].maintFee.yearly+"</td></tr>\n"
			+"			<tr><td>Interest:</td><td>"+this.accountArr[i].features.interest+"</td></tr>\n"
			+"			<tr><td>Term:</td><td>"+this.accountArr[i].requirements.term+"</td></tr>\n"
			+"			<tr><td>Overdraft:</td><td>"+this.accountArr[i].features.overdraft
				+"<br/>Fee:"+this.accountArr[i].features.overdraft.fee+"</td></tr>\n"
			+"			<tr><td>Checks:</td><td>"+this.accountArr[i].features.checks
				+"<br/>Limit:"+this.accountArr[i].features.checks.limit
				+"<br/>Free Checks:"+this.accountArr[i].features.checks.freeChecks
				+"</td></tr>\n"
			+"			<tr><td>ATM/Debit Card:</td><td>"+this.accountArr[i].features.debit
				+"<br/>Fee:"+this.accountArr[i].features.debit.fee
				+"<br/>Access Fees:$"+this.accountArr[i].features.debit.fees.yearly
				+" per year & $"+this.accountArr[i].features.debit.fees.monthly+" per month"
				+"<br/>Transaction Fees:$"+this.accountArr[i].features.debit.fees.transaction+" per use"
				+"<br/>Transaction Fee Refund:$"+this.accountArr[i].features.debit.cashback+" monthly"
				+"</td></tr>\n"
			+"			<tr><td>Check Card:</td><td>"+this.accountArr[i].features.checkCard
				+"<br/>Fee:"+this.accountArr[i].features.checkCard.fee
				+"<br/>Access Fees:$"+this.accountArr[i].features.checkCard.fees.yearly
				+" per year & $"+this.accountArr[i].features.checkCard.fees.monthly+" per month"
				+"<br/>Transaction Fees:$"+this.accountArr[i].features.checkCard.fees.transaction+" per use"
				+"<br/>Transaction Fee Refund:$"+this.accountArr[i].features.checkCard.cashback+" monthly"
				+"</td></tr>\n"
			+"			<tr><td>eBanking:</td><td>"+this.accountArr[i].features.ebanking
				+"<br/>Fee:"+this.accountArr[i].features.ebanking.fee
				+"<br/>Transfers:"+this.accountArr[i].features.ebanking.transfer
				+"</td></tr>\n"
			+"			<tr><td>BillPay:</td><td>"+this.accountArr[i].features.billpay
				+"<br/>Fee:"+this.accountArr[i].features.ebanking.fee
				+"</td></tr>\n"
			+"		</table>\n"
			+"		<p class=\'hidden\'>[ <a href=\'#account_tool\'>Back to Questionnaire</a> ]</p>\n"		
			+"	</div><!-- detail -->\n"
			+"</div><!-- headline -->\n";
		}
		$('#results .wrapper').append(result);
		prodFeature.init();
		$('.feature_tbl tr:even').addClass('even');
		$('.feature_tbl tr:odd').addClass('odd');
	}
}
