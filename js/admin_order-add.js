/*
* 2007-2014 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2014 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

function resetBind()
{
	$('.fancybox').fancybox({
		'type': 'iframe',
		'width': '90%',
		'height': '90%',
	});

	$('.fancybox_customer').fancybox({
		'type': 'iframe',
		'width': '90%',
		'height': '90%',
		'afterClose' : function () {
			searchCustomers();
		}
	});
	/*$("#new_address").fancybox({
		onClosed: useCart(id_cart)
	});*/
}

function add_cart_rule(id_cart_rule)
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "addVoucher",
			id_cart_rule: id_cart_rule,
			id_cart: id_cart,
			id_customer: id_customer
			},
		success : function(res)
		{
			displaySummary(res);
			$('#voucher').val('');
			var errors = '';
			if (res.errors.length > 0)
			{
				$.each(res.errors, function() {
					errors += this+'<br/>';
				});
				$('#vouchers_err').html(errors).show();
			}
			else
				$('#vouchers_err').hide();
		}
	});
}

function updateProductPrice(id_product, id_product_attribute, new_price)
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "updateProductPrice",
			id_cart: id_cart,
			id_product: id_product,
			id_product_attribute: id_product_attribute,
			id_customer: id_customer,
			price: new Number(new_price.replace(",",".")).toFixed(4).toString()
			},
		success : function(res)
		{
			displaySummary(res);
		}
	});
}

function displayQtyInStock(id)
{
	var id_product = $('#id_product').val();
	if ($('#ipa_' + id_product + ' option').length)
		var id_product_attribute = $('#ipa_' + id_product).val();
	else
		var id_product_attribute = 0;

	$('#qty_in_stock').html(stock[id_product][id_product_attribute]);
}

function duplicateOrder(id_order)
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "duplicateOrder",
			id_order: id_order,
			id_customer: id_customer
			},
		success : function(res)
		{
			id_cart = res.cart.id;
			$('#id_cart').val(id_cart);
			displaySummary(res);
		}
	});
}

function useCart(id_new_cart)
{
	id_cart = id_new_cart;
	$('#id_cart').val(id_cart);
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: false,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "getSummary",
			id_cart: id_cart,
			id_customer: id_customer
			},
		success : function(res)
		{
			displaySummary(res);
		}
	});
}

function getSummary()
{
	useCart(id_cart);
}

function deleteVoucher(id_cart_rule)
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "deleteVoucher",
			id_cart_rule: id_cart_rule,
			id_cart: id_cart,
			id_customer: id_customer
			},
		success : function(res)
		{
			displaySummary(res);
		}
	});
}

function deleteProduct(id_product, id_product_attribute, id_customization)
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "deleteProduct",
			id_product: id_product,
			id_product_attribute: id_product_attribute,
			id_customization: id_customization,
			id_cart: id_cart,
			id_customer: id_customer
			},
		success : function(res)
		{
			displaySummary(res);
		}
	});
}

function searchCustomers()
{
	$.ajax({
		type:"POST",
		url : token_admin_customers,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			tab: "AdminCustomers",
			action: "searchCustomers",
			customer_search: $('#customer').val()},
		success : function(res)
		{
			if(res.found)
			{
				var html = '';
				$.each(res.customers, function() {
					html += '<div class="customerCard col-lg-4">';
					html += '<div class="panel">';
					html += '<div class="panel-heading">'+this.firstname+' '+this.lastname;
					html += '<span class="pull-right">#'+this.id_customer+'</span></div>';
					html += '<span>'+this.email+'</span><br/>';
					html += '<span class="text-muted">'+((this.birthday != '0000-00-00') ? this.birthday : '')+'</span><br/>';
					html += '<div class="panel-footer">';
					html += '<a href="'+token_admin_customers+'&id_customer='+this.id_customer+'&viewcustomer&liteDisplaying=1" class="btn btn-default fancybox"><i class="icon-search"></i> '+details_txt+'</a>';
					html += '<button type="button" data-customer="'+this.id_customer+'" class="setup-customer btn btn-default pull-right"><i class="icon-arrow-right"></i> '+choose_txt+'</button>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
				});
			}
			else
				html = '<div class="alert alert-warning"><i class="icon-warning-sign"></i>&nbsp;{l s='No customers found'}</div>';
			$('#customers').html(html);
			resetBind();
		}
	});
}


