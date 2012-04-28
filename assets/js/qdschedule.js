function trim(s)
{
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    str = "name,sunday,monday,tuesday,wednesday,thursday,friday,saturday,hours\r\n";
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }
    //window.open("data:text/csv;charset=utf-8;filename=schedule.csv, " + escape(str));
    var uriContent = "data:text/csv;charset=utf-8;filename=schedule.csv," + encodeURIComponent(str);
    newWindows = window.open(uriContent, 'schedule.csv');
    return str;
}

function Schedule(name){
    var self = this;
    self.name = name;
    self.sunday = ko.observable("");
    self.monday = ko.observable("");
    self.tuesday = ko.observable("");
    self.wednesday = ko.observable("");
    self.thursday = ko.observable("");
    self.friday = ko.observable("");
    self.saturday = ko.observable("");
    self.sunday = ko.observable("");
    
    self.hours = ko.computed(function() {
	 var shrs = hoursForDay(self.sunday());
	 var mhrs = hoursForDay(self.monday());
         var thrs = hoursForDay(self.tuesday());
         var whrs = hoursForDay(self.wednesday());
         var rhrs = hoursForDay(self.thursday());
         var fhrs = hoursForDay(self.friday());
         var ehrs = hoursForDay(self.saturday());

         return shrs + mhrs + thrs + whrs + rhrs + fhrs + ehrs;
     });

}

function hoursForDay(day){
	myVar = day;
	var hours = 0;
	if(myVar.length == 0)
		hours = 0;
	else{
		hours = 99;
		splitter = myVar.split("-", 2);
		var left = trim(splitter[0]);
		var right = trim(splitter[1]);
		var lhrs = 0;
		var rhrs = 0;
		var fail =0;
		if(left.indexOf("a") != -1){
			//The AM case
			lhrs = left.substring(0, left.lastIndexOf("a"));
		}
		else if(left.indexOf("p") != -1){
			//The PM case
			lhrs = (left.substring(0, left.lastIndexOf("p")) * 1 ) + 12;
		}
		if(right.indexOf("a") != -1){
			//The AM case
			rhrs = right.substring(0, right.lastIndexOf("a"));
		}
		else if(right.indexOf("p") != -1){
			//The PM case
			rhrs = (right.substring(0, right.lastIndexOf("p")) * 1) + 12;
		}
			hours = rhrs - lhrs;
	}
	return hours;


}


function ScheduleViewModel(){
   var self = this;

   self.lines = ko.observableArray([
    new Schedule("John Doe")
   ]);
   
   self.addLine = function() {
      self.lines.push(new Schedule(""));
   }

   self.removeLine = function(line){
      self.lines.remove(line);
   }

   self.exportData = function() {
     // alert(ko.toJSON(self.lines()));
      var csv = ConvertToCSV(ko.toJSON(self.lines()));
      //alert(csv);

   }

  self.numberRecs = ko.computed(function() {
       return self.lines().length;
   });

   self.totalHours = ko.computed(function() {
	var accum = 0;
	for(i =0; i<self.lines().length; i++){
		accum = accum + self.lines()[i].hours();
	}
	return accum;
    });
   
}


ko.applyBindings(new ScheduleViewModel());
