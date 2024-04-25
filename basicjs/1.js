// Bài tập String
/**
 * Bài 1: Viết 1 function kiểm tra một chuỗi có nằm trong chuỗi còn lại hay không. Nếu có, trả về true, nếu không trả về false
 * Đầu vào có 2 tham số: Tham số 1 là chuỗi ban đầu, tham số 2 là chuỗi cần kiểm tra
 * Ví dụ: checkStringExist(“Amela A Beta”, “Beta”) -> true
 * checkStringExist(“Amela A Beta”, “B”) => false
 */
function checkStringExist(s, p) {
  return s.split("").includes(p);
}
/**
 * Bài 2: Viết hàm rút ngắn chuỗi bằng cách cắt ra 8 kí tự đầu của một chuỗi và thêm dấu 3 chấm ở cuối chuỗi
 * Ví dụ: shortenString(‘Xin chào các bạn’) => Kết qủa trả về là ‘Xin chào…’
 */
function shortenString(s) {
  return s.length > 8 ? s.substring(0, 8) + "…" : s;
}
// Bài 3: Cho một chuỗi, viết hàm có tác dụng sao chép chuỗi đó lên 10 lần
function repeatString10(s) {
  return new Array(10).fill(s).join("");
}
// Bài 4: Cho một chuỗi, viết hàm có tác dụng sao chép chuỗi đó lên 10 lần, cách nhau bởi dấu gạch ngang
function repeatString10Hyphen(s) {
  return new Array(10).fill(s).join("-");
}
// Bài 5: Cho một chuỗi và số nguyên n > 1, viết hàm sao chép chuỗi đó lên n lần, ngăn cách bởi dấu gạch ngang
function repeatStringNHyphen(s, n) {
  return new Array(n).fill(s).join("-");
}
/**
 * Bài 6: Viết hàm đảo ngược chuỗi. Viết function với đầu vào là một chuỗi string, trả về là chuỗi đảo ngược của chuỗi đó
 * Ví dụ reverseString(‘Hello’) => ‘olleH’
 */
function reverseString(s) {
  return s.split("").toReversed().join("");
}
/**
 * Bài 7: Cho một chuỗi, kiểm tra chuỗi đó có phải chuỗi đối xứng hay không, không tính khoảng trắng, không phân biệt hoa, thường, kết quả trả về là true hoặc false
 * Ví dụ ‘Race car’ trả về true. ‘hello world’ trả về false
 */
function isValid(s) {
  return (
    s.replaceAll(" ", "").toLowerCase().split("").toReversed().join("") ===
    s.toLowerCase().replaceAll(" ", "")
  );
}
// Bài 8: Kiểm tra 1 chuỗi có phải chuỗi viết hoa hay không
function isUpper(s) {
  return s.toUpperCase() === s;
}
// Bài tập Number
// Bài 1: Viết hàm tính thể tích hình cầu, với tham số truyền vào là bán kính của hình cầu
function sphereVolume(r) {
  return (4 / 3) * Math.PI * r * r * r;
}
/**
 * Bài 2: Viết hàm truyền vào 2 số nguyên, tính tổng các số nguyên nằm giữa chúng
 * Ví dụ với 3 và 8 ta có 4 + 5 + 6 + 7 = 22
 */
function sumRange(a, b) {
  if (a > b) [a, b] = [b, a];
  return ((a + b) * (b - a + 1)) / 2 - a - b;
}
// Bài 3: Cho một số, kiểm tra số đó có phải số nguyên tố hay không?
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) return false;
  }
  return true;
}
// Bài 4: Cho một số nguyên dương bất kỳ, Tính tổng các số nguyên tố mà nhỏ hơn hoặc bằng tham số truyền vào;
function sumPrime(n) {
  let sum = 0;
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) sum += i;
  }
  return sum;
}
// Bài 5: Cho một số nguyên dương, tính tổng các ước của số đó
function sumDivisor(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    if (n % i == 0) sum += i;
  }
  return sum;
}
// Bài 6: Cho một số nguyên, hãy viết hàm sắp xếp lại các chữ số trong số nguyên đó sao cho ra một số nhỏ nhất có thể (Không tính số 0 đầu tiên). Ví dụ với tham số 53751 thì ra kết quả là 13557
function reOrder(n) {
  let sorted = (n + "").split("").toSorted();
  let lastZero = sorted.lastIndexOf("0");
  if (lastZero == sorted.length - 1) return 0;
  let s = sorted.join("");
  if (lastZero == -1) return +s;
  return +(
    s.charAt(lastZero + 1) +
    new Array(lastZero + 1).fill("0").join("") +
    s.substring(lastZero + 2)
  );
}