function setupCustomer(idCustomer)
{
	$('#carts').show();
	$('#products_part').show();
	$('#vouchers_part').show();
	$('#address_part').show();
	$('#carriers_part').show();
	$('#summary_part').show();
	var address_link = $('#new_address').attr('href');
	id_customer = idCustomer;
	id_cart = 0;
	$('#new_address').attr('href', address_link.replace(/id_customer=[0-9]+/, 'id_customer='+id_customer));
	$.ajax({
		type:"POST",
		url : admin_cart_link,
		async: false,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "searchCarts",
			id_customer: id_customer,
			id_cart: id_cart
		},
		success : function(res)
		{
			if(res.found)
			{
				var html_carts = '';
				var html_orders = '';
				$.each(res.carts, function() {
					html_carts += '<tr>';
					html_carts += '<td>'+this.id_cart+'</td>';
					html_carts += '<td>'+this.date_add+'</td>';
					html_carts += '<td>'+this.total_price+'</td>';
					html_carts += '<td class="text-right">';
					html_carts += '<a title="'+view_cart_txt+'" class="fancybox btn btn-default" href="index.php?tab=AdminCarts&id_cart='+this.id_cart+'&viewcart&token='+token_admin_cart+'&liteDisplaying=1#"><i class="icon-search"></i>&nbsp;'+details_txt+'</a>';
					html_carts += '&nbsp;<a href="#" title="'+use_order_txt+'" class="use_cart btn btn-default" rel="'+this.id_cart+'"><i class="icon-arrow-right"></i>&nbsp;'+use_txt+'</a>';
					html_carts += '</td>';
					html_carts += '</tr>';
				});

				$.each(res.orders, function() {
					html_orders += '<tr>';
					html_orders += '<td>'+this.id_order+'</td><td>'+this.date_add+'</td><td>'+(this.nb_products ? this.nb_products : '0')+'</td><td>'+this.total_paid_real+'</span></td><td>'+this.payment+'</td><td>'+this.order_state+'</td>';
					html_orders += '<td class="text-right">';
					html_orders += '<a href="'+admin_order_tab_link+'&id_order='+this.id_order+'&vieworder&liteDisplaying=1#" title="'+view_order_txt+'" class="fancybox btn btn-default"><i class="icon-search"></i>&nbsp;'+details_txt+'</a>';
					html_orders += '&nbsp;<a href="#" "title="'+duplicate_order_txt+'" class="duplicate_order btn btn-default" rel="'+this.id_order+'"><i class="icon-arrow-right"></i>&nbsp;'+use_txt+'</a>';
					html_orders += '</td>';
					html_orders += '</tr>';
				});
				$('#nonOrderedCarts table tbody').html(html_carts);
				$('#lastOrders table tbody').html(html_orders);
			}
			if (res.id_cart)
			{
				id_cart = res.id_cart;
				$('#id_cart').val(id_cart);
			}
			displaySummary(res);
			resetBind();
		}
	});
}

function updateDeliveryOptionList(delivery_option_list)
{
	var html = '';
	if (delivery_option_list.length > 0)
	{
		$.each(delivery_option_list, function() {
			html += '<option value="'+this.key+'" '+(($('#delivery_option').val() == this.key) ? 'selected="selected"' : '')+'>'+this.name+'</option>';
		});
		$('#carrier_form').show();
		$('#delivery_option').html(html);
		$('#carriers_err').hide();
	}
	else
	{
		$('#carrier_form').hide();
		$('#carriers_err').show().html(msg_no_carrier_available);
	}
}

