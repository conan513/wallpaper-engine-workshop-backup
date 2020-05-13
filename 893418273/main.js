// MIT License

// Copyright (c) [2017] [Karteek Suryadevara||V3ng3nc3]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


//Customization
var userDays = ["S","M","T","W","T","F","S"];
var userTextSrting = null;
//var userTextSrting = "v3ng3n3";
var customUserFont = "Arial";

//FPS
var showFPS;
var fps = 0;
var frameRate = 0;
var pframeRate = 0;
//Canvas
var canvas;
var ctx;
//Background
var colorBackground;
var videoSource;
var backgroundColor;
var imageSize;
var imagePath;
var slideCounter = 0;
var transitionCounter = 0;
var intervalMultiplier;
var interval;
var userCount;
//Clock
var showClock;
var twelveHours;
var userHourPosX;
var userHourPosY;
var showSecs;
var showDay;
var shortHand;
var userDayPosX;
var userDayPosY;
var removeColon;
var clockFont;
var clockSize;
var customClkColor;
var clockColor;
var clockOpacity;
var blurValueClk;
var clkPositionX;
var clkPositionY;
var finalString;
var hourString = "am";
var dayString;
var userShortHand;
var clockFontWeight = "normal";
//Text
var showText;
var textString = userTextSrting;
var textFont;
var textSize;
var customTxtColor;
var textColor;
var textOpacity;
var blurValueTxt;
var textPositionX;
var textPositionY;
var textFontWeight = "normal";
//Circle
var customCircColor;
var circleColor;
var circleOpacity;
var circleRadius;
var circleDegree;
var circleRotate;
var imgSource;
var autoLogoRotate;
var userLogoRotate;
var logoRotate = 0;
var secondCircle;
var customSecondCircColor;
var secondCircleColor;
var secondCircleOpacity;
var secondCircleRadius;
var radiusCircle;
//Bars
var customBarColor;
var barColor;
var barOpacity;
var barWidth;
var autoRotate;
var barRotate =0;
var userBarRotate;
var autoRotateSpeed;
var barDegree;
var RainBow;
var blurValue;
var barLength;
var randomOnBeat;
var singleRandomOnBeat;
var timerxx = 0;
var userSpectrumRotate;
//Positioning
var positionX;
var positionY;
var barCircleDistance;
//Particles
var particles = {};
var particleIndex = 0;
var particleNum;
var pNum;
var pNum1;
var pNum2;
var particleColor;
var customParColor;
var particleOpacity;
var rainbowParticle;
var twinkle;
var fromParticle;
var userParticleRadius;
var particleNumberStyle2 = 1000;
var particleStyle = [];
var maxDepth = 4;
var clearOpacity = 1;
var speed = 2;
//Audio
var audioCount;
var bassShake;
var bassShakeTolerance;
var bassBeatTolarance =0;
var bassShakeText;
var bassShakeClock;
var bassEffectMult1;
var bassEffectMult2;
var bassEffectMult3;
var bassEffectMult4;
var bassEffectMult5;
var normalizeBars;
var normaliseReposiveness;
var noiseOption;
var reverseRight;
var sum= 0;
//Arrays
var smooth = [];
var smoothSample = [];
var audioSample = [];
var audioSampleA = [];

