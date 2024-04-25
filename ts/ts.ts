// Bài 1: Viết một hàm để lấy ngày hiện tại
function getCurrentDate(delimiter: string): string {
  const now: Date = new Date();
  const month: number = now.getMonth() + 1;
  return `${now.getDate()}${delimiter}${
    month < 10 ? "0" + month : month
  }${delimiter}${now.getFullYear()}`;
}
// Bài 2: Viết một hàm để lấy số ngày trong tháng
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}
// Bài 3: Viết một hàm để kiểm tra xem một ngày xem có phải cuối tuần hay không
function isWeekend(date: Date): boolean {
  const day: number = date.getDay();
  return day === 0 || day === 6;
}
// Bài 4: Viết một hàm sẽ trả về số phút theo giờ và phút
function getMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}
// Bài 5: Viết một hàm để đếm số ngày đã trôi qua kể từ đầu năm
function getDaysFromBeginning(date: Date = new Date()): number {
  const beginning: Date = new Date(date.getFullYear(), 0, 1);
  return Math.floor(
    (date.valueOf() - beginning.valueOf()) / 1000 / 60 / 60 / 24
  );
}
// Bài 6: Viết chương trình để tính tuổi
function calculate_age(date: Date): number {
  const today: Date = new Date();
  const age = today.getFullYear() - date.getFullYear();
  if (age === 0) return 1;
  if (
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())
  ) {
    return age;
  }
  return age - 1;
}
// Bài 7: Viết chương trình để lấy ngày bắt đầu của tuần
function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day !== 0 ? 1 : -6);
  date.setDate(diff);
  return date;
}
// Bài 8: Viết hàm để lấy ngày kết thúc của tháng
function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
// Bài 9:  Viết hàm đếm ngược thời gian đến tết dương lịch
function timeToNewYear(): string {
  const now: Date = new Date();
  const newYear: Date = new Date(now.getFullYear() + 1, 0, 1);
  const diff: number = Math.ceil((newYear.valueOf() - now.valueOf()) / 1000);
  const days: number = Math.floor(diff / 60 / 60 / 24);
  const hours: number = Math.floor((diff / 60 / 60) % 24);
  const minutes: number = Math.floor((diff / 60) % 60);
  const seconds: number = Math.ceil(diff % 60);
  return (
    days +
    " days " +
    hours +
    " hours " +
    minutes +
    " minutes " +
    seconds +
    " seconds."
  );
}
// Bài 10: Viết hàm có 2 tham số, tham số đầu tiên là một chuỗi thời gian t dạng "giờ: phút: giây", tham số thứ 2 là một số x <= 1000. Kết quả trả về là một chuỗi biểu thị thời gian sau x giây kể từ thời điểm t. Ví dụ với  t = "9:20:56" và x = 7 thì kết quả là "9:21:3"
function addTime(time: string, offSet: number): string {
  const [hours, minutes, seconds]: string[] = time.split(":");
  const now = new Date();
  now.setHours(+hours);
  now.setMinutes(+minutes);
  now.setSeconds(+seconds);
  now.setTime(now.getTime() + offSet * 1000);
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}
// Bài 11: Viết hàm reset data. Input là object. Output là object sau khi được reset
interface Data {
  [key: string]: number | string | bigint | boolean | Data | null | undefined;
}
function resetData(obj: Data): Data {
  const defaultValues = {
    string: "",
    boolean: false,
    number: 0,
    bigint: 0n,
  };
  for (const key of Object.keys(obj)) {
    const currentValue = obj[key];
    obj[key] =
      typeof currentValue == "object" && currentValue
        ? resetData(currentValue)
        : defaultValues[typeof currentValue] ?? currentValue;
  }
  return obj;
}