function searchProducts()
{
	$('#products_part').show();
	$.ajax({
		type:"POST",
		url: admin_orders_tab_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token,
			tab: "AdminOrders",
			action: "searchProducts",
			id_cart: id_cart,
			id_customer: id_customer,
			id_currency: id_currency,
			product_search: $('#product').val()},
		success : function(res)
		{
			var products_found = '';
			var attributes_html = '';
			var customization_html = '';
			stock = {};

			if(res.found)
			{
				if (!customization_errors)
					$('#products_err').addClass('hide');
				else
					customization_errors = false;
				$('#products_found').show();
				products_found += '<label class="control-label col-lg-3">'+product_txt+'</label><div class="col-lg-6"><select id="id_product" onclick="display_product_attributes();display_product_customizations();"></div>';
				attributes_html += '<label class="control-label col-lg-3">'+combination_txt+'</label><div class="col-lg-6">';
				$.each(res.products, function() {
					products_found += '<option '+(this.combinations.length > 0 ? 'rel="'+this.qty_in_stock+'"' : '')+' value="'+this.id_product+'">'+this.name+(this.combinations.length == 0 ? ' - '+this.formatted_price : '')+'</option>';
					attributes_html += '<select class="id_product_attribute" id="ipa_'+this.id_product+'" style="display:none;">';
					var id_product = this.id_product;
					stock[id_product] = new Array();
					if (this.customizable == '1')
					{
						customization_html += '<div class="bootstrap"><div class="panel"><div class="panel-heading">'+customization_txt+'</div><form id="customization_'+id_product+'" class="id_customization" method="post" enctype="multipart/form-data" action="'+admin_cart_link+'" style="display:none;">';
						customization_html += '<input type="hidden" name="id_product" value="'+id_product+'" />';
						customization_html += '<input type="hidden" name="id_cart" value="'+id_cart+'" />';
						customization_html += '<input type="hidden" name="action" value="updateCustomizationFields" />';
						customization_html += '<input type="hidden" name="id_customer" value="'+id_customer+'" />';
						customization_html += '<input type="hidden" name="ajax" value="1" />';
						$.each(this.customization_fields, function() {
							class_customization_field = "";
							if (this.required == 1){ class_customization_field = 'required' };
							customization_html += '<div class="form-group"><label class="control-label col-lg-3 ' + class_customization_field + '" for="customization_'+id_product+'_'+this.id_customization_field+'">';
							customization_html += this.name+'</label><div class="col-lg-9">';
							if (this.type == 0)
								customization_html += '<input class="form-control customization_field" type="file" name="customization_'+id_product+'_'+this.id_customization_field+'" id="customization_'+id_product+'_'+this.id_customization_field+'">';
							else if (this.type == 1)
								customization_html += '<input class="form-control customization_field" type="text" name="customization_'+id_product+'_'+this.id_customization_field+'" id="customization_'+id_product+'_'+this.id_customization_field+'">';
							customization_html += '</div></div>';
						});
						customization_html += '</form></div></div>';
					}

					$.each(this.combinations, function() {
						attributes_html += '<option rel="'+this.qty_in_stock+'" '+(this.default_on == 1 ? 'selected="selected"' : '')+' value="'+this.id_product_attribute+'">'+this.attributes+' - '+this.formatted_price+'</option>';
						stock[id_product][this.id_product_attribute] = this.qty_in_stock;
					});

					stock[this.id_product][0] = this.stock[0];
					attributes_html += '</select>';
				});
				products_found += '</select></div>';
				$('#products_found #product_list').html(products_found);
				$('#products_found #attributes_list').html(attributes_html);
				$('link[rel="stylesheet"]').each(function (i, element) {
					sheet = $(element).clone();
					$('#products_found #customization_list').contents().find('head').append(sheet);
				});
				$('#products_found #customization_list').contents().find('body').html(customization_html);
				display_product_attributes();
				display_product_customizations();
				$('#id_product').change();
			}
			else
			{
				$('#products_found').hide();
				$('#products_err').html(msg_no_products_found);
				$('#products_err').removeClass('hide');
			}
			resetBind();
		}
	});
}

function display_product_customizations()
{
	if ($('#products_found #customization_list').contents().find('#customization_'+$('#id_product option:selected').val()).children().length === 0)
		$('#customization_list').hide();
	else
	{
		$('#customization_list').show();
		$('#products_found #customization_list').contents().find('.id_customization').hide();
		$('#products_found #customization_list').contents().find('#customization_'+$('#id_product option:selected').val()).show();
		$('#products_found #customization_list').css('height',$('#products_found #customization_list').contents().find('#customization_'+$('#id_product option:selected').val()).height()+95+'px');
	}
}

function display_product_attributes()
{
	if ($('#ipa_'+$('#id_product option:selected').val()+' option').length === 0)
		$('#attributes_list').hide();
	else
	{
		$('#attributes_list').show();
		$('.id_product_attribute').hide();
		$('#ipa_'+$('#id_product option:selected').val()).show();
	}
}

function updateCartProducts(products, gifts, id_address_delivery)
{
	var cart_content = '';
	$.each(products, function() {
		var id_product = Number(this.id_product);
		var id_product_attribute = Number(this.id_product_attribute);
		cart_quantity[Number(this.id_product)+'_'+Number(this.id_product_attribute)+'_'+Number(this.id_customization)] = this.cart_quantity;
		cart_content += '<tr><td><img src="'+this.image_link+'" title="'+this.name+'" /></td><td>'+this.name+'<br />'+this.attributes_small+'</td><td>'+this.reference+'</td><td><input type="text" rel="'+this.id_product+'_'+this.id_product_attribute+'" class="product_unit_price" value="' + this.numeric_price + '" /></td><td>';
		cart_content += (!this.id_customization ? '<div class="input-group fixed-width-md"><div class="input-group-btn"><a href="#" class="btn btn-default increaseqty_product" rel="'+this.id_product+'_'+this.id_product_attribute+'_'+(this.id_customization ? this.id_customization : 0)+'" ><i class="icon-caret-up"></i></a><a href="#" class="btn btn-default decreaseqty_product" rel="'+this.id_product+'_'+this.id_product_attribute+'_'+(this.id_customization ? this.id_customization : 0)+'"><i class="icon-caret-down"></i></a></div>' : '');
		cart_content += (!this.id_customization ? '<input type="text" rel="'+this.id_product+'_'+this.id_product_attribute+'_'+(this.id_customization ? this.id_customization : 0)+'" class="cart_quantity" value="'+this.cart_quantity+'" />' : '');
		cart_content += (!this.id_customization ? '<div class="input-group-btn"><a href="#" class="delete_product btn btn-default" rel="delete_'+this.id_product+'_'+this.id_product_attribute+'_'+(this.id_customization ? this.id_customization : 0)+'" ><i class="icon-remove text-danger"></i></a></div></div>' : '');
		cart_content += '</td><td>' + formatCurrency(this.numeric_total, currency_format, currency_sign, currency_blank) + '</td></tr>';

		if (this.id_customization && this.id_customization != 0)
		{
			$.each(this.customized_datas[this.id_product][this.id_product_attribute][id_address_delivery], function() {
				var customized_desc = '';
				if (this.datas[1].length)
				{
					$.each(this.datas[1],function() {
						customized_desc += this.name + ': ' + this.value + '<br />';
						id_customization = this.id_customization;
					});
				}
				if (this.datas[0] && this.datas[0].length)
				{
					$.each(this.datas[0],function() {
						customized_desc += this.name + ': <img src="' + pic_dir + this.value + '_small" /><br />';
						id_customization = this.id_customization;
					});
				}
		cart_content += '<tr><td></td><td>'+customized_desc+'</td><td></td><td></td><td>';
		cart_content += '<div class="input-group fixed-width-md"><a href="#" class="btn btn-default increaseqty_product" rel="'+id_product+'_'+id_product_attribute+'_'+id_customization+'" ><i class="icon-caret-up"></i></a><br /><a href="#" class="btn btn-default decreaseqty_product" rel="'+id_product+'_'+id_product_attribute+'_'+id_customization+'"><i class="icon-caret-down"></i></a></div>';
		cart_content += '<input type="text" rel="'+id_product+'_'+id_product_attribute+'_'+id_customization +'" class="cart_quantity" value="'+this.quantity+'" />';
		cart_content += '<div class="input-group-btn"><a href="#" class="delete_product btn btn-default" rel="delete_'+id_product+'_'+id_product_attribute+'_'+id_customization+'" ><i class="icon-remove"></i></a>';
		cart_content += '</div></div></td><td></td></tr>';
			});
		}
	});

	$.each(gifts, function() {
		cart_content += '<tr><td><img src="'+this.image_link+'" title="'+this.name+'" /></td><td>'+this.name+'<br />'+this.attributes_small+'</td><td>'+this.reference+'</td>';
		cart_content += '<td>'+gift_txt+'</td><td>'+this.cart_quantity+'</td><td>'+gift_txt+'</td></tr>';
	});
	$('#customer_cart tbody').html(cart_content);
}

function updateCartVouchers(vouchers)
{
	var vouchers_html = '';
	if (typeof(vouchers) == 'object')
		$.each(vouchers, function(){
			vouchers_html += '<tr><td>'+this.name+'</td><td>'+this.description+'</td><td>'+this.value_real+'</td><td class="text-right"><a href="#" class="btn btn-default delete_discount" rel="'+this.id_discount+'"><i class="icon-remove text-danger"></i>&nbsp;'+delete_txt+'</a></td></tr>';
		});
	$('#voucher_list tbody').html($.trim(vouchers_html));
	if ($('#voucher_list tbody').html().length == 0)
		$('#voucher_list').hide();
	else
		$('#voucher_list').show();
}

function updateCartPaymentList(payment_list)
{
	$('#payment_list').html(payment_list);
}