(smooth = []).length = 128; smooth.fill(0);
(smoothSample = []).length = 128; smooth.fill(0);
(audioSample = []).length = 128; audioSample.fill(0);
(audioSampleA = []).length = 128; audioSampleA.fill(0);
//json
window.wallpaperPropertyListener = {
	applyUserProperties: function (properties){
		if(properties.normalize){
			normalizeBars = properties.normalize.value;
		}
		if(properties.noise){
			noiseOption = properties.noise.value;
		}
		if(properties.reverseright){
			reverseRight = properties.reverseright.value;
		}
		if(properties.resposive){
			normaliseReposiveness = properties.resposive.value / 100;
		}
		if (properties.backgroundsource) {
			if (properties.backgroundsource.value) {
				switch (properties.backgroundsource.value) {
					case 1:
					colorBackground = true;
					imageBackground = false;
					slideShow = false;
					videoBackground = false;
					break;
					case 2:
					colorBackground = false;
					imageBackground = true;
					slideShow = false;
					videoBackground = false;
					break;
					case 3:
					colorBackground = false;
					imageBackground = false;
					slideShow = true;
					videoBackground = false;
					break;
					case 4:
					colorBackground = false;
					imageBackground = false;
					slideShow = false;
					videoBackground = true;
					break;
				}
			}
			bg();
		}
		if(properties.backgroundcolor){
			var customColor = properties.backgroundcolor.value.split(' ');
			customColor = customColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			backgroundColor = "rgb(" + customColor + ")";
		}
		if(properties.backgroundimage){
			if (properties.backgroundimage.value) {
				imagePath = "file:///" + properties.backgroundimage.value;
				bg();				
			}else{
				document.querySelector("#bgimg").style.backgroundImage = null;
				imagePath = null;
			}
		}
		if(properties.imageoptions){
			if(properties.imageoptions.value) {
				switch (properties.imageoptions.value){
					case 1:
					imageSize = "initial";
					break;
					case 2:
					imageSize = "cover";
					break;
					case 3:
					imageSize = "contain";
					break;
				}
			}
			bg();
		}
		if(properties.customrandomdirectory){
			if(properties.customrandomdirectory.value){
				bg();	
			}
		}
		if(properties.slideshowInterval){
			if(properties.slideshowInterval.value){
				interval = properties.slideshowInterval.value;
				userCount = interval * intervalMultiplier;
			}
		}
		if(properties.slideshowIntervalMultiplier){
			if(properties.slideshowIntervalMultiplier.value){
				intervalMultiplier = properties.slideshowIntervalMultiplier.value;
				userCount = interval * intervalMultiplier;
			}
		}
		if(properties.backgroundvideonumber){
			if(properties.backgroundvideonumber.value) {
				switch (properties.backgroundvideonumber.value){
					case 1:
					videoSource = "1.webm";
					break;
					case 2:
					videoSource = "2.webm";
					break;
					case 3:
					videoSource = "3.webm";
					break;
					case 4:
					videoSource = "4.webm";
					break;
					case 5:
					videoSource = "5.webm";
					break;
				}
				bg();
			}
		}
		if(properties.showclock){
			showClock = properties.showclock.value;
			clock();
		}
		if(properties.bassshakeclock){
			bassShakeClock = properties.bassshakeclock.value;
		}
		if(properties.hrmode){
			twelveHours = properties.hrmode.value;
			clock();
		}
		if(properties.userhrposx){
			userHourPosX = properties.userhrposx.value;
		}
		if(properties.userhrposy){
			userHourPosY = properties.userhrposy.value;
		}
		if(properties.showsecs){
			showSecs = properties.showsecs.value;
			clock();
		}
		if(properties.showday){
			showDay = properties.showday.value;
		}
		if(properties.texttype){
			if(properties.texttype.value) {
				switch (properties.texttype.value){
					case 1:
					shortHand = false;
					userShortHand = false;
					break;
					case 2:
					shortHand = true;
					userShortHand = false;
					break;
					case 3:
					shortHand = false;
					userShortHand = true;
					break;
				}
				clock();
			}
		}
		if(properties.userdayposx){
			userDayPosX = properties.userdayposx.value;
		}
		if(properties.userdayposy){
			userDayPosY = properties.userdayposy.value;
		}
		if(properties.removecolon){
			removeColon = properties.removecolon.value;
			clock();
		}
		if (properties.clockfont) {
			if (properties.clockfont.value) {
				switch (properties.clockfont.value) {
					case 1:
					clockFont = customUserFont;
					break;
					case 2:
					clockFont = "pompiere_regular";
					break;
					case 3:
					clockFont = "open_sanslight";
					break;
					case 4:
					clockFont = "maven_proregular";
					break;
					case 5:
					clockFont = "james_fajardoregular";
					break;
					case 6:
					clockFont = "happy_monkeyregular";
					break;
					case 7:
					clockFont = "digital-7regular";
					break;
					case 8:
					clockFont = "didact_gothicregular";
					break;
					case 9:
					clockFont = "changa_oneregular";
					break;
					case 10:
					clockFont = "waltographregular";
					break;
					case 11:
					clockFont = "timeburnerregular";
					break;
					case 12:
					clockFont = "still_timeregular";
					break;
					case 13:
					clockFont = "special_eliteregular";
					break;
					case 14:
					clockFont = "sensations_and_qualitiesRg";
					break;
					case 15:
					clockFont = "pecitabook";
					break;
					case 16:
					clockFont = "strasuaregular";
					break;
					case 17:
					clockFont = "bottixregular";
					break;
					case 18:
					clockFont = "underground_nfregular";
					break;
					case 19:
					clockFont = "albaregular";
					break;
					case 20:
					clockFont = "vampiressregular";
					break;
				}
			}
		}
		if(properties.clocksize){
			clockSize = properties.clocksize.value;
		}
		if(properties.clockcolor){
			customClkColor = properties.clockcolor.value.split(' ');
			customClkColor = customClkColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			clockColor ="rgba(" + customClkColor + "," + clockOpacity + ")";
		}
		if(properties.clockopacity){
			clockOpacity = properties.clockopacity.value /100;
			clockColor ="rgba(" + customClkColor + "," + clockOpacity + ")";
		}
		if(properties.blurclkvalue){
			blurValueClk = properties.blurclkvalue.value;
		}
		if(properties.clockpositionx1){
			clkPositionX = properties.clockpositionx1.value;
		}
		if(properties.clockpositiony1){
			clkPositionY = properties.clockpositiony1.value;
		}
		if(properties.showtext){
			if(properties.showtext.value){
				showText = properties.showtext.value;
			}else{
				showText = properties.showtext.value;
				textString = userTextSrting;
			}
		}
		if(properties.bassshaketext){
			bassShakeText = properties.bassshaketext.value;
		}
		if (properties.textfont) {
			if (properties.textfont.value) {
				switch (properties.textfont.value) {
					case 1:
					textFont = customUserFont;
					break;
					case 2:
					textFont = "pompiere_regular";
					break;
					case 3:
					textFont = "open_sanslight";
					break;
					case 4:
					textFont = "maven_proregular";
					break;
					case 5:
					textFont = "james_fajardoregular";
					break;
					case 6:
					textFont = "happy_monkeyregular";
					break;
					case 7:
					textFont = "digital-7regular";
					break;
					case 8:
					textFont = "didact_gothicregular";
					break;
					case 9:
					textFont = "changa_oneregular";
					break;
					case 10:
					textFont = "waltographregular";
					break;
					case 11:
					textFont = "timeburnerregular";
					break;
					case 12:
					textFont = "still_timeregular";
					break;
					case 13:
					textFont = "special_eliteregular";
					break;
					case 14:
					textFont = "sensations_and_qualitiesRg";
					break;
					case 15:
					textFont = "pecitabook";
					break;
					case 16:
					textFont = "strasuaregular";
					break;
					case 17:
					textFont = "bottixregular";
					break;
					case 18:
					textFont = "underground_nfregular";
					break;
					case 19:
					textFont = "albaregular";
					break;
					case 20:
					textFont = "vampiressregular";
					break;
				}
			}
		}
		if(properties.textsize){
			textSize = properties.textsize.value;
		}
		if(properties.textcolor){
			customTxtColor = properties.textcolor.value.split(' ');
			customTxtColor = customTxtColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			textColor ="rgba(" + customTxtColor + "," + textOpacity + ")";
		}
		if(properties.textopacity){
			textOpacity = properties.textopacity.value /100;
			textColor ="rgba(" + customTxtColor + "," + textOpacity + ")";
		}
		if(properties.blurtxtvalue){
			blurValueTxt = properties.blurtxtvalue.value;
		}
		if(properties.textpositionx){
			textPositionX = properties.textpositionx.value;
		}
		if(properties.textpositiony){
			textPositionY = properties.textpositiony.value;
		}
		if(properties.circlecolor){
			customCircColor = properties.circlecolor.value.split(' ');
			customCircColor = customCircColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			circleColor ="rgba(" + customCircColor + "," + circleOpacity + ")";
		}
		if(properties.circleopacity){
			circleOpacity = properties.circleopacity.value /100;
			circleColor ="rgba(" + customCircColor + "," + circleOpacity + ")";
		}
		if(properties.circleradius){
			circleRadius = properties.circleradius.value;
		}
		if(properties.circlearc){
			circleDegree = properties.circlearc.value;
		}
		if(properties.circlerotate){
			circleRotate = properties.circlerotate.value;
		}
		if(properties.logoimage){
			if (properties.logoimage.value) {
				imgSource = "file:///" + properties.logoimage.value;
			}else{
				imgSource = null;
			}
		}
		if(properties.autologorotate){
			autoLogoRotate = properties.autologorotate.value;
		}
		if(properties.autologorotatespeed){
			userLogoRotate = properties.autologorotatespeed.value /10;
		}
		if(properties.secondcircle){
			secondCircle = properties.secondcircle.value;
		}
		if(properties.secondcirclecolor){
			customSecondCircColor = properties.secondcirclecolor.value.split(' ');
			customSecondCircColor = customSecondCircColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			secondCircleColor ="rgba(" + customSecondCircColor + "," + secondCircleOpacity + ")";
		}
		if(properties.secondcircleopacity){
			secondCircleOpacity = properties.secondcircleopacity.value /100;
			secondCircleColor ="rgba(" + customSecondCircColor + "," + secondCircleOpacity + ")";
		}
		if(properties.secondcircleradius){
			secondCircleRadius = properties.secondcircleradius.value;
		}
		if(properties.eqpositionx){
			positionX = properties.eqpositionx.value;
		}
		if(properties.eqpositiony){
			positionY = properties.eqpositiony.value;
		}
		if(properties.barcircledistance){
			barCircleDistance = properties.barcircledistance.value;
		}
		if(properties.blurvalue){
			blurValue = properties.blurvalue.value;
		}
		if(properties.rainbow){
			if(properties.rainbow.value){
				RainBow = properties.rainbow.value;
			}else{
				RainBow = properties.rainbow.value;
				barColor ="rgba(" + customBarColor + "," + barOpacity + ")";
			}
		}
		if(properties.barcolortype){
			if(properties.barcolortype.value){
				switch (properties.barcolortype.value){
					case 1:
					RainBow = false;
					randomOnBeat = false;
					singleRandomOnBeat = false;
					barColor ="rgba(" + customBarColor + "," + barOpacity + ")";
					break;
					case 2:
					RainBow = true;
					randomOnBeat = false;
					singleRandomOnBeat = false;
					break;
					case 3:
					RainBow = false;
					randomOnBeat = true;
					singleRandomOnBeat = false;
					break;
					case 4:
					RainBow = false;
					randomOnBeat = false;
					singleRandomOnBeat = true;
					break;
				}
			}
		}
		if(properties.beattolerance){
			bassBeatTolarance = properties.beattolerance.value/100;
		}
		if(properties.barcolor){
			customBarColor = properties.barcolor.value.split(' ');
			customBarColor = customBarColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			barColor ="rgba(" + customBarColor + "," + barOpacity + ")";
		}
		if(properties.baropacity){
			barOpacity = properties.baropacity.value /100;
			barColor ="rgba(" + customBarColor + "," + barOpacity + ")";
		}
		if(properties.barwidth){
			barWidth = properties.barwidth.value;
		}
		if(properties.barheight){
			barLength = properties.barheight.value;
		}
		if(properties.autobarsrotate){
			if(properties.autobarsrotate.value){
				autoRotate = properties.autobarsrotate.value;
			}else{
				autoRotate = properties.autobarsrotate.value;
				barRotate = userBarRotate;
			}
		}
		if(properties.autobarsrotatespeed){
			autoRotateSpeed = properties.autobarsrotatespeed.value / 10;
		}
		if(properties.userspectrumrotation){
			userSpectrumRotate = properties.userspectrumrotation.value;
		}
		if(properties.userrainbowrotate){
			userRainbowRotate = properties.userrainbowrotate.value;
		}
		if(properties.audiocount){
			audioCount = properties.audiocount.value;
		}
		if(properties.barsarc){
			barDegree = properties.barsarc.value;
		}
		if(properties.barsrotate){
			userBarRotate = properties.barsrotate.value;
			barRotate = userBarRotate;
		}
		if(properties.particlestyle){
			if(properties.particlestyle.value){
				switch (properties.particlestyle.value){
					case 1:
					particleStyle1 = true;
					particleStyle2 = false;
					break;
					case 2:
					particleStyle1 = false;
					particleStyle2 = true;
					break;
				}
				if(particleStyle1){
					particleStyle.splice(0, particleStyle.length);
					particleNum = pNum1;
				}
				if(particleStyle2){
					for (var i in particles){
						particles[i].delete();
					}
					// particles.splice(0, particles.length);
					for(var i = 0; i < particleNumberStyle2; i++){
						particleStyle[i] = new ParticlesStyle2();
					}
				}
			}
		}
		if(properties.particlecolor){
			customParColor = properties.particlecolor.value.split(' ');
			customParColor = customParColor.map(function(c) {
				return Math.ceil(c * 255);
			});
			particleColor ="rgba(" + customParColor + "," + particleOpacity + ")";
		}
		if(properties.particleopacity){
			particleOpacity = properties.particleopacity.value /100;
			particleColor ="rgba(" + customParColor + "," + particleOpacity + ")";
		}
		if(properties.particleradius){
			userParticleRadius = properties.particleradius.value/20;
		}
		if(properties.particlenum){
			pNum1 = properties.particlenum.value;
			particleNum =pNum1;
		}
		if(properties.particlestyle2num){
			if(properties.particlestyle2num.value) {
				switch (properties.particlestyle2num.value){
					case 1:
					particleNumberStyle2 = 50;
					break;
					case 2:
					particleNumberStyle2 = 100;
					break;
					case 3:
					particleNumberStyle2 = 250;
					break;
					case 4:
					particleNumberStyle2 = 500;
					break;
					case 5:
					particleNumberStyle2 = 1000;
					break;
					case 6:
					particleNumberStyle2 = 1500;
					break;
					case 7:
					particleNumberStyle2 = 2000;
					break;
					case 8:
					particleNumberStyle2 = 2500;
					break;
					case 9:
					particleNumberStyle2 = 3000;
					break;
					case 10:
					particleNumberStyle2 = 3500;
					break;
					case 11:
					particleNumberStyle2 = 4000;
					break;
					case 12:
					particleNumberStyle2 = 4500;
					break;
					case 13:
					particleNumberStyle2 = 5000;
					break;
				}
				particleStyle.splice(0, particleStyle.length);
				for(var i = 0; i < particleNumberStyle2; i++){
					particleStyle[i] = new ParticlesStyle2();
				}
			}
		}
		if(properties.particlenumaudio){
			pNum2 = properties.particlenumaudio.value;
		}
		if(properties.particlerainbow){
			rainbowParticle = properties.particlerainbow.value;
		}
		if(properties.twinkling){
			twinkle = properties.twinkling.value;
		}
		if(properties.bassshakemultiplier){
			bassShake = properties.bassshakemultiplier.value;
		}
		if(properties.bassshaketolerance){
			bassShakeTolerance = properties.bassshaketolerance.value/100;
		}
		if(properties.cbassmultiplier){
			bassEffectMult1 = properties.cbassmultiplier.value/8.0;
		}
		if(properties.c1bassmultiplier){
			bassEffectMult5 = properties.c1bassmultiplier.value/8.0;
		}
		if(properties.bbassmultiplier){
			bassEffectMult2 = properties.bbassmultiplier.value/8.0;
		}
		if(properties.clkbassmultiplier){
			bassEffectMult3 = properties.clkbassmultiplier.value/8.0;
		}
		if(properties.txtbassmultiplier){
			bassEffectMult4 = properties.txtbassmultiplier.value/8.0;
		}
		if(properties.backgroundimagef){
			if(properties.backgroundimagef.value){
				var imagePath1 = "file:///" + properties.backgroundimagef.value;
				document.querySelector("#overlay").style.backgroundRepeat = "no-repeat";
				document.querySelector("#overlay").style.backgroundPosition = "center";
				document.querySelector("#overlay").style.backgroundImage = "url('" + imagePath1 + "')";
				document.querySelector("#overlay").style.backgroundSize = imageSize1;
			}else{
				document.querySelector("#overlay").style.backgroundImage = null;
			}
		}
		if(properties.vertical){
			var y = properties.vertical.value;
			document.querySelector("#overlay").style.top=""+y+"px";
		}
		if(properties.horizontal){
			var x = properties.horizontal.value;
			document.querySelector("#overlay").style.left=""+x+"px";
		}
		if(properties.imageoptions1){
			if(properties.imageoptions1.value) {
				switch (properties.imageoptions1.value){
					case 1:
					imageSize1 = "initial";
					break;
					case 2:
					imageSize1 = "cover";
					break;
					case 3:
					imageSize1 = "contain";
					break;
				}
				document.querySelector("#overlay").style.backgroundSize = imageSize1;
			}
		}
		if(properties.frameratepersecond){
			showFPS = properties.frameratepersecond.value;
		}
	}
}
//audio Listener
function wallpaperAudioListener(audioArray) {
	var pinkNoise = [1.0548608488838,0.76054078751554,0.61124787706261,0.52188737442096,0.47582581340335,0.442985940855,0.39506604448116,0.38179901474466,0.3791498265819,0.35862620105656,0.34117808276167,0.31407858754586,0.32956896818321,0.32649587026332,0.32553041354753,0.33023063745582,0.33723850113961,0.32845876137105,0.32345077632073,0.33371703524763,0.33559351013352,0.32755038614695,0.33723270172874,0.33152196761531,0.34253960054833,0.33996676648346,0.35007384375669,0.34140414964718,0.35276302794926,0.45428847576802,0.57092841582994,0.56249676873287,0.64297260455787,0.64261475342015,0.72339198663831,0.73733259583513,0.83130048006773,0.86110594108701,0.93924222866694,0.97183918188016,1.0510377466679,1.1248085597157,1.1805661781629,1.2060520313183,1.2870901748538,1.3467060487469,1.419748566548,1.4930113442739,1.5233661865195,1.6291546697418,1.6687760437528,1.7517802578211,1.7828743148843,1.8640559593836,1.9024009352922,1.9445452898741,2.0042892436186,2.0429756359259,2.0702872782946,2.0901099761327,2.0997672257821,2.1029779444138,2.0654643664757,2.0357843961318];
	sum = 0;
	for(var i=0; i<64; i++){
		sum += audioArray[i];
		if(noiseOption){
			smoothSample[i] = audioArray[i]/pinkNoise[i];
		}else{
			smoothSample[i] = audioArray[i];
		}
	}
	for(var i=0; i<64; i++){
		if(normalizeBars){
			if(i == 0){
				smooth[i] =(smoothSample[i] + smoothSample[i+1])/2;
			}else if(i == 63){
				smooth[i] = (smoothSample[i-1] + smoothSample[i])/2;
			}else{
				smooth[i] = (smoothSample[i-1] + 2 * smoothSample[i] + smoothSample[i+1])/4;
			}
		}else{
			smooth[i] = smoothSample[i];
		}
	}
	for(var i=0; i<64; i++){
		audioSampleA[i] = smooth[i] * (normaliseReposiveness) + audioSampleA[i] * (1 - normaliseReposiveness);
		audioSample[i] = audioSampleA[i];
		if(reverseRight){
			audioSample[64+i] = audioSampleA[i];
		}else{
			audioSample[128-i-1] = audioSampleA[i];
		}
	}
}
function bg(){
	if(imageBackground){
		document.querySelector("#bgimg").style.backgroundRepeat = "no-repeat";
		document.querySelector("#bgimg").style.backgroundPosition = "center";
		document.querySelector("#bgimg").style.backgroundImage = "url('" + imagePath + "')";
		document.querySelector("#bgimg").style.backgroundSize = imageSize;
	}else{
		document.querySelector("#bgimg").style.backgroundImage = null;
	}
	if(videoBackground){
		document.querySelector("#bgvid").setAttribute('src', videoSource);
		document.querySelector("#bgvid").play();
	}else{
		document.querySelector("#bgvid").setAttribute('src', '');
	}
	if(slideShow){
		slideCounter = 0;
		window.wallpaperRequestRandomFileForProperty('customrandomdirectory', randomImageResponse);
		transitionCounter =0;
	}else{
		document.querySelector("#bgimg1").style.backgroundImage = null;
		document.querySelector("#bgimg2").style.backgroundImage = null;
	}
}
//rainbow Colors
function RainBowColor(length, maxLength)
{
	var i = (length * 255 / maxLength);
	var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
	var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
	var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
	if(fromParticle){
		return 'rgba(' + r + ',' + g + ',' + b + ',' + particleOpacity + ')';
	}else{
		return 'rgba(' + r + ',' + g + ',' + b + ',' + barOpacity + ')';
	}
	//return 'rgb(' + r + ',' + g + ',' + b + ')';
}
//Random Color
function RandomColor()
{
	var r = Math.round(Math.random() * 255);
	var g = Math.round(Math.random() * 255);
	var b = Math.round(Math.random() * 255);
	return 'rgba(' + r + ',' + g + ',' + b + ',' + barOpacity + ')';
}
//deleting particles
Particle.prototype.delete = function(){
	delete particles[this.id];
}
//drawing particles
Particle.prototype.draw = function(){
	this.x += this.vx;
	this.y += this.vy;
	if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.heights){
		delete particles[this.id];
	}
	ctx.beginPath();
	ctx.arc(this.x , this.y, this.radius, 0, 2 * Math.PI);
	if(rainbowParticle){
		if(twinkle){
			fromParticle = true;
			ctx.fillStyle = RainBowColor(Math.random()*128, 128);
			fromParticle = false;
		}else{
			ctx.fillStyle = this.colorParticle;
		}
	}else{
		ctx.fillStyle = particleColor;	
	}
	ctx.fill();
	this.radius = this.radius * 1.0019;
	if(((audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4])) > 0.60){
		this.vx = this.vx * 1.111;
		this.vy = this.vy * 1.111;
	}else if(((audioSample[29] + audioSample[30] + audioSample[31] + audioSample[32] + audioSample[33]) ) > 0.5){
		this.vx = this.vx * 1.0177;
		this.vy = this.vy * 1.0177;
	}else{
		this.vx = this.vx * 1.0059;
		this.vy = this.vy * 1.0059;
	}
}
//creating particle properties
function Particle(){
	this.y = Math.random() * canvas.height;
	this.x = Math.random() * canvas.width;
	this.radius = Math.random() * 2 + userParticleRadius;
	this.vx = 0;
	this.vy = 0;
	this.radians = Math.atan((canvas.height/2-this.y)/(canvas.width/2-this.x));
	this.vx = 1.5 * Math.cos(this.radians);
	this.vy = 1.5 * Math.sin(this.radians);
	fromParticle = true;
	this.colorParticle = RainBowColor(Math.random()*128, 128);
	fromParticle = false;
	if(this.x < canvas.width/2){
		this.vx = -this.vx;
		this.vy = -this.vy;
	}
	particleIndex++;
	particles[particleIndex] = this;
	this.id = particleIndex;
}
//particleStyle2
function ParticlesStyle2(){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.z = Math.random() * canvas.width;
	this.opacity = 100;
}
//drawing particles
ParticlesStyle2.prototype.draw = function(){
	var particleZoom = 1;
	var focalLength = canvas.width/particleZoom;
	var particleRadius = 0.5 + userParticleRadius + (particleZoom/10);
	var x = (this.x - canvas.width/2) * (focalLength/this.z);
	x = x + canvas.width/2;

	var y = (this.y - canvas.height/2) * (focalLength/this.z);
	y = y + canvas.height/2;
	var depth = particleRadius *  (focalLength/this.z);

	if(depth >= maxDepth){
		this.opacity = this.opacity -4;
	}
	ctx.beginPath();
	// ctx.fillStyle = "rgba(250, 250, 250," + this.opacity / canvas.width + ")";
	// ctx.fillStyle = "rgba(250, 250, 250," +  this.opacity / 100+ ")";
	ctx.fillStyle = "rgba(" + customParColor + "," + this.opacity / 100 + ")";
	ctx.arc(x, y, depth, 0, 2 * Math.PI);
	ctx.fill();
}
//updating particles
ParticlesStyle2.prototype.update = function(){
	if(((audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4])) >2.0){
		if(speed >= 20){
			speed = 20;
		}else{
			speed ++;
		}
		clearOpacity = 0.4;
	}
	else if(((audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4])) > 0.5){
		if(speed > 8){
			speed = speed -2;
		}else if(speed<8){
			speed++;
		}else{
			speed = 8;
		}
		clearOpacity = 0.65;
	}
	else{
		speed = 2;
		clearOpacity =1;
	}

	this.z = this.z - speed;
	if(this.z <= 0 || this.z > canvas.width){
		this.z = canvas.width;
		this.opacity = 100;		
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
	}
}
//animation frame
function run(){
	window.requestAnimationFrame(run);
	var j = 0 + userSpectrumRotate;
	var l = 0 + userRainbowRotate;
	var x1 = canvas.width/2 + positionX;
	var y1 = canvas.height/2 + positionY;
	var x2 = x1;
	var y2 = y1;
	var x = x1;
	var y = y1;
	var avg1 = (audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4]) * bassEffectMult1;
	var avg2 = (audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4]) * bassEffectMult2;
	var avg3 = (audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4]) * bassEffectMult5;
	var avgC = 1 + (audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4]) * bassEffectMult3 / 80;
	var avgT = 1 + (audioSample[0] + audioSample[1] + audioSample[2] + audioSample[3] + audioSample[4]) * bassEffectMult4 / 80;
	var maxHeight = barLength;
	var minHeight = circleRadius + barCircleDistance + avg2;
	var radius = circleRadius + avg1;
	var radius2 = circleRadius + secondCircleRadius + avg3;
	radiusCircle = radius;
	frameRate++;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	if(colorBackground){
		ctx.beginPath();
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = backgroundColor;
		ctx.fill();
	}
	if(particleStyle1){
		if(sum == 0){
			if(particleNum > pNum2){
				particleNum -= 0.03;
			}else{
				particleNum = pNum2;
				// particles = {};
			}
			pNum = particleNum;
		}else{
			if(pNum < pNum1){
				particleNum += 0.01;
				pNum = particleNum;
			}else{
				particleNum = pNum1 * Math.random();
			}
		}
		for (var i = 0; i < particleNum; i++){
			new Particle();
		}	
		for (var i in particles){
			particles[i].draw();
		}
	}
	if(particleStyle2){
		for(var i = 0; i < particleNumberStyle2; i++){
			if(sum !=0){
				particleStyle[i].draw();
				particleStyle[i].update();
			}
		}
	}
	if(audioSample[0] + audioSample[1] + audioSample[2]> (1.15+bassShakeTolerance)){
		x2 = canvas.width/2 + positionX + (Math.random()*bassShake-(bassShake/2));
		y2 = canvas.height/2 + positionY + (Math.random()*bassShake-(bassShake/2));
		canvas.style.filter="blur("+bassShake/12.50+"px)"
		x = x2;
		y = y2;
	}else{
		canvas.style.filter="blur(0px)"
	}
	if(singleRandomOnBeat){
		if(timerxx == 0){
			if(((audioSample[0] + audioSample[1] + audioSample[2])) > (1.15+bassBeatTolarance)){
				barColor = RandomColor();
				timerxx++;
			}
		}else if((audioSample[0] <0.35)||(audioSample[1] <0.35)||(audioSample[2] <0.35)){
			timerxx = 0;
		}
	}
	for(var degree = barRotate; degree < (barDegree + barRotate); degree = degree + 360/audioCount){
		if(j>=128){
			j=0;
		}
		if(l>=128){
			l=0;
		}
		var radian = degree * Math.PI/180;
		var minRX= minHeight * Math.cos(radian);
		var minRY= minHeight * Math.sin(radian);
		var maxRX = maxHeight * Math.cos(radian);
		var maxRY = maxHeight * Math.sin(radian);
		var barSampleX = maxRX * audioSample[j];
		var barSampleY = maxRY * audioSample[j];
		ctx.beginPath();
		ctx.moveTo(x + minRX, y + minRY);
		ctx.lineTo(x + minRX + barSampleX, y + minRY + barSampleY);
		ctx.shadowBlur=blurValue;
		if(randomOnBeat){
			if(((audioSample[0] + audioSample[1] + audioSample[2])) > (1.15+bassBeatTolarance)){
				barColor = RandomColor();
			}	
		}
		if(RainBow){
			ctx.strokeStyle = RainBowColor( l, 127);
			ctx.shadowColor = RainBowColor(l, 127);
		}else{
			ctx.strokeStyle = barColor;
			ctx.shadowColor = barColor;
		}
		ctx.lineWidth = barWidth;
		ctx.stroke();
		j++;
		l++;
	}
	ctx.shadowBlur=0;
	if(autoRotate){
		barRotate += autoRotateSpeed;
		if(barRotate < 0){
			barRotate = 360;
		}if(barRotate >360){
			barRotate = 0;
		}
	}
	if(secondCircle){
		ctx.beginPath();
		ctx.arc(x, y, radius2, 0, Math.PI * 2);
		ctx.fillStyle = secondCircleColor;
		ctx.fill();
	}
	if(imgSource){
		ctx.save();
		if(autoLogoRotate){
			ctx.translate(x,y);
			logoRotate += userLogoRotate;
			if(logoRotate >= 360||logoRotate <= -360){
				logoRotate = 0;
			}
			ctx.rotate(logoRotate*Math.PI/180);
			ctx.translate(-x,-y);
		}else{
			logoRotate = 0;
		}
		ctx.beginPath();
		ctx.arc(x, y, radius, circleRotate*Math.PI/180, (circleDegree+circleRotate)*Math.PI/180);
		var imageObj = new Image();
		imageObj.src = imgSource;
		ctx.clip();
		ctx.drawImage(imageObj,x-radius,y-radius,2*radius,2*radius);
		ctx.restore();
	}else{
		ctx.beginPath();
		ctx.arc(x, y, radius, circleRotate*Math.PI/180, (circleDegree+circleRotate)*Math.PI/180);
		ctx.fillStyle = circleColor;
		ctx.fill();	
	}
	if(bassShakeText){
		x = x2;
		y = y2;
	}else{
		x = x1;
		y = y1;
	}
	if(showText){
		ctx.shadowBlur = blurValueTxt;
		ctx.shadowColor = textColor;
		var textSize1 = ""+ textSize * avgT +"px";
		if(textString == null){
			textString = prompt("Please enter your text", "");
		}
		ctx.font = "" + textFontWeight + " " + textSize1 + " " + textFont+ "";
		ctx.textAlign = "center";
		ctx.textBaseline="middle";
		ctx.fillStyle = textColor;
		ctx.fillText(textString, x + textPositionY, y + textPositionX);
		ctx.shadowBlur=0;
	}
	if(bassShakeClock){
		x = x2;
		y = y2;
	}else{
		x = x1;
		y = y1;
	}
	if(showClock){
		ctx.shadowBlur=blurValueClk;
		ctx.shadowColor=clockColor;
		var query;
		var clockSize1 = ""+ clockSize * avgC +"px";
		var clockSize2 = ""+ clockSize/2 * avgC +"px";

		ctx.font = "" + clockFontWeight + " " + clockSize1 + " " + clockFont+ "";
		ctx.textAlign = "center";
		ctx.textBaseline="middle";
		ctx.fillStyle = clockColor;
		ctx.fillText(finalString, x + clkPositionX , y + clkPositionY);
		if(showSecs){
			if(removeColon){
				query = ctx.measureText("00 00 00"); // TextMetrics object
			}else{
				query = ctx.measureText("00:00:00"); // TextMetrics object
			}
		}else{
			if(removeColon){
				query = ctx.measureText("00:00"); // TextMetrics object
			}else{
				query = ctx.measureText("00 00"); // TextMetrics object
			}
		}
		if(twelveHours){
			ctx.font = "" + clockFontWeight + " " + clockSize2 + " " + clockFont+ "";
			ctx.textAlign = "left";
			ctx.textBaseline="middle";
			ctx.fillText(hourString, x + clkPositionX + query.width/2 + userHourPosX, y + clkPositionY + userHourPosY);
		}
		if(showDay){
			ctx.font = "" + clockFontWeight + " " + clockSize2 + " " + clockFont+ "";
			ctx.textAlign = "left";
			ctx.textBaseline="bottom";
			ctx.fillText(dayString, x + query.width/2 + clkPositionX + userDayPosX , y + clkPositionY + userDayPosY);
		}
		ctx.shadowBlur=0;
	}
	if(showFPS){
		if(fps < 35){
			ctx.beginPath();
			ctx.font = "30px Arial";
			ctx.textAlign = "right";
			ctx.fillStyle = "red";
			ctx.fillText("fps"+fps+"", canvas.width - 30, 30);
		}
	}
}
//update time string every second
setInterval(function(){
	clock();
	fps= frameRate;
	frameRate = 0;
	if(transitionCounter >= userCount){
		if(slideShow){
			window.wallpaperRequestRandomFileForProperty('customrandomdirectory', randomImageResponse);
		}
		transitionCounter =0;
	}else{
		transitionCounter++;
	}
}, 1000);
//Image function
function randomImageResponse(propertyName, filePath) {
	if(slideShow){
		if(slideCounter % 2 ==0){
			document.querySelector("#bgimg2").style.opacity  = "0";
			document.querySelector("#bgimg1").style.backgroundRepeat = "no-repeat";
			document.querySelector("#bgimg1").style.backgroundPosition = "center";
			document.querySelector("#bgimg1").style.backgroundSize = imageSize;
			document.querySelector("#bgimg1").style.backgroundImage = "url('" + filePath + "')";
			slideCounter++;
			document.querySelector("#bgimg1").style.opacity  = "1";
		}else{
			document.querySelector("#bgimg1").style.opacity  = "0";
			document.querySelector("#bgimg2").style.backgroundRepeat = "no-repeat";
			document.querySelector("#bgimg2").style.backgroundPosition = "center";
			document.querySelector("#bgimg2").style.backgroundSize = imageSize;
			document.querySelector("#bgimg2").style.backgroundImage = "url('" + filePath + "')";
			slideCounter++;
			document.querySelector("#bgimg2").style.opacity  = "1";
		}
		if(slideCounter ==100){
			slideCounter = 1;
		}
	}else{
		document.querySelector("#bgimg1").style.backgroundImage = null;
		document.querySelector("#bgimg2").style.backgroundImage = null;
		document.querySelector("#bgimg2").style.opacity = "1";
		document.querySelector("#bgimg1").style.opacity = "1";
	}
}
//Clock function
function clock(){
	if(showClock){
		var d = new Date();
		var hours = d.getHours();
		var mins = d.getMinutes();
		var seconds = d.getSeconds();
		var day = d.getDay();
		var minString;
		var secString;
		if(twelveHours){
			if(hours > 12){
				hours -= 12;
				hourString = "pm";
			}if(hours == 12){
				hours = 12;
				hourString = "pm";
			}
		}
		if(mins < 10){
			minString = "0"+mins+"";
		}else{
			minString = ""+mins+"";
		}
		if(seconds < 10){
			secString = "0"+seconds+"";
		}else{
			secString = ""+seconds+"";
		}
		if(showSecs){
			if(removeColon){
				finalString = ""+hours+" "+minString+" "+secString+"";
			}else{
				finalString = ""+hours+":"+minString+":"+secString+"";
			}
		}else{
			if(removeColon){
				finalString = ""+hours+" "+minString+"";
			}else{
				finalString = ""+hours+":"+minString+"";
			}
		}
		if(showDay){
			var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			if(shortHand){
				days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
			}
			if(userShortHand){
				days = userDays;
			}
			dayString = days[day];
		}
	}
}
//canvas load
window.onload = function(){
	canvas = document.querySelector("#canvas");
	ctx = canvas.getContext("2d");
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;
	window.wallpaperRegisterAudioListener(wallpaperAudioListener);
	window.requestAnimationFrame(run);
}
//canvas resize
window.onresize = function() {
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;
}