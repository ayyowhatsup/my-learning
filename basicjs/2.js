// Bài 1: Viết hàm tìm ra số nhỏ nhất trong mảng các số
function minNumbers(arr) {
  return Math.min(...arr);
}
// Bài 2: Viết hàm tìm ra số lớn thứ nhì trong mảng các số
function max2Numbers(arr) {
  let max = arr[0];
  let secondMax;
  for (const e of arr) {
    if (e > max) {
      secondMax = max;
      max = e;
    } else if (e < max && (!secondMax || secondMax < e)) secondMax = e;
  }
  return secondMax;
}
// Bài 3: Viết hàm truyền vào 1 mảng tên học viên, sắp xếp lại mảng này theo chiều ngược của bảng chữ cái
function sortStudents(students) {
  students.sort();
  students.reverse();
  return students;
}
// Bài 4: Tính tổng các số chia hết cho 5 từ 0 đến 100
const sum = ((100 + 0) * ((100 - 0) / 5 + 1)) / 2;
// Bài 5: Viết hàm cho phép truyền vào một mảng các số, kết quả trả về là một mảng mới với các số là số dư tương ứng khi chia mảng cũ cho 2
function modBy2(arr) {
  return arr.map((e) => e % 2);
}
// Bài 6: Cho một mảng các chuỗi. Viết hàm lọc ra các phần tử có độ dài lớn nhất. Ví dụ với tham số ['aba', 'aa', 'ad', 'c', 'vcd'] thì kết quả trả về ['aba', 'vcd']
function myFilter(arr) {
  let ans = [];
  let maxLen = arr[0].length;
  for (const e of arr) {
    if (e.length > maxLen) {
      ans = [e];
      maxLen = e.length;
    } else if (e.length == maxLen) {
      ans.push(e);
    }
  }
  return ans;
}
// Bài 7: Viết chương trình javascript để lấy một phần tử ngẫu nhiên từ một mảng
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
// Bài 8: Viết chương trình đổi chỗ ngẫu nhiên vị trí của các phần tử trong mảng
function shuffle(arr) {
  let i = 0;
  while (i != arr.length) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    i++;
  }
  return arr;
}
// Bài 9: Viết một chương trình javascript để lấy một mảng các phần tử xuất hiện trong cả hai mảng
function similarity(arr1, arr2) {
  return [...new Set(arr1).intersection(new Set(arr2))];
}
// Bài 10: Viết một chương trình javascript để lấy các phần tử không xuất hiện ở cả hai mảng
function symmetricDifference(arr1, arr2) {
  return [...new Set(arr1).symmetricDifference(new Set(arr2))];
}
// Bài 11: Viết một chương trình javascript trả về một tập hợp con của một chuỗi: sub_String("dog") => ["d", "do", "dog", "o", "og", "g"]
function sub_String(str) {
  const ans = [];
  for (let i = 0; i < str.length; i++) {
    let s = str.charAt(i);
    ans.push(s);
    for (let j = i + 1; j < str.length; j++) {
      s += str.charAt(j);
      ans.push(s);
    }
  }
  return ans;
}
// Bài 12: Kiểm tra mảng xem có phải mảng tăng dần hay không
function isAscending(arr) {
  return arr.every((elem, i, arr) => i == 0 || elem > arr[i - 1]);
}
// Bài 13: Kiểm tra mảng xem có phải mảng số lẻ giảm dần hay không
function isAllOddDescending(arr) {
  return arr.every(
    (elem, i, arr) => elem % 2 == 1 && (i == 0 || elem <= arr[i - 1])
  );
}

// Bài tập Object
// Bài 1: Viết hàm để lấy danh sách các key của object
// ví dụ: var user = {name: "Nguyễn Tiến Đạt", age: 25, email: 'support@amela.vn'} => name, age,email
function getObjectKeys(obj) {
  return Object.keys(obj).join(",");
}
// Bài 2: Viết hàm để lấy danh sách các value của object
// ví dụ: var user = {name: "Nguyễn Tiến Đạt", age: 25, email: 'support@amela.vn'} => 'Nguyễn Tiến Đạt',25,'support@amela.vn'
function getObjectValues(obj) {
  return Object.values(obj).join(",");
}
// Bài 3: Viết hàm kiểm tra key có tồn tại trong Object hay không
// ví dụ: var user = {name: "Nguyễn Tiến Đạt", age: 25, email: 'support@amela.vn'} => checkKey('name') -> true, checkKey('study') -> false ?
Object.prototype.checkKey = function (key) {
  return this.hasOwnProperty(key);
};
// Bài 4: Viết hàm kiểm tra Object có độ dài bao nhiêu
// vd var user = {name: "Nguyễn Tiến Đạt", age: 25, email: 'support@amela.vn'} => getLengthObject (user) => 3
function getLengthObject(obj) {
  return Object.keys(obj).length;
}
// Bài 5: Cho mảng các user mỗi user có cấu trúc user = {name: string, age: number, isStatus: bool}. Viết function lấy ra những user có tuổi > 25 và isStatus = true
function query(arr) {
  return arr.filter((e) => e.age > 25 && e.isStatus == true);
}
