;(function(window){
	var on=function(target,eventstr,callback){
		//console.log(typeof target);
		if(typeof target !== "object"){
			return;
		}
		if(document.all){
			target.attachEvent("on"+eventstr,callback);
		}else{
			target.addEventListener(eventstr,callback,false);
		}
	}
	var browser=function(){
		var userAgent = navigator.userAgent, //userAgent  
			Msie = /.*(msie) ([\w.]+).*/, //ie  
			Firefox = /.*(firefox)\/([\w.]+).*/, //firefox  
			Opera = /(opera).+version\/([\w.]+)/, //opera  
			Chrome = /.*(chrome)\/([\w.]+).*/, //chrome  
			Safari = /.*version\/([\w.]+).*(safari).*/;// safari  
		function uaMatch(ua) {  
		    var match = Msie.exec(ua);  
		    if (match != null) {  
		        return { name : match[1] || "", version : match[2] || "0" };  
		    }  
		    var match = Firefox.exec(ua);  
		    if (match != null) {  
		        return { name : match[1] || "", version : match[2] || "0" };  
		    }  
		    var match = Opera.exec(ua);  
		    if (match != null) {  
		        return { name : match[1] || "", version : match[2] || "0" };  
		    }  
		    var match = Chrome.exec(ua);  
		    if (match != null) {  
		        return { name : match[1] || "", version : match[2] || "0" };  
		    }  
		    var match = Safari.exec(ua);  
		    if (match != null) {  
		        return { name : match[2] || "", version : match[1] || "0" };  
		    }  
		    return { name : "null", version : "null" };  
		}
		var lang=navigator.language ? navigator.language  : navigator.userLanguage || "";
		var b=uaMatch(userAgent.toLowerCase());
		b.language=lang;
		return b;
	}
	var mousewheel=function(target,callback){
		var b=browser();
		var eventstr="mousewheel";
		if(b["name"] == "firefox"){
			eventstr="DOMMouseScroll";
		}
		on(target,eventstr,function(e){
			if(e.type == "DOMMouseScroll"){
				if(e.detail>0){
					//下
					e.direction="down";
				}else{
					e.direction="up";
				}
			}else{
				if(e.wheelDelta<0){
					//下
					e.direction="dow";
				}else{
					e.direction="up";
				}
			}
			callback(e);
		});
	}
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

	on(window,"load",function(){
		var scrollbars=document.getElementsByClassName(window['css-scrollbar']||"scrollbar");
		//console.log(scrollbars);
		var len=scrollbars.length;
		var i=0;
		for(;i<len;i++){
			listen(scrollbars[i]);
		}

		function listen(obj){
			//获取自定义设置
			var uop={};
			try{
				uop=eval('('+obj.getAttribute("data-scroll")+')');
			}catch(e){
				console.log(e.message);
				uop={};
			}
			obj.scrolloption={
				s:0,//位移 可以设定
				s0:0,//初始长度 不可改
				st:0,// 自动 (s-s0)/step+st
				speed:0,//运动位移变化 自动 (s-s0)/step
				nowel:(uop ? uop.nowel : 15),//阻力 可改
				clock:null,//时钟 自动
				step:(uop ? uop.step : (obj.scrollHeight/(obj.scrollHeight/obj.offsetHeight||1))),//步长 可改
				i:0 //debug
			};
			obj.scrollTo=function(val){
				var num=typeof val === "number" ? val : parseInt(val);
				obj.scrolloption.st=0;
				obj.scrolloption.s=Math.abs(obj.scrollTop-num);

				var scrollTop=0;
				if(obj.nodeName==="BODY" || obj.nodeName==="HTML"){
					scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
				}else{
					scrollTop=obj.scrollTop;
				}
				obj.scrolloption.s0=scrollTop;
				console.log(obj.scrolloption);
				if(num>=scrollTop){
					//下
					down(this);
				}else{
					//上
					up(this);
				}
			}
			obj.scrolltoTop=function(){
				obj.scrolloption.s=obj.scrollHeight;
				obj.scrolloption.st=0;
				obj.scrolloption.s0=obj.scrollTop;
				up(this);	
			}
			obj.scrolltoBottom=function(){
				obj.scrolloption.s=obj.scrollHeight;
				obj.scrolloption.st=0;
				obj.scrolloption.s0=obj.scrollTop;
				down(this);
			}
			mousewheel(obj,function(e){

				//console.log(e);
				e.target=e.target ? e.target : e.srcElement;//用于兼容ie
				//如果存在子元素不使用scroll效果则不做处理
				if(find(obj,e.target,(window['no-scroll'] ? window['no-scroll'] : "no-scroll"))){
					//console.log("不做处理");
					return;
				}
				


				obj.scrolloption.s=obj.scrolloption.step;
				obj.scrolloption.st=0;
				if(obj.nodeName==="BODY" || obj.nodeName==="HTML"){
					obj.scrolloption.s0=document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop;
				}else{
					obj.scrolloption.s0=obj.scrollTop;
				}
				
				//清理残余动画
				obj.clock=cancelAnimationFrame(obj.clock);
				//上
				if(e.direction=="up"){
					//到达顶部
					if(obj.nodeName==="BODY" || obj.nodeName==="HTML"){
						if(document.body.scrollTop==document.documentElement.scrollTop!=false){
							console.log('到达顶部');
							return;
						}
					}else{
						if(obj.scrollTop<=0){
							console.log('到达顶部');
							return false;
						}
					}
					
					up(obj);
				}else{
					//滚动到底部 对于body,html需要特殊处理
					if(obj.nodeName==="BODY" || obj.nodeName==="HTML"){
						//滚动到底
						if((document.body.scrollTop+document.documentElement.clientHeight)>=obj.scrollHeight ||
						(document.documentElement.scrollTop+document.documentElement.clientHeight)>=obj.scrollHeight){
							console.log('body/html滚动到底');
							return;
						}
					}else{
						if((obj.scrollTop+obj.offsetHeight)>=obj.scrollHeight){
							console.log('滚动到底');
							return;
						}
					}
					down(obj);
				}
				//ie
				if(document.all){
					e.cancelBubble=true;//阻止冒泡
					window.event.returnValue = false;//阻止默认动作
				}
				e.preventDefault ? e.preventDefault():"";
				e.stopPropagation ? e.stopPropagation():"";
			});
		}
		//查找指定class节点
		function find(obj,node,classStr){
			//console.log(node);
			//node.className=node.className ? node.className : node.class;
			//防止递归node越过obj
			if(obj===node){
				if(node.className && node.className.length>0){
					var classs=node.className.split(/\s+/),
					i=0,len=classs.length;
					for(;i<len;i++){
						if(classStr===classs[i]){
							return node;
						}
					}
				}
				return false;

			}else{
				if(node.className && node.className.length>0){
					var classs=node.className.split(/\s+/),
					i=0,len=classs.length;
					for(;i<len;i++){
						if(classStr===classs[i]){
							return node;
						}
					}
				}
			}
			//console.log(node.parentNode);
			if(node.parentNode){
				return find(obj,node.parentNode,classStr);
			}else{
				return false;
			}


		}
		window.find=find;
		function up(obj) {
			obj.clock=requestAnimationFrame(function(){
				obj.scrolloption.speed=Math.ceil((obj.scrolloption.s-obj.scrolloption.st)/obj.scrolloption.nowel);
				obj.scrolloption.st=obj.scrolloption.speed+obj.scrolloption.st;
				//处理body/html设置滚动条差异性
				if(obj.nodeName==="BODY" || obj.nodeName==="HTML"){
					//console.log("-------------------"+obj.nodeName+"------------------------");
					document.documentElement.scrollTop=document.body.scrollTop=obj.scrolloption.s0-obj.scrolloption.st;//for ie/firfox;for chrome
				}else{
					obj.scrollTop=obj.scrolloption.s0-obj.scrolloption.st;
				}
				
				obj.scrolloption.i++;
				//console.log(obj.scrolloption);
				if(obj.scrolloption.s>obj.scrolloption.st){
					up(obj);
				}else{
					console.log("滚动停止");
					obj.clock=cancelAnimationFrame(obj.clock);
				}
			});
		}
		function down(obj) {
			obj.clock=requestAnimationFrame(function(){
				obj.scrolloption.speed=Math.ceil((obj.scrolloption.s-obj.scrolloption.st)/obj.scrolloption.nowel);
				obj.scrolloption.st=obj.scrolloption.speed+obj.scrolloption.st;
				//处理body/html设置滚动条差异性
				if(obj.nodeName==="BODY" || obj.nodeName==="HTML"){
					document.documentElement.scrollTop=document.body.scrollTop=obj.scrolloption.s0+obj.scrolloption.st;//for ie/firfox;for chrome
				}else{
					obj.scrollTop=obj.scrolloption.s0+obj.scrolloption.st;
				}
				obj.scrolloption.i++;
				//console.log(obj.scrolloption);
				if(obj.scrolloption.s>obj.scrolloption.st){
					down(obj);
				}else{
					console.log("滚动停止");
					obj.clock=cancelAnimationFrame(obj.clock);
				}
			});
		}


		
	});
})(window);