window.onload = setInterval(clock,1000);

    function clock()
    {
	  var d = new Date();
	  
	  var date = d.getDate();
	  
	  var month = d.getMonth();
	  var montharr =["Jan","Feb","Mar","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];
	  month=montharr[month];
	  
	  var year = d.getFullYear();
	  
	  var day = d.getDay();
	  var dayarr =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	  day=dayarr[day];
	  
	  var hour = (d.getHours()<10?'0':'') + d.getHours();
      var min = (d.getMinutes()<10?'0':'') + d.getMinutes();
	  var NA = formatAMPM(d);
	  
	  document.getElementById("date").innerHTML=day+", "+date+" "+month+" "+year;
	  document.getElementById("timeEU").innerHTML=hour+":"+min;
	  document.getElementById("timeNA").innerHTML=NA;
    }
	
	function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
	}	