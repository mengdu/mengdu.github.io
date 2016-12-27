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
		if(b.name == "firefox"){
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
			//返回当前距离顶部
			e.scrollTop = (document.body.scrollTop || document.documentElement.scrollTop);
			callback(e);
		});
	}
	if(typeof define === "function"){
    	// 如果define已被定义，模块化代码(CMD规范适用)
		define(function(){
			return mousewheel;
		});
    }else{
    	//返回对象方便使用(mdtool.fun就可以使用)
		window.mousewheel=mousewheel;
    }
	
})(window);