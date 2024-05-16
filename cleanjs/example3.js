// Sử dụng async/await để tránh callback hell và làm code dễ đọc

getData(function (a) {
  parseData(a, function (b) {
    processData(b, function (c) {
      displayData(c, function (d) {
        console.log("Done");
      });
    });
  });
});

// ======================================

async function process() {
  const a = await getData();
  const b = await parseData(a);
  const c = await processData(b);
  await displayData(c);
  console.log("Done");
}

process();
