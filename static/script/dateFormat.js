
export function dateFormat(data){
  let year = data.getFullYear();
  let month = data.getMonth() + 1;
  let date = data.getDate();
  if(month < 10){
    month = '0' + month;
  }
  if(date < 10){
    date = '0' + date;
  }
  return year + '-' + month + '-' + date
}