function fixPriceFormat(price)
{
	if(price.indexOf(',') > 0 && price.indexOf('.') > 0) // if contains , and .
		if(price.indexOf(',') < price.indexOf('.')) // if , is before .
			price = price.replace(',','');  // remove ,
	price = price.replace(' ',''); // remove any spaces
	price = price.replace(',','.'); // remove , if price did not cotain both , and .
	return price;
}

function displaySummary(jsonSummary)
{
	currency_format = jsonSummary.currency.format;
	currency_sign = jsonSummary.currency.sign;
	currency_blank = jsonSummary.currency.blank;
	priceDisplayPrecision = jsonSummary.currency.decimals ? 2 : 0;

	updateCartProducts(jsonSummary.summary.products, jsonSummary.summary.gift_products, jsonSummary.cart.id_address_delivery);
	updateCartVouchers(jsonSummary.summary.discounts);
	updateAddressesList(jsonSummary.addresses, jsonSummary.cart.id_address_delivery, jsonSummary.cart.id_address_invoice);

	if (!jsonSummary.summary.products.length || !jsonSummary.addresses.length || !jsonSummary.delivery_option_list)
		$('#carriers_part,#summary_part').hide();
	else
		$('#carriers_part,#summary_part').show();

	updateDeliveryOptionList(jsonSummary.delivery_option_list);

	if (jsonSummary.cart.gift == 1)
		$('#order_gift').attr('checked', true);
	else
		$('#carrier_gift').removeAttr('checked');
	if (jsonSummary.cart.recyclable == 1)
		$('#carrier_recycled_package').attr('checked', true);
	else
		$('#carrier_recycled_package').removeAttr('checked');
	if (jsonSummary.free_shipping == 1)
		$('#free_shipping').attr('checked', true);
	else
		$('#free_shipping_off').attr('checked', true);

	$('#gift_message').html(jsonSummary.cart.gift_message);
	if (!changed_shipping_price)
		$('#shipping_price').html('<b>' + formatCurrency(parseFloat(jsonSummary.summary.total_shipping), currency_format, currency_sign, currency_blank) + '</b>');
	shipping_price_selected_carrier = jsonSummary.summary.total_shipping;

	$('#total_vouchers').html(formatCurrency(parseFloat(jsonSummary.summary.total_discounts_tax_exc), currency_format, currency_sign, currency_blank));
	$('#total_shipping').html(formatCurrency(parseFloat(jsonSummary.summary.total_shipping_tax_exc), currency_format, currency_sign, currency_blank));
	$('#total_taxes').html(formatCurrency(parseFloat(jsonSummary.summary.total_tax), currency_format, currency_sign, currency_blank));
	$('#total_without_taxes').html(formatCurrency(parseFloat(jsonSummary.summary.total_price_without_tax), currency_format, currency_sign, currency_blank));
	$('#total_with_taxes').html(formatCurrency(parseFloat(jsonSummary.summary.total_price), currency_format, currency_sign, currency_blank));
	$('#total_products').html(formatCurrency(parseFloat(jsonSummary.summary.total_products), currency_format, currency_sign, currency_blank));
	id_currency = jsonSummary.cart.id_currency;
	$('#id_currency option').removeAttr('selected');
	$('#id_currency option[value="'+id_currency+'"]').attr('selected', true);
	id_lang = jsonSummary.cart.id_lang;
	$('#id_lang option').removeAttr('selected');
	$('#id_lang option[value="'+id_lang+'"]').attr('selected', true);
	$('#send_email_to_customer').attr('rel', jsonSummary.link_order);
	$('#go_order_process').attr('href', jsonSummary.link_order);
	$('#order_message').val(jsonSummary.order_message);
	resetBind();
}

function updateQty(id_product, id_product_attribute, id_customization, qty)
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "updateQty",
			id_product: id_product,
			id_product_attribute: id_product_attribute,
			id_customization: id_customization,
			qty: qty,
			id_customer: id_customer,
			id_cart: id_cart,
		},
		success : function(res)
		{
			displaySummary(res);
			var errors = '';
			if (res.errors.length)
			{
				$.each(res.errors, function() {
					errors += this + '<br />';
				});
				$('#products_err').removeClass('hide');
			}
			else
				$('#products_err').addClass('hide');
			$('#products_err').html(errors);
		}
	});
}

function resetShippingPrice()
{
	$('#shipping_price').val(shipping_price_selected_carrier);
	changed_shipping_price = false;
}

function addProduct()
{
	var id_product = $('#id_product option:selected').val();
	$('#products_found #customization_list').contents().find('#customization_'+id_product).submit();
	if (customization_errors)
		$('#products_err').removeClass('hide');
	else
	{
		$('#products_err').addClass('hide');
		updateQty(id_product, $('#ipa_'+id_product+' option:selected').val(), 0, $('#qty').val());
	}
}

function updateCurrency()
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "updateCurrency",
			id_currency: $('#id_currency option:selected').val(),
			id_customer: id_customer,
			id_cart: id_cart
			},
		success : function(res)
		{
				displaySummary(res);
		}
	});
}

function updateLang()
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "admincarts",
			action: "updateLang",
			id_lang: $('#id_lang option:selected').val(),
			id_customer: id_customer,
			id_cart: id_cart
			},
		success : function(res)
		{
				displaySummary(res);
		}
	});
}

function updateDeliveryOption()
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "updateDeliveryOption",
			delivery_option: $('#delivery_option option:selected').val(),
			gift: $('#order_gift').is(':checked')?1:0,
			gift_message: $('#gift_message').val(),
			recyclable: $('#carrier_recycled_package').is(':checked')?1:0,
			id_customer: id_customer,
			id_cart: id_cart
			},
		success : function(res)
		{
			displaySummary(res);
		}
	});
}

function sendMailToCustomer()
{
	$.ajax({
		type:"POST",
		url: admin_orders_tab_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token,
			tab: "AdminOrders",
			action: "sendMailValidateOrder",
			id_customer: id_customer,
			id_cart: id_cart
			},
		success : function(res)
		{
			if (res.errors)
				$('#send_email_feedback').removeClass('hide').removeClass('alert-success').addClass('alert-danger');
			else
				$('#send_email_feedback').removeClass('hide').removeClass('alert-danger').addClass('alert-success');
			$('#send_email_feedback').html(res.result);
		}
	});
}

function updateAddressesList(addresses, id_address_delivery, id_address_invoice)
{
	var addresses_delivery_options = '';
	var addresses_invoice_options = '';
	var address_invoice_detail = '';
	var address_delivery_detail = '';
	var delivery_address_edit_link = '';
	var invoice_address_edit_link = '';

	$.each(addresses, function() {
		if (this.id_address == id_address_invoice)
		{
			address_invoice_detail = this.formated_address;
			invoice_address_edit_link = admin_addresses_link+"&id_address="+this.id_address+"&updateaddress&realedit=1&liteDisplaying=1&submitFormAjax=1#";
		}

		if(this.id_address == id_address_delivery)
		{
			address_delivery_detail = this.formated_address;
			delivery_address_edit_link = admin_addresses_link+"&id_address="+this.id_address+"&updateaddress&realedit=1&liteDisplaying=1&submitFormAjax=1#";
		}

		addresses_delivery_options += '<option value="'+this.id_address+'" '+(this.id_address == id_address_delivery ? 'selected="selected"' : '')+'>'+this.alias+'</option>';
		addresses_invoice_options += '<option value="'+this.id_address+'" '+(this.id_address == id_address_invoice ? 'selected="selected"' : '')+'>'+this.alias+'</option>';
	});

	if (addresses.length == 0)
	{
		$('#addresses_err').show().html(msg_add_one_address);
		$('#address_delivery, #address_invoice').hide();
	}
	else
	{
		$('#addresses_err').hide();
		$('#address_delivery, #address_invoice').show();
	}

	$('#id_address_delivery').html(addresses_delivery_options);
	$('#id_address_invoice').html(addresses_invoice_options);
	$('#address_delivery_detail').html(address_delivery_detail);
	$('#address_invoice_detail').html(address_invoice_detail);
	$('#edit_delivery_address').attr('href', delivery_address_edit_link);
	$('#edit_invoice_address').attr('href', invoice_address_edit_link);
}

function updateAddresses()
{
	$.ajax({
		type:"POST",
		url: admin_cart_link,
		async: true,
		dataType: "json",
		data : {
			ajax: "1",
			token: token_admin_cart,
			tab: "AdminCarts",
			action: "updateAddresses",
			id_customer: id_customer,
			id_cart: id_cart,
			id_address_delivery: $('#id_address_delivery option:selected').val(),
			id_address_invoice: $('#id_address_invoice option:selected').val()
			},
		success : function(res)
		{
			updateDeliveryOption();
		}
	});
}
