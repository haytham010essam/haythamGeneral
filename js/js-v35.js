function _(el){
	return document.getElementById(el);
}
function _v(el){
	return document.getElementById(el).innerHTML;
}
function sizeModal(sze){
	_("modsize").className += " "+sze;
}
$(document).on('hidden.bs.modal','#myModal',function(){
	_("modsize").className = "modal-dialog";
});
//========================================
function PlayMP3(mp3){
	var audio = new Audio('js/'+mp3+'.mp3');
	audio.play();
}
//========================================
function LoadSite(fm,dv){
	_('bodyloader').style.display='block';
	if(_("btnSubmit")){_("btnSubmit").disabled=true;}
	var fd = new FormData(_(fm));
	var xhr = new XMLHttpRequest();
	if(dv=="qryTAB"){_("qryTAB").innerHTML='';}
	xhr.onreadystatechange=function()
		{
			if(xhr.readyState==4 && xhr.status==200)
			{
				_('bodyloader').style.display='none';
				_(dv).innerHTML=xhr.responseText;
				if(_("btnSubmit")){_("btnSubmit").disabled=false;}
			}else if(xhr.readyState==4 && xhr.status!=200){
				alert(xhr.status + ' - فشل في تحديث البيانات، تاكد من اتصالك بالانترنت');
			}
		}
	xhr.open("POST", "ajax.php?j=n");
	xhr.send(fd);
}
function DoAjax(pg,dv,qq){
	_('bodyloader').style.display='block';
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function()
		{
			if(xhr.readyState==4 && xhr.status==200)
			{
				_('bodyloader').style.display='none';
				_(dv).innerHTML=xhr.responseText;
			}else if(xhr.readyState==4 && xhr.status!=200){
				alert(xhr.status + ' - فشل في جلب البيانات');
			}
		}
	xhr.open("GET", "ajax.php?pdg="+pg+"&dv="+dv+"&q="+qq);
	xhr.send();
}
//========================================
window.onhashchange = function (){
    var hashTAG = location.hash.replace("#","");
	var xPGxDO = hashTAG.split("&");
	if(xPGxDO[0]){
		LoadTAB(xPGxDO[0],xPGxDO[1]);
	}else{
		LoadTAB('mainTAB','');
	}
};
//========================================
function LoadTAB(tabNme,navBtn){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("mainTAB");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    _(tabNme).style.display = "block";
    
	tablinks = document.getElementsByClassName("list-group-item");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].classList.remove("active");
	}
	if(navBtn){_(navBtn).classList.add("active");}
	if(tabNme!="mainTAB"){
		window.location.hash = tabNme + "&" + navBtn;
	}else{
		window.location.hash = "";
	}
	window.scrollTo(0,0);
}
//========================================
function fmPOST(fm){
	var xhr = new XMLHttpRequest();
	var fd = new FormData(_(fm));
	
	var mdl1 = _('modalload').style;
	var mdl2 = _('modalbody').style;
	var btn1 = _('modalbtn1').style;
	var btn2 = _('modalbtn2').style;
	mdl1.display='block';
	mdl2.display='none';
	btn1.display='none';
	btn2.display='none';
	
	xhr.onreadystatechange=function()
		{
			if(xhr.readyState==4 && xhr.status==200)
			{
				mdl1.display='none';
				mdl2.display='block';
				mdl2.innerHTML='';
				btn2.display='inline';
				_('modalbody').innerHTML = xhr.responseText;
				var res = JSON.parse(xhr.responseText);
				if(res.rVSA){_('admRVSA').innerHTML=Number.parseFloat(res.rVSA).toFixed(2);_('admRVS2').innerHTML=Number.parseFloat(res.rVSA).toFixed(4);}
				if(res.ST == 'ERR')
					{
						if(res.SRV){
							_('modalbody').innerHTML = '<input type="hidden" name="srv" value="'+res.SRV+'" /> \
													<input type="hidden" name="cmob" value="'+res.MOB+'" /> \
													<i class="fas fa-times fa-3x"></i><br><p>'+res.SMS+'</p>';
							if(res.BTN){btn1.display='inline';_('modalbtn1').innerHTML=res.BTN;}else{btn1.display='none';}
						}else{
							_('modalbody').innerHTML = '<i class="fas fa-times fa-3x"></i><br><p>'+res.SMS+'</p>';
						}
					}else if(res.ST == 'INF'){
						if(['mowe','moor','moet','movo'].indexOf(res.SRV)>=0){
							var TTL = '<h1>'+res.MOB+'</h1>';
						}else{
							var TTL = '';
						}
						var p = TTL+'<table class="table table-striped"> \
									<input type="hidden" name="srv" value="'+res.SRV+'" /> \
									<input type="hidden" name="cmob" value="'+res.MOB+'" /> \
									<input type="hidden" name="avsa" value="'+res.VSA+'" /> \
									<input type="hidden" name="do" value="'+res.NXT+'" />';
						for (var key in res.data){
							if (res.data.hasOwnProperty(key)) {
								p += "<tr><td>" + key + "</td><td dir=\"auto\">" + res.data[key] + "</td></tr>";
							}
						}
						p += '</table>';
						_('modalbody').innerHTML = p;
						if(res.BTN){btn1.display='inline';_('modalbtn1').innerHTML=res.BTN;}else{btn1.display='none';}
					}else if(res.ST == 'YES' || res.ST == 'DON'){
						PlayMP3('done');
						var p = '<i class="fa fa-check fa-3x text-success"></i><table class="table table-striped"> \
									<input type="hidden" name="srv" value="'+res.SRV+'" /> \
									<input type="hidden" name="cmob" value="'+res.MOB+'" /> \
									<input type="hidden" name="avsa" value="'+res.VSA+'" /> \
									<input type="hidden" name="do" value="'+res.NXT+'" />';
						for (var key in res.data){
							if (res.data.hasOwnProperty(key)) {
								p += "<tr><td>" + key + "</td><td dir=\"auto\">" + res.data[key] + "</td></tr>";
							}
						}
						if(res.ST != 'DON'){
						p += '</table><a class="btn btn-primary" href="ajax.php?pdg=print&bid='+res.BID+'" target="_blank"><i class="fas fa-print spi"></i> طباعة</a>';
						}
						_('modalbody').innerHTML = p;
						if(res.BTN){btn1.display='inline';_('modalbtn1').innerHTML=res.BTN;}else{btn1.display='none';}
						$('form').trigger("reset");
					}
			}else if(xhr.readyState==4 && xhr.status!=200){
				_('modalbody').innerHTML='<i class="fas fa-times fa-2x"></i><br> \
											خطأ في الاتصال بالسيرفر \
											<table class="table table-striped"> \
											<tr><td>كود الخطأ</td><td>'+xhr.status+'</td></tr> \
											<tr><td>رد السيرفر</td><td>'+xhr.responseText+'</td></tr> \
											<tr><td>ملاحظات</td><td>تحقق من تنفيذ العمليه من السجل</td></tr> \
											</table>';
			}
			$('#frmModal button:visible:enabled:first').focus();
		}
	xhr.open("POST", "ajax.php");
	xhr.send(fd);
}