(function( $ ) {
	'use strict';
	//document ready
	$(function(){

		//only show one review per a slide on mobile
		//get the attribute if it is set and this is in fact a slider
		$(".wprev-slider").each(function(){
			var oneonmobile = $(this).attr( "onemobil" );
			if(oneonmobile=='yes'){
				if (/Mobi|Android/i.test(navigator.userAgent) || $(window).width()<600) {
					/* this is a mobile device, continue */
					//get all the slider li elements, each li is a slide
					var li_elements_old = $(this).children('ul');
					//console.log(li_elements_old);
					if(li_elements_old.length>0){
						//get array of all the divs containing the individual slide
						var divrevs = li_elements_old.find('.w3_wprs-col');
						var divrevarray = divrevs.get();
						//get the classes of the 2 divs under the li
						var div1class = divrevs.parent().attr('class');
						var div2class = divrevs.attr('class');
						//only continue if finding the divs
						if(typeof div2class !== "undefined"){
							//remove the l2, l3, l4, l5 , l6
							div2class = div2class.replace(/[a-z]\d\b/g, 'l12');
							//use the divrevarray to make new li elements with one review in each
							var newulhtml = '';
							var i;
							for (i = 0; i < divrevarray.length; i++) { 
								if(i==0){
									newulhtml += '<li class="wprs_unslider-active"><div class="'+div1class+'"><div class="'+div2class+'">'+divrevarray[i].innerHTML + '</div></div></li>';
								} else {
									newulhtml += '<li><div class="'+div1class+'"><div class="'+div2class+'">'+divrevarray[i].innerHTML + '</div></div></li>';
								}
							}
							//add the load more button if found
							if($(this).find('.wprevpro_load_more_div')[0]!== undefined){
								newulhtml += '<li>'+$(this).find('.wprevpro_load_more_div')[0].outerHTML+'</li>';
							}
							newulhtml +='';
							//replace the old li with the new
							li_elements_old.html(newulhtml);
							//re-initialize the slider if we need to
						}
					}
				}
			}
		});
		//}
		//----------------------

		var savedheight= {};
		var wprevsliderini_height= {};
		var wprevsliderini_height_widget= {};
		var smallestwprev= {};

			$( ".wprevpro" ).on( "click", ".wprs_rd_more", function(event) {
				event.preventDefault();
				//var oldheight = $(this).parent().parent().height();	//height of individual review indrevdiv
				var oldheight = $(this).closest('.indrevdiv').height();
				//var oldouterheight = $(this).parent().parent().outerHeight();
				var oldouterheight = $(this).closest('.indrevdiv').outerHeight();

				//save these heights in an object so we can access them from read less click.
				var slideid = $(this).closest('.w3_wprs-col').index();
				var li_id = $(this).closest('li').index();
				
				//savedheight[slideid] = $(this ).parent().parent().css("height");
				savedheight[slideid] =$(this).closest('.indrevdiv').css("height");
				wprevsliderini_height[slideid] = $(this ).closest('.wprev-slider').css("height");
				wprevsliderini_height_widget[slideid] = $(this ).closest('.wprev-slider-widget').css("height");
				
				if(Number(wprevsliderini_height[slideid])<Number(smallestwprev[li_id]) || !smallestwprev[li_id] || typeof smallestwprev[li_id] === 'undefined'){
					//save the smallest value in this object, use if needed
					smallestwprev[li_id]=wprevsliderini_height[slideid];
				}
				if(Number(wprevsliderini_height_widget[slideid])<Number(smallestwprev[li_id]) || !smallestwprev[li_id] || typeof smallestwprev[li_id] === 'undefined'){
					//save the smallest value in this object, use if needed
					smallestwprev[li_id]=wprevsliderini_height_widget[slideid];
				}

				$(this).closest('.indrevdiv').css( 'height', 'auto' );
				$(this).closest('.indrevdiv').parent().css( 'height', 'auto' );
				$(this ).hide();
				$( this ).prevAll('span.wprs_rd_more_1').hide();
				$( this ).next('span').show(0, function() {
					// Animation complete.
					$( this ).css('display', 'inline');
					$( this ).next('.wprs_rd_less').show();
					setmoreheight(this);
				});

				var newheight =$(this).closest('.indrevdiv').height();
		
				//fix if we made smaller then set back to what it was.
				if(newheight<oldheight){
					if(oldouterheight>oldheight){
						$(this).closest('.indrevdiv').css( 'height', oldouterheight );
					}else {
						$(this).closest('.indrevdiv').css( 'height', oldheight );
					}
				}

			});
			
			function setmoreheight(morelink){
				//find height of .wprs_unslider-active then set .wprev-slider, only change if bigger
				var liheight = $(morelink ).closest( '.wprs_unslider-active' ).outerHeight({margin: true});
				//find max height of all slides
				var heights = $(morelink ).closest('.wprs_unslider').find( "li" ).map(function ()
							{
								return $(this).outerHeight();
							}).get(),
				overallheight = Math.max.apply(null, heights);
				if(liheight>overallheight || liheight==overallheight){
					$(morelink ).closest( '.wprev-slider' ).animate({height: liheight,}, 300 );
					$(morelink ).closest( '.wprev-slider-widget' ).animate({height: liheight,}, 300 );
				} else if(overallheight>100) {
					$(morelink ).closest( '.wprev-slider' ).animate({height: overallheight,}, 300 );
					$(morelink ).closest( '.wprev-slider-widget' ).animate({height: overallheight,}, 300 );
				}
			}
			
			//read less click
			$( ".wprevpro" ).on( "click", ".wprs_rd_less", function(event) {
				event.preventDefault();
				//test if this is force all same height or not
				var reshightno = $(this).hasClass("revsheightno");
				//get the slide ID of this read less so we know which height to pull
				var slideid = $(this).closest('.w3_wprs-col').index();
				var li_id = $(this).closest('li').index();
				$(this ).hide();
				$( this ).prev('span').hide( 0, function() {
					$(this ).prevAll('.wprs_rd_more').show();
					$( this ).prevAll('span.wprs_rd_more_1').show();
				});
				//check if there are no readless then use smallest value
				var checkreadless = $(this ).closest('.wprevprodiv').find('.wprs_rd_less:visible').length;
				//if checkreadless = 0 then we need to make smallest
				var tempsliderheight = wprevsliderini_height[slideid];
				var tempsliderheightwidget = wprevsliderini_height_widget[slideid];
				if(checkreadless==0){
					tempsliderheight = smallestwprev[li_id];
					tempsliderheightwidget = smallestwprev[li_id];
				}
				$(this ).closest('.indrevdiv').animate({
					height: savedheight[slideid],
				  }, 0 );
				$(this ).closest('.wprev-slider').animate({
					height: tempsliderheight,
				 }, 200 );
				$(this ).closest('.wprev-slider-widget').animate({
					height: tempsliderheightwidget,
				  }, 200 );

			});

			//show form on button click
			$(".wprevpro_btn_show_form").click(function(event){
				//make sure msgdb is hidden
				$(this).siblings(".wprevpro_form_msg").hide();
				$(this).next(".wprevpro_form_inner").find(".wprev_review_form").show();
				$(this).next(".wprevpro_form_inner").toggle(1000);
			});
			
			//check the form on submit
			$(".wprev_review_form").submit(function(event){
				var ratingreq = '';
				ratingreq = $( this ).find('#wprevpro_rating_req').val();
				if(ratingreq=="yes"){
					var checkedvalue = $('input[name=wprevpro_review_rating]:checked').val();
					if ($('input[name=wprevpro_review_rating]:checked').length && checkedvalue!='0') {
					   // at least one of the radio buttons was checked
					   //return true; // allow whatever action would normally happen to continue
					} else {
						   // no radio button was checked
						   alert('Please select a rating.');
						   $( ".wprevpro-rating" ).focus();
						   event.preventDefault(); 
						   return false; // stop whatever action would normally happen
					}
				}
			});
			
			//check if this browser supports ajax file upload FormData
			function wprev_supportFormData() {
				return !! window.FormData;
			}
			
			function hideshowloader(buttondiv,showloader){
				//hide the sumbit button so they don't push twice
				if(showloader==true){
					buttondiv.hide();
					buttondiv.next('.wprev_loader').show();
				} else {
					buttondiv.show();
					buttondiv.next('.wprev_loader').hide();
				}
			}
			
			function resetform(theform){
				$(theform).trigger("reset");
			}
			
			function closeformandscroll(showformbtn){
				//wait a couple of seconds, hide the form after the message is shown. only on hidden form
				if ( showformbtn.length ) {
					setTimeout(function(){
						showformbtn.next(".wprevpro_form_inner").toggle(1000);
						//scroll up back to button
						$('html, body').animate({scrollTop: $( ".wprevpro_btn_show_form" ).offset().top-200}, 1000);
					}, 1500);
				}
			}
			
			//when clicking stars on preview form
			$('.wprevpro-rating-radio-lbl').click(function() {
				var clickedstar = $( this ).prev().val();
				var globshowval = $( this ).closest('form').find('#wprev_globshowval').val();
				var globhiderest = $( this ).closest('form').find('#wprev_globhiderest').val();
				if(globshowval!=''){
					if(clickedstar>globshowval){
						//show social links
						$( this ).closest('form').find('.wprevpro-field-social_links').removeClass('hideme');
						$( this ).closest('form').find('.wprevpro-field-social_links').hide();
						$( this ).closest('form').find('.wprevpro-field-social_links').show('2000');
						//what to do with rest of form
						if(globhiderest=='hide'){
							$( this ).closest('form').find('.rofform').hide();
						}
					} else {
						$( this ).closest('form').find('.wprevpro-field-social_links').hide('2000');
						//what to do with rest of form
						if(globhiderest=='hide'){
							$( this ).closest('form').find('.rofform').show('2000');
						}
					}
				}

			});
			
			$( '#wprevpro_submit_ajax' ).click(function(event) {
				//ajax form submission
				//find the form id based on this button
				var thisform = $(this).closest('form');
				var thisformcontainer = $(this).closest('.wprevpro_form');
				var thisformdbmsgdiv = thisformcontainer.find('.wprevpro_form_msg');
				var thisformsbmitdiv = thisform.find('.wprevpro_submit');
				var thisshowformbtn = thisformcontainer.find('.wprevpro_btn_show_form');
				
				//hide the sumbit button so they don't push twice
				hideshowloader(thisformsbmitdiv,true);
				thisformdbmsgdiv.removeClass('wprevpro_submitsuccess');
				thisformdbmsgdiv.removeClass('wprevpro_submiterror');
				
				var fileuploadinput = thisform.find('#wprevpro_review_avatar');
				//default to formdata, but use serialize if not uploading file and browser supports it
				var useserializemethod = false;
				
				//check if we are uploading a file, if so then see if browser supports. if not then use regular submit
				var imgVal = fileuploadinput.val(); 
				var checkformdatasupport = wprev_supportFormData();
				if(imgVal!="" && checkformdatasupport==false){
					//formdata not supported
					return false;
				} else {
					//stop regular form submission continue with ajax
					event.preventDefault();
					if(checkformdatasupport==false){
						useserializemethod = true;
					}
				}

				//if we are not uploading a file use the serialize method
				if(useserializemethod==true){
					var stringofvariables = thisform.serialize();
					//console.log(stringofvariables);
				
					var senddata = {
						action: 'wprp_save_review',	//required
						wpfb_nonce: wprevpublicjs_script_vars.wpfb_nonce,
						cache: false,
						processData : false,
						contentType : false,
						data: stringofvariables,
						};
					//send to ajax to update db
					var jqxhr = jQuery.post(wprevpublicjs_script_vars.wpfb_ajaxurl, senddata, function (data){
						//console.log(data);
						var jsondata = $.parseJSON(data);
						if(jsondata.error=="no"){
								hideshowloader(thisformsbmitdiv,false);
								//display success message
								thisformdbmsgdiv.html(jsondata.successmsg);
								thisformdbmsgdiv.addClass('wprevpro_submitsuccess');
								thisformdbmsgdiv.show('slow');
								resetform(thisform);
								closeformandscroll(thisshowformbtn);
						} else {
								//display error message
								hideshowloader(thisformsbmitdiv,false);
								thisformdbmsgdiv.html(jsondata.dbmsg);
								thisformdbmsgdiv.addClass('wprevpro_submiterror');
								thisformdbmsgdiv.show('slow');
						}
						
					});
					jqxhr.fail(function() {
					  //display error message
						hideshowloader(thisformsbmitdiv,false);
						thisformdbmsgdiv.html(jsondata.dbmsg);
						thisformdbmsgdiv.addClass('wprevpro_submiterror');
						thisformdbmsgdiv.show('slow');
						hideshowloader(thisformsbmitdiv,false);
					});
				
				} else {
					//use formdata method
					//now using formdata so we can upload, almost works in all browsers
					var formdata = new FormData(thisform[0]);
					formdata.append('action', 'wprp_save_review');
					formdata.append('wpfb_nonce', wprevpublicjs_script_vars.wpfb_nonce);

					$.ajax({
						url: wprevpublicjs_script_vars.wpfb_ajaxurl,
						action: 'wprp_save_review',	//required
						wpfb_nonce: wprevpublicjs_script_vars.wpfb_nonce,
						type: 'POST',
						data: formdata,
						contentType:false,
						processData:false,
						success: function(data){
							var jsondata = $.parseJSON(data);
							//console.log(jsondata);
							if(jsondata.error=="no"){
								hideshowloader(thisformsbmitdiv,false);
								//display success message
								thisformdbmsgdiv.html(jsondata.successmsg);
								thisformdbmsgdiv.addClass('wprevpro_submitsuccess');
								thisformdbmsgdiv.show('slow');
								resetform(thisform);
								closeformandscroll(thisshowformbtn);
							} else {
								//display error message
								hideshowloader(thisformsbmitdiv,false);
								thisformdbmsgdiv.html(jsondata.dbmsg);
								thisformdbmsgdiv.addClass('wprevpro_submiterror');
								thisformdbmsgdiv.show('slow');
							}
						  },
						error: function(data){
							var jsondata = $.parseJSON(data);
							console.log(jsondata);
							//display error message
								hideshowloader(thisformsbmitdiv,false);
								thisformdbmsgdiv.html(jsondata.dbmsg);
								thisformdbmsgdiv.addClass('wprevpro_submiterror');
								thisformdbmsgdiv.show('slow');
						  },
					});
					
				}

			});
			
		
			//for clicking the floating badge
			$( ".wprevpro_badge_container" ).click(function(event) {
			var onclickaction = $(this).attr('onc');
			var onclickurl =  $(this).attr('oncurl');
			var onclickurltarget =  $(this).attr('oncurltarget');
			//only do this if not clicking an arrow  wprs_rd_less  wprev_pro_float_outerdiv-close  wprevpro_load_more_btn
			if(!$(event.target).closest('.wprs_unslider-arrow').length && !$(event.target).closest('.wprs_rd_less').length && !$(event.target).closest('.wprs_rd_more').length && !$(event.target).closest('.wprs_unslider-nav').length && !$(event.target).closest('a').length && !$(event.target).closest('.wprevpro_load_more_btn').length  && !$(event.target).closest('.wprev_pro_float_outerdiv-close').length) {
				if(onclickaction=='url'){
					if(onclickurl!=""){
						if(onclickurltarget=='same'){
							var win = window.open(onclickurl, '_self');
						} else {
							var win = window.open(onclickurl, '_blank');
						}
						if (win) {
							//Browser has allowed it to be opened
							win.focus();
						} else {
							//Browser has blocked it
							alert('Please allow popups for this website');
						}
					} else {
						alert("Please enter a Link to URL value.");
					}
					return false;
				} else if(onclickaction=='slideout'){
					//slideout the reviews from the side, find the correct one in relation to this click 
					$(this).siblings('.wprevpro_slideout_container').show();
					return false;
				}
			}

		});
		//close slideout onclick on everything but it
		$(document).click(function(event) { 
			if(!$(event.target).closest('.wprevpro_slideout_container').length && !$(event.target).closest('.updatesliderinput').length) {
				if($('.wprevpro_slideout_container').is(":visible")) {
					$('.wprevpro_slideout_container').hide();
				}
			}        
		});
		
		
		//for admin preview
		$( "#preview_badge_outer" ).on( "click", ".wprevpro_load_more_btn", function(event) {
				//need function to load more.
				loadmorerevs(this);
		});
			
		//for load more btn click, ajax more reviews and add to html
		$( ".wprevpro_load_more_btn" ).click(function(event) {
			loadmorerevs(this);
		});
		//console.log(wprevpublicjs_script_vars.wpfb_ajaxurl);
		function loadmorerevs(thebtn){
			//get number of review rows and per a row, use this number for offset call to db
			var spinner = $(thebtn).next( ".wprploadmore_loading_image" );
			var loadbtn = $(thebtn);
			var templateiddiv = $(thebtn).closest('div');
			var numperrow = $(thebtn).attr('perrow');
			var numrows = $(thebtn).attr('nrows');
			var cnum = $(thebtn).attr('callnum');
			var revtemplateid = $(thebtn).attr('tid');
			var ismasonry = $(thebtn).attr('ismasonry');
			var isslider = $(thebtn).attr('slideshow');
			var notinstr = $(thebtn).attr('notinstring');
			
			var cpostid = $(thebtn).attr('cpostid');
			var shortcodepageid = $(thebtn).attr('shortcodepageid');
			var shortcodelang = $(thebtn).attr('shortcodelang');
			
			var revsameheight = $(thebtn).attr( "revsameheight" );
			
			if (/Mobi|Android/i.test(navigator.userAgent) || $(window).width()<600) {
				var oneonmobile = $(thebtn).attr( "onemobil" );
			} else {
				var oneonmobile = 'no';
			}
			
			spinner.show();
			loadbtn.hide();

			//make ajax call
			 var senddata = {
				action: 'wprp_load_more_revs',	//required
				wpfb_nonce: wprevpublicjs_script_vars.wpfb_nonce,
				cache: false,
				processData : false,
				contentType : false,
				perrow: numperrow,
				nrows: numrows,
				callnum: cnum,
				notinstring:notinstr,
				revid: revtemplateid,
				onereview: oneonmobile,
				cpostid: cpostid,
				shortcodepageid: shortcodepageid,
				shortcodelang: shortcodelang,
				};
				//send to ajax to update db
				var jqxhr = jQuery.post(wprevpublicjs_script_vars.wpfb_ajaxurl, senddata, function (data){
					var IS_JSON = true;
					console.log(data);
					//strip everything outside of {}, workaround when wordpress generates and message
					data = data.substring(0, data.indexOf('}')+1);
					try
					   {
							var jsondata = $.parseJSON(data);
					   }
					   catch(err)
					   {
						   IS_JSON = false;
							spinner.hide();
					   }  
					if(data && data!="" && IS_JSON){
						var innerrevhtml = jsondata.innerhtml;
						var numreviews = jsondata.totalreviewsnum;
						var hideldbtn = jsondata.hideldbtn;
						var animateheight = jsondata.animateheight;
						//add to page
						if(isslider=='yes'){
							//add to btn slide
							loadbtn.parent('.wprevpro_load_more_div').before( innerrevhtml );
							if(hideldbtn!='yes'){
							//move btn slide to end
							var tempul = loadbtn.closest('li').next('li');
							var divtomove = loadbtn.parent('.wprevpro_load_more_div');
							divtomove.detach();
							tempul.append(divtomove);
							} else {
							loadbtn.closest('.wprs_unslider').find( "ol li:last").remove();
							}
							spinner.hide();
							//update slide height here if animateheight is true
							if(animateheight=='yes'){
								var liheight = $(thebtn ).closest('li').prev('li').css("height");
								$(thebtn ).closest( '.wprev-slider' ).animate({height: liheight,}, 750 );
								$(thebtn ).closest( '.wprev-slider-widget' ).animate({height: liheight,}, 750 );
							}
							//check to see if fixheight is set
							if(revsameheight=='yes'){
								checkfixheight(thebtn);
							}
							
						} else {
							if(ismasonry=='yes'){
								loadbtn.parent('.wprevpro_load_more_div').prev('.wprs_masonry').append( innerrevhtml );
							} else {
								loadbtn.parent('.wprevpro_load_more_div').before( innerrevhtml );
							}
							spinner.hide();
							if(numreviews>0){
								loadbtn.show();
							}
							if(hideldbtn=='yes'){
								loadbtn.hide();
							}
						}
						//update btn attribute callnum
						var newcallnum = Number(jsondata.callnum) +1;
						var newnotinstring = jsondata.newnotinstring;
						loadbtn.attr('notinstring',newnotinstring);
						loadbtn.attr('callnum',newcallnum);
						loadbtn.attr('hideldbtn',hideldbtn);

					} else {
						//console.log(data);
						spinner.hide();
					}
				});
				jqxhr.fail(function() {
					  //display error message
						console.log("fail");
						spinner.hide();
						loadbtn.show();
				});
			
		}
		
		//when loading more, check to see if we are fixing the height, if so then set the height here
		function checkfixheight(thebtn){
			//wprs_unslider
			var maxheights = $(thebtn).closest( '.wprs_unslider' ).find(".w3_wprs-col").find("p").parent().map(function (){return $(this).outerHeight();}).get();
			var maxHeightofslide = Math.max.apply(null, maxheights);
			$(thebtn).closest( '.wprs_unslider' ).find(".w3_wprs-col").find("p").parent().css( "height", maxHeightofslide );
			
			//fix if the new height is bigger than overallheight
			var liheight = $(thebtn ).closest( 'li' ).prevAll( '.wprs_unslider-active' ).outerHeight();
			//console.log(liheight);
			//find max height of all slides
			var heights = $(thebtn ).closest('.wprs_unslider').find( "li" ).map(function ()
						{
							return $(thebtn).outerHeight();
						}).get(),
				overallheight = Math.max.apply(null, heights);

			if(liheight>overallheight){
				$(thebtn ).closest( '.wprevpro' ).animate({height: liheight,}, 200 );
			}
		}
		
		//for closing float on click
		$( ".wprev_pro_float_outerdiv-close" ).click(function(event) {
			$(this).closest('.wprevpro_float_outer').hide('300');
			//add to session storage so we don't show on page reload
			//sessionStorage.setItem('wprevpro_clickedclose', 'yes');
			var floatid = $(this).attr('id');
			
			//need to grab current settings first
			var wprevfloats = JSON.parse(sessionStorage.getItem("wprevfloats") || "[]");
			wprevfloats.push({id: floatid, clickedclose: "yes"});
			
			sessionStorage.setItem("wprevfloats", JSON.stringify(wprevfloats));
			//var clickedclose = sessionStorage.getItem('wprevpro_clickedclose');
		});
		
		//check to see if sessionStorage holds a clicked x then hide if so.
		checksession();
		function checksession(){
			//initially show all floats here
			$("div.wprevpro_float_outer").show();
			//check to see if any floats need to be hidden
			var wprevfloats = JSON.parse(sessionStorage.getItem("wprevfloats") || "[]");
			wprevfloats.forEach(function(wprevfloat, index) {
				if(wprevfloat.clickedclose=='yes' || wprevfloat.firstvisithide =='yes'){
					//hide the float here
					$( "#"+wprevfloat.id ).parent('.wprev_pro_float_outerdiv').hide();
				}
					//console.log("[" + index + "]: " + wprevfloat.id);
			});
			//update the storage if we are only displaying on first visit here
			$("div.wprevpro_badge_container[firstvisit='yes']").each(function( index ) {
				var floatid = $(this).find('.wprev_pro_float_outerdiv-close').attr('id');
				//only set if not set before
				var filtered=wprevfloats.filter(function(item){
					return item.firstvisithide=="yes";         
				});
				if (filtered.length < 1) {
					wprevfloats.push({id: floatid, firstvisithide: "yes"});
					sessionStorage.setItem("wprevfloats", JSON.stringify(wprevfloats));
				}
			});
			
		}
		
		//check to see if we are flying this float in and delay
		//floatflyin();
		function floatflyin(){
			//get variables to see if we fly in or fade in
			var animatedir = $(".wprevpro_badge_container").attr('animatedir');
			var animatedelay = Number($(".wprevpro_badge_container").attr('animatedelay'))*1000;
			var floatdiv;
			var startcssval;
			if(animatedir=='right'){
				floatdiv = $(".wprevpro_badge_container").find(".wprev_pro_float_outerdiv");
				//fly this in from the right of the page
				startcssval = $(floatdiv).css("right");
				$(floatdiv).css("right", "-110%");
				if(animatedelay>0){
					setTimeout(function(){ $(floatdiv).animate({right: startcssval}, 1000 ); }, animatedelay);
				} else {
					$(floatdiv).animate({right: startcssval}, 1000 );
				}
			} else if(animatedir=='bottom'){
				floatdiv = $(".wprevpro_badge_container").find(".wprev_pro_float_outerdiv");
				//fly this in from the bottom of the page
				startcssval = $(floatdiv).css("bottom");
				$(floatdiv).css("bottom", "-110%");
				if(animatedelay>0){
					setTimeout(function(){ $(floatdiv).animate({bottom: startcssval}, 1000 ); }, animatedelay);
				} else {
					$(floatdiv).animate({bottom: startcssval}, 1000 );
				}
			} else if(animatedir=='left'){
				floatdiv = $(".wprevpro_badge_container").find(".wprev_pro_float_outerdiv");
				//fly this in from the left of the page
				startcssval = $(floatdiv).css("left");
				$(floatdiv).css("left", "-110%");
				if(animatedelay>0){
					setTimeout(function(){ $(floatdiv).animate({left: startcssval}, 1000 ); }, animatedelay);
				} else {
					$(floatdiv).animate({left: startcssval}, 1000 );
				}
			} else if(animatedir=='fade'){
				floatdiv = $(".wprevpro_badge_container").find(".wprev_pro_float_outerdiv");
				//fly this in from the left of the page
				startcssval = $(floatdiv).css("opacity");
				$(floatdiv).css("opacity", "0");
				if(animatedelay>0){
					setTimeout(function(){ $(floatdiv).animate({opacity: startcssval}, 1000 ); }, animatedelay);
				} else {
					$(floatdiv).animate({left: startcssval}, 1000 );
				}
			}
		}
		
	});

})( jQuery );
