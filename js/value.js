var bestValue = window.bestValue || {}; bestValue.Forms = bestValue.Forms || {};
bestValue.Forms = {
	totalMinutes: 240,
	formData: {
		default: {name:null, price:null, sizeVal:null, sizeType:null, discount1Val:null, discount1Type:null, discount1Amount:null, discount2Val:null, discount2Type:null, discount2Amount:null, discount3Val:null, discount3Type:null, discount3Amount:null, priceNet:null, pricePer:null, totalDiscounts:null, totalFixedDiscounts:null}	
	},
	
	sizeTypes: {
		'size-each': 'each',
		'size-oz': 'oz',
		'size-fl-oz': 'fluid oz',
		'size-lb': 'lb',
	},
	
	init: function(){
		var $form1 = $('#form-item-1');
		var $form2 = $('#form-item-2');
		bestValue.Forms.setupForm($form1);
		bestValue.Forms.setupForm($form2);
		//bestValue.Forms.setupData($form1);
	},

	handleItemUpdate: function($this){
		var $form = $this.parents('form');
		var $fieldset = $this.parents('fieldset');
		var fieldsetId = $fieldset.attr('id');
		bestValue.Forms.updateData($this, $fieldset, $form);
	},

	updateData: function($this, $fieldset, $form){
		/////console.clear();
		var formId = $form.attr('id');
		var formData = bestValue.Forms.formData[formId];
		
		var $thisId = $this.attr('id');
		///console.log('$thisId: ' + $thisId);
		
		$form.find('[data-update=true]').each(function(){
			var $this = $(this);
			var keyName = $this.data('key');
			var keyVal = Number($this.val());
			if(keyName == 'name'){
				keyVal = $this.text();
			}
			formData[keyName] = keyVal;
			
			
			
			///console.log('keyName: ' + keyName);
			///console.log(keyName + ': ' + keyVal);
			
			if(keyName=='discount1Val'){
				var $discount1Key = 'discount1Type';
				if($form.find('input[name=input-item-discount-1]').prop('checked')){
					
					var discount1Type = 'fixed';
					var discount1Amount = Number(keyVal).toFixed(2);
				}
				else{
					var discount1Type = 'percent';
					var price = formData['price'];
					var discount1Amount = ((Number(keyVal) / 100) * price).toFixed(2);
					///console.log('discount1Amount: ' + discount1Amount);
				}
				var $percentValue = $form.find('.item-discout-type-1 .percent-value span');
				$percentValue.text(discount1Amount);
				formData[$discount1Key] = discount1Type;
				formData['discount1Amount'] = Number(discount1Amount);
				formData['discount1Val'] = Number(formData['discount1Val']);
			}

			if(keyName=='discount2Val'){
				var $discount2Key = 'discount2Type';
				if($form.find('input[name=input-item-discount-2]').prop('checked')){
					var discount2Type = 'fixed';
					var discount2Amount = Number(keyVal).toFixed(2);
				}
				else{
					var discount2Type = 'percent';
					var price = formData['price'];
					var discount2Amount = ((Number(keyVal) / 100) * price).toFixed(2);
					///console.log('discount2Amount: ' + discount2Amount);
				}
				var $percentValue = $form.find('.item-discout-type-2 .percent-value span');
				$percentValue.text(discount2Amount);
				formData[$discount2Key] = discount2Type;
				formData['discount2Amount'] = Number(discount2Amount);
				formData['discount2Val'] = Number(formData['discount2Val']);
			}

			if(keyName=='discount3Val'){
				var $discount3Key = 'discount3Type';
				if($form.find('input[name=input-item-discount-3]').prop('checked')){
					var discount3Type = 'fixed';
					var discount3Amount = Number(keyVal).toFixed(2);
				}
				else{
					var discount3Type = 'percent';
					var price = formData['price'];
					var discount3Amount = ((Number(keyVal) / 100) * price).toFixed(2);
					///console.log('discount3Amount: ' + discount3Amount);
				}
				var $percentValue = $form.find('.item-discout-type-3 .percent-value span');
				$percentValue.text(discount3Amount);
				formData[$discount3Key] = discount3Type;
				formData['discount3Amount'] = Number(discount3Amount);
				formData['discount3Val'] = Number(formData['discount3Val']);
			}
			
			///console.log(' ');
		});

		///console.log(formData);
		bestValue.Forms.calculatePrice($form);
	},

	setupForm: function($form){
		var formId = $form.attr('id');
		bestValue.Forms.formData[formId] = {};
		jQuery.extend(bestValue.Forms.formData[formId], bestValue.Forms.formData.default);
		
		$form.find('.title').on('blur',function() {
			bestValue.Forms.handleItemUpdate($(this));
		});
		$form.find('input').change(function() {
			bestValue.Forms.handleItemUpdate($(this));
		});
	},

	updatePercentageDiscount: function($form){
		var formId = $form.attr('id');
		var oData = bestValue.Forms.formData;
		var formData = oData[formId];
		///console.log(' ');
		///console.log('updatePercentageDiscount');
		
		formData['totalDiscounts'] = 0;
		formData['totalFixedDiscounts'] = 0;
		
		if(formData['discount1Type']=='fixed'){
			formData['totalFixedDiscounts'] += formData['discount1Val'];                                                  
		}
		if(formData['discount2Type']=='fixed'){
			formData['totalFixedDiscounts'] += formData['discount2Val'];
		}
		if(formData['discount3Type']=='fixed'){
			formData['totalFixedDiscounts'] += formData['discount3Val'];
		}

		if(formData['discount3Type']=='percent'){
			var discount3Amount = formData['discount3Amount']; 
			var discount3Val = formData['discount3Val'];
			
			var percentage = Number(discount3Val) / 100;
			formData['discount3Amount'] = formData['discount3Amount'] * percentage;
			
		}
		
		
		
		
	},

	calculatePrice: function($form){
		//bestValue.Forms.updatePercentageDiscount($form);
		var formId = $form.attr('id');
		var oData = bestValue.Forms.formData;
		var formData = oData[formId];
		///console.log(' ');
		///console.log('calculatePrice');
		
		var itemPrice = formData['price'];
		var updatedPrice = bestValue.Forms.calculateDiscount(formData);
		///console.log('calculatePrice updatedPrice: ' + updatedPrice.toFixed(2));
		$form.find('.input-item-price-net').val('$' + updatedPrice.toFixed(2));
		var size = formData['sizeVal'];
		
		if(size>0){
			///console.log('GET PER');	
			var calculatePricePer = bestValue.Forms.calculatePricePer($form, updatedPrice, size);
			$form.find('.input-item-unit-price').val('$' + calculatePricePer.toFixed(5));
		}
		
		///console.log('itemPrice: ' + itemPrice);
		///console.log('size: ' + size);
		return updatedPrice;
	},

	calculateDiscount: function(formData){
		///console.log('||| calculateDiscount');
		var itemPrice = formData['price'];
		var updatedPrice = itemPrice;
		if(formData['discount1Type']=='fixed'){
			updatedPrice = updatedPrice - formData['discount1Amount'];
		}
		if(formData['discount2Type']=='fixed'){
			updatedPrice = updatedPrice - formData['discount2Amount'];
		}
		if(formData['discount3Type']=='fixed'){
			updatedPrice = updatedPrice - formData['discount3Amount'];
		}
		if(formData['discount1Type']=='percent'){
			var discount1Calc = (updatedPrice * (formData['discount1Amount'] / 100));
			///console.log('discount1Calc: ' + discount1Calc);
			updatedPrice = updatedPrice - discount1Calc;
		}
		if(formData['discount2Type']=='percent'){
			var discount2Calc = (updatedPrice * (formData['discount2Amount'] / 100));
			///console.log('discount2Calc: ' + discount2Calc);
			updatedPrice = updatedPrice - discount2Calc;
		}
		if(formData['discount3Type']=='percent'){
			var discount3Calc = (updatedPrice * (formData['discount3Amount'] / 100));
			///console.log('discount3Calc: ' + discount3Calc);
			updatedPrice = updatedPrice - discount3Calc;
		}
		
		///console.log('originalPrice: ' + itemPrice);
		///console.log('updatedPrice: ' + updatedPrice);
		return updatedPrice;
	},

	calculatePricePer: function($form, updatedPrice, size){
		///console.log('calculatePricePer ');
		///console.log('updatedPrice: ' + updatedPrice);
		///console.log('size: ' + size);
		return updatedPrice / size;
	},

	setupData: function($form){
		var $price = $form.find('input[name=input-item-price]');
		var $size = $form.find('input[name=input-item-size]');
		var $discount1 = $form.find('input[name=item-discout-value-1]');
		var $discount2 = $form.find('input[name=item-discout-value-2]');
		var $discount3 = $form.find('input[name=item-discout-value-3]');
		$price.val(12.99);
		$size.val(35);
		$discount1.val(2.5);
		$discount2.val(2);
		$discount3.val(5);

		$form.find('#input-item-discount-3-percent').attr("checked",true).checkboxradio("refresh").end().find('#input-item-discount-3-fixed').attr("checked",false).checkboxradio("refresh");

		$price.trigger('change');
		
	}



};
$(function() {
	///console.clear();
	alert('loaded');
	bestValue.Forms.init();
});


