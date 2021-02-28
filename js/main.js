'use strict';
(function () {
    funcManagement = function(options){ 
      var defaults = {

        },
        s = $.extend(defaults,options)
		var data_arr = [
			{id: 10,key:'games',displayname:'1',status:0,order:'0'},
			{id: 12,key:'defi',displayname:'2',status:1,order:'1'}
		];
		var disname_arr  = [
			{name:'Games', value:1},
			{name:'Defi', value:2},
			{name:'Domain', value:3}
		];


    function init(){
		var temp = localStorage.getItem("data_arr");
		if(temp){
			data_arr = JSON.parse(temp);
		}
		renderData();
		renderAddData();
    }

	function update_local_storage(){
		localStorage.setItem("data_arr",JSON.stringify(data_arr));
	}

	function addData(key,displayname,status,order){
		var position = 1;
		if(data_arr.length > 0){
			position = data_arr[0].id;
		}
		data_arr.forEach(function(item,index){
			if(position < item.id){
				position = item.id;
			}
		});
		data_arr.push({
			id : position + 1,
			key: key,
			displayname: displayname,
			status: status,
			order: order
		});

		update_local_storage();
	}

	function renderData(){
		data_arr.forEach(function(item,index){
			var displHtml = '';
			disname_arr.forEach(function(disname_item,index){
				if(item.displayname == disname_item.value){
					displHtml =  disname_item.name;
				}
			})
			console.log(displHtml)
			var status = (item.status == 0) ? '<img src="./images/check.png" alt="" />' : '<img src="./images/close.png" alt="" />';
			var html = $('<tr>'+
			'<td>'+ item.key +'</td>'+
			'<td>'+ displHtml +'</td>'+
			'<td>'+ status +'</td>'+
			'<td>'+ item.order  +'</td>'+
			'<td>'+'<a class="btn-edit" href="javascript:void(0)"><img src="./images/edit.png" alt="" /></a>' +'</td>'+
			'<td>'+'<a class="btn-delete" item-id="'+ item.id +'" href="javascript:void(0)"><img src="./images/delete.png" alt="" /></a>'+ '</td>'+
			'<td>'+'<input type="checkbox" id='+ "checkbox_"+ index +' value="'+item.id+'" >' +'<label for='+ "checkbox_"+ index +'>&nbsp;</label>'+'</td></tr>');
			$('#categories .table-cnt-inner table tbody').append(html);
			var htmlparents = $(this).parents('tr');
			html.find('.btn-delete').on("click",function(){
				var id = $(this).attr('item-id');
				deleteData(id,htmlparents);
			});
			html.find('.btn-edit').on("click",function(){
				$(".pubup-body .pubup-content").empty();
				$('body').addClass('pubup-open')
				$('.box-pubup').fadeIn();
				updateData(item);
			});
			deleteAllData(htmlparents);
		})
	}

	function deleteData(id,htmlparents){
		data_arr.forEach(function(item,index){
			if(id == item.id){
				data_arr.splice(index,1);
			}
		});
		htmlparents.remove();
		window.location.reload();
		update_local_storage();
	}

	function deleteAllData(htmlparents){
		$('#categories .delete-btn').on('click',function(){
			$('#categories table').find('input').each(function(){
				if( $(this).prop('checked') == true){
					var indexChek = $(this).val();
					deleteData(indexChek,htmlparents);
				}
			})
		})
	}

	function renderAddData(){
		$('#categories .list-btn .add-btn').on('click',function(){	
			var text = $('.box-pubup .pubup-ttl p').text(); 
			var ttl = text.replace("Edit Categories", "Add New Categories");	
			$('.box-pubup .pubup-ttl p').text(ttl);
			$(".pubup-body .pubup-content").empty();
			var dishtml ='';
			disname_arr.forEach(function(item,index){
				dishtml = dishtml + '<option value="'+item.value +'">'+item.name+'</option>';
			})
			var html =                   
			'<div class="content-inner"><p><label for="label-key">Key</label><input id="label-key" type="text"></p>'+
			'<p><label for="label-display-name">Display name</label>'+
			'<select id="label-display-name">'+dishtml+'</select></p>'+
			'<p><label for="label-status">Status</label>'+
			'<select id="label-status"><option value="0">Enable</option>'+
			'<option value="1">Disable</option></select></p>'+
			'<p><label for="label-order">Order</label><input id="label-order" type="text"></p></div>'+
			'<div class="add-btn"><a href="javascript:void(0)">Add</a></div>';
			$(".pubup-body .pubup-content").append(html);
			$('body').addClass('pubup-open')
			$('.box-pubup').fadeIn();
			$('.box-pubup .add-btn a').on('click',function(){		
				var key = $('#label-key').val();
				var displayname = $('#label-display-name').val();
				var status = $('#label-status option:selected').val();
				var order = $('#label-order').val();
				if(order == ''){
					var txt = '<span class="text-error">Order field is required</span>';
					$('#label-order').addClass('error');
					$('#label-order').after(txt);
				}else{
					addData(key,displayname,status,order);
					window.location.reload(); 
					$('body').removeClass('pubup-open');
					$('.box-pubup').fadeOut();
				}
			});
		});
	}

	function updateData(item){
		var dishtml ='';
		var htmlstatus= '';
		disname_arr.forEach(function(item_disname,index){
			if(  (item.displayname == item_disname.value) ){
				dishtml = dishtml + '<option value="'+item_disname.value +'" selected>'+item_disname.name+'</option>'
			}else{
				dishtml = dishtml + '<option value="'+item_disname.value +'">'+item_disname.name+'</option>'
			}
		})	
			if(item.status == 0){
				htmlstatus = '<option value="0" selected>Enable</option><option value="1">Disable</option>'
			}else{
				htmlstatus = '<option value="0">Enable</option><option value="1" selected >Disable</option>'
			} 

		var text = $('.box-pubup .pubup-ttl p').text(); 
		var ttl = text.replace("Add New Categories", "Edit Categories");
		$('.box-pubup .pubup-ttl p').text(ttl);
		var html =
		'<div class="content-inner"><p><label for="label-key">Key</label><input id="label-key" type="text" value ='+ item.key +'></p>'+
		'<p><label for="label-display-name">Display name</label><select id="label-display-name">'+ dishtml +'</select></p><p><label for="label-status">Status</label>'+
		'<select id="label-status">'+ htmlstatus +'</select></p><p><label for="label-order">Order</label><input id="label-order" type="text" value ='+ item.order +'></p></div>'+
		'<div class="edit-btn"><a href="javascript:void(0)">Edit</a></div>';
		$(".pubup-body .pubup-content").append(html);
		
		$('.box-pubup .edit-btn a').on('click',function(){
			var key = $('#label-key').val();
			var displayname = $('#label-display-name').val();
			var status = $('#label-status option:selected').val();
			var order = $('#label-order').val();
			data_arr.forEach(function(arr,index){
				if(item.id == arr.id){
					arr.key = key;
					arr.displayname = displayname;
					arr.status = status;
					arr.order = order;
				}
			})
			update_local_storage();
			window.location.reload(); 
		})
	}
	
      /*---- PUBLIC ----*/
    return {
		addData :addData,
		init: init
      }
    }

    var funcManagement = new funcManagement();
    funcManagement.init();

	$('.box-pubup .btn-close').on('click',function(){
		$('body').removeClass('pubup-open');
		$('.box-pubup').fadeOut();
	});

	$(".box-pubup").click(function (event) {
		var target = $(event.target);
		if (!(target.parents('.pubup-inside').length || target.hasClass('pubup-inside'))){
			$(".box-pubup").fadeOut();
			$("body").removeClass('pubup-open');
		}
	});
	var mq = window.matchMedia( "(max-width: 640px)" );
	function appendElement(e) {
		var headerh = $('.box-header').innerHeight();
		console.log(headerh)
		var windowh = $(window).height() - headerh;
		if (e.matches) {
			$('.block-title').css('height','auto')
		} else {
			$('.block-title').css('height',windowh)
		}
	}
	$(document).ready(function(){
		appendElement(mq);
		mq.addListener(appendElement);
	});
})()