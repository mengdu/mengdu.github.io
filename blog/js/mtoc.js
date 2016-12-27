;(function(){
if( !$ ){
	console.warn('"mtoc" 插件必须引用jQuery库');
	return ;
}

$.fn.mtoc = function(){
	return new toc(this);
}

function toc(elem){
	var tocArr = [];
	elem.find('h1,h2,h3,h4,h5,h6').each(function(e , elem){
		//console.log(e,elem);
		if(elem.id.length > 0){
			tocArr.push({type:elem.tagName.toLocaleLowerCase() , id:elem.id});
		}
	});
	this.tocArr = tocArr;
	//return tocArr;
}
toc.prototype.treeObject = function(h){
	return treeObject(this.tocArr , h || 1);
}
toc.prototype.treeHtml = function(className){
	//console.log(className || 'nav');
	return treeHtml(treeObject(this.tocArr) , (className || 'nav'));
}
function treeObject(arr,h) {
	var tempIndex = -1;
	var tempArr = [];
	var len = arr.length;
	var h = h || 1;
	for(var i = 0 ; i < len; i++){
		//console.log(arr[i],h,tempIndex);
		if( arr[i].type > 'h'+h ){
			//如果是第一次
			if(tempIndex == -1){
				tempArr.push({
					type:arr[i].type,
					id:arr[i].id,
					childs:[],
				});
				++tempIndex;
			//如果arr[i]与上一个相同，则push为同级
			}else if(tempArr[tempIndex]['type'] == arr[i].type){
				tempArr.push({
					type:arr[i].type,
					id:arr[i].id,
					childs:[],
				});
				++tempIndex;
			}else{
				//入栈一个子元素
				tempArr[tempIndex]['childs'].push(arr[i]);
			}
			
		}else{
			++tempIndex;
			tempArr.push({
				type:arr[i].type,
				id:arr[i].id,
				childs:[],
			});
		}
	}
	h++;
	if(h > 6){
		return tempArr;
	}
	for(var j = 0 ; j < tempArr.length ; j++){
		if( tempArr[j]['childs'].length > 0 ){
			tempArr[j]['childs'] = treeObject(tempArr[j]['childs'],h);
		}
		
	}
	return tempArr;
}
function treeHtml(arr,className){
	var html = '';
	html += '<ul class="'+className+'">';
	for(var i = 0 ; i < arr.length ; i++){

		html += '<li>';
		html += '<a href="#'+arr[i]['id']+'">'+arr[i]['id']+'</a>';
		if(arr[i]['childs'].length > 0){
			html += treeHtml( arr[i]['childs'] , className);
		}
		html += '</li>';
	}
	html += '</ul>';
	return html;
}
//window.tree = tree;




})();