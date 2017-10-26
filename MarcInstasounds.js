/* MarcInstasounds.js v20161025 - Marc Robledo 2016-2017 - http://www.marcrobledo.com/license */

/* MarcStringCleaner.js v2016 */
MarcStringCleaner=function(){var a=[/[\xc0\xc1\xc2\xc4\xe0\xe1\xe2\xe4]/g,"a",/[\xc8\xc9\xca\xcb\xe8\xe9\xea\xeb]/g,"e",/[\xcc\xcd\xce\xcf\xec\xed\xee\xef]/g,"i",/[\xd2\xd3\xd4\xd6\xf2\xf3\xf4\xf6]/g,"o",/[\xd9\xda\xdb\xdc\xf9\xfa\xfb\xfc]/g,"u",/[\xd1\xf1]/g,"n",/[\xc7\xe7]/g,"c",/[\xc6\xe6]/g,"ae",/\x26/g,"and",/\u20ac/g,"euro",/[^\w- ]/g,"",/( |-)/g,"_",/_+/g,"_",/^_|_$/g,""];String.prototype.clean||(String.prototype.clean=function(){for(var b=this.toLowerCase(),c=0;c<a.length;c+=2)b=b.replace(a[c],a[c+1]);return b})}();
/* Shortcuts */
function addEvent(e,v,f){e.addEventListener(v,f,false)}
function el(e){return document.getElementById(e)}




var MarcInstantSounds=(function(){
	return{
		search:function(query){
			query=query.clean().split('_');
			for(var i=0; i<AUDIOS.length; i++){
				var group=AUDIOS[i];
				for(var j=0; j<group.audios.length; j++){
					var audio=group.audios[j].clean();
					var found=true;
					for(var k=0;k<query.length && found;k++){
						if(audio.indexOf(query[k])===-1){
							found=false;
						}
					}
					el(group.prefix+'_'+j).style.display=found?'block':'none';
				}
			}
		}
	}
}());


function MarcAudio(audioId, button){
	this.disabled=false;
	this.loaded=false;
	this.playing=false;

	this.id=audioId;
	this.audio=null;
	this.button=button;
}
MarcAudio.prototype.click=function(){
	//console.log('click');
	if(!this.disabled){
		if(this.loaded){
			this.play();
		}else{
			this.disabled=true;
			this.audio=new Audio('./audios/'+this.id+'.mp3');
			this.audio.audioButton=this;
			addEvent(this.audio, 'canplaythrough', onLoadAudio);
			addEvent(this.audio, 'error', onErrorAudio);
			addEvent(this.audio, 'ended', onFinishedAudio);
		}
	}
}
MarcAudio.prototype.play=function(){
	//console.log('play '+this.id);
	this.playing=true;
	this.button.className+=' pushed';
	this.audio.currentTime=0;
	this.audio.play();
}
MarcAudio.prototype.stop=function(){
	//console.log('stop');
	this.playing=false;
	this.button.className=this.button.className.replace(/ pushed/g,'');
	this.audio.pause();
	this.audio.currentTime=0;
}
function onLoadAudio(){
	//console.log('onload');
	this.audioButton.disabled=false;
	this.audioButton.loaded=true;
	this.audioButton.play();
	this.audioButton.audio.removeEventListener('canplaythrough', onLoadAudio);
}

function onErrorAudio(){
	alert('error loading '+this.audioButton.id+'.mp3');
	this.audioButton.button.className+=' disabled';
}
function onFinishedAudio(){
	//console.log('onfinished');
	this.audioButton.playing=false;
	this.audioButton.button.className=this.audioButton.button.className.replace(/ pushed/g,'');
}



function clickButtonEvent(){this.buttonObj.click()}




function addGroupEvent(l,p,a){
	addEvent(l,'click', function(){
		visibleGroups[p]=!visibleGroups[p];
		var display=visibleGroups[p]?'block':'none';
		var menuLi=el('ul-menu').children[p];
		if(visibleGroups[p]){
			menuLi.className='checked';
		}else{
			menuLi.className='';
		}
		for(var i=0;i<a.length;i++){
			a[i].style.display=display;
		}
		//localStorage.write(visibleGroups);
	});
}


addEvent(window, 'load', function(){
	if(typeof APP_TITLE !== 'undefined'){
		el('title').innerHTML=APP_TITLE;
		document.getElementsByTagName('title')[0].innerHTML=APP_TITLE+' - MarcInstasounds.js';
	}

	visibleGroups=[];
	for(var i=0; i<AUDIOS.length; i++){
		visibleGroups[i]=true;

		var audioGroup=AUDIOS[i];

		var lis=[];
		for(var j=0; j<audioGroup.audios.length; j++){
			var audio=audioGroup.audios[j];
			var audioName;
			if(audio.indexOf('=')>=1){
				var matches=audio.match(/^(.+)=(.+)/);
				audio=matches[1];
				audioName=matches[2];
			}else{
				audioName=audio.replace(/_/g, ' ');
				audioName=audioName.charAt(0).toUpperCase()+audioName.slice(1); 
			}



			
			var button=document.createElement('div');
			button.className='button';

			if(audioGroup.color)
				button.className+=' '+audioGroup.color;

			var buttonTitle=document.createElement('div');
			buttonTitle.className='button-title';
			buttonTitle.innerHTML=audioName;

			var audioFile=audio.clean();
			if(audioGroup.prefix)
				audioFile=audioGroup.prefix+'/'+audioFile;
			addEvent(button,'click', clickButtonEvent);
			button.buttonObj=new MarcAudio(audioFile, button);


			var container=document.createElement('div');
			container.className='button-container';
			container.id=audioGroup.prefix+'_'+j;
			container.appendChild(button);
			container.appendChild(buttonTitle);

			var li=document.createElement('div');
			li.className='column large-2 medium-3 small-4';
			li.appendChild(container);
			el('ul').appendChild(li);
			lis.push(li);
		}

		var li=document.createElement('li');
		li.innerHTML=audioGroup.title;
		li.className='checked';
		el('ul-menu').appendChild(li);
		addGroupEvent(li, i, lis);
	}

	addEvent(el('button-menu'), 'click', function(){
		el('overlay').className=el('menu').className='open';
	});

	addEvent(el('overlay'), 'click', function(){
		el('overlay').className=el('menu').className='';
	});
});
