let date = new Date(),
  year = date.getFullYear(),
  _year = year,
  month = date.getMonth() + 1,
  _month = month - 3,
  day = date.getDate();
if (month < 10) {
  month = "0" + month;
}
if (day < 10) {
  day = "0" + day;
}
if (_month <= 0) {
  _month = 12 + _month;
  year -= 1;
}
if(_month < 10 ){
  _month = "0" + _month;
}

let end = _year + "-" + month + "-" + day,
  start = year + "-" + _month + "-" + day,
  _start = year + "/" + _month + "/" + day;
  if(day>28){
	  day=28
	   start = year + "-" + _month + "-" + day
  }
export default {
  start,
  end,
  _start
}
