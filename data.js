function getSoal() {
  return fetch("api.json")
    .then((response) => response.json())
    .then((response) => response);
}
function brokeAPI(dataSoal) {
  return Array.from(dataSoal.SOAL);
}
function createAnswerNotice(kunciJawaban, kondisiJawaban) {
  if (kondisiJawaban == 1) {
    return `<div class="text-success">Jawaban Kamu Benar!`;
  } else {
    return `<div class="text-danger">Kamu Salah, Jawaban yang benar adalah ${kunciJawaban}</div>`;
  }
}
function createNewSoal(dataSoal, noSoal) {
  return ` <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="question-container">
          <img src="${dataSoal[noSoal].img}" alt="Question Image" class="question-image">
          <h3 id="question-text">${dataSoal[noSoal].soal}</h3>
           <div class="answer-notice"></div>
        </div>
        <div class="answer-buttons d-flex flex-column">
          <button class="btn btn-primary" id="option-a">A. <span>${dataSoal[noSoal].pilihan.A}</span></button>
          <button class="btn btn-primary" id="option-b">B. <span>${dataSoal[noSoal].pilihan.B}</span></button>
          <button class="btn btn-primary" id="option-c">C. <span>${dataSoal[noSoal].pilihan.C}</span></button>
          <button class="btn btn-primary" id="option-d">D. <span>${dataSoal[noSoal].pilihan.D}</span></button>
          <button class="btn btn-primary" id="option-e">E. <span>${dataSoal[noSoal].pilihan.E}</span></button>
        </div>
      </div>
    </div>
  </div>`;
}

function createNewAnnouncement() {
  return `<div class"pengumuman">
           <p class=""><span class=""></span></p>
           <p class=""><span class=""></span></p>
          </div>`;
}
function resultSoal(soalSalah, dataSoal) {
  const totalSoal = dataSoal.length - soalSalah;
  return `<div className="">
  <h2 class="">${soalSalah}/${dataSoal.length}</h2>
  <h2 class="">Hasil Benar = ${totalSoal}</h2>
  </div>`;
}
function jSoalSalah() {
  return 1;
}
async function koreksi(jawabanSoal, kunciJawaban) {
  const answerNoticeDiv = document.querySelector(".answer-notice");
  const buttons = document.querySelectorAll(".btn-primary");
  console.log(jawabanSoal);
  console.log(kunciJawaban);
  const btnJawabBenar = Array.from(buttons).find((btn) => {
    const spanBenar = btn.querySelector("span")?.textContent.trim(); //mengambil text di dalam tag span
    return spanBenar == kunciJawaban;
  });
  const btnJawabSalah = Array.from(buttons).find((btn) => {
    const spanBenar = btn.querySelector("span")?.textContent.trim(); //mengambil text di dalam tag span
    return spanBenar == jawabanSoal;
  });
  console.log(btnJawabBenar);
  if (jawabanSoal == kunciJawaban) {
    kondisiJawaban = 1;
    btnJawabBenar.classList.toggle("btn-success");
    console.log("Benar");
    const answerNotice = createAnswerNotice(kunciJawaban, kondisiJawaban);
    answerNoticeDiv.innerHTML = answerNotice;
    /* const soal = createNewSoal(dataSoal, noSoal);
    return soal; */

    /*    console.log(createNewSoal(dataSoal, currentQuestionIndex)); */
  } else {
    kondisiJawaban = 0;
    btnJawabSalah.classList.toggle("btn-danger");
    btnJawabBenar.classList.toggle("btn-success");
    console.log("Salah");
    const answerNotice = createAnswerNotice(kunciJawaban, kondisiJawaban);
    answerNoticeDiv.innerHTML = answerNotice;
    soalSalah += 1;
    console.log("salah = " + soalSalah);
  }
}
let currentQuestionIndex;
let isProcessing = false;
let soalSalah = 0;
const btn = document.querySelector(".start-btn");
btn.addEventListener("click", async function () {
  try {
    currentQuestionIndex = 0;

    const m = await getSoal();
    const dataSoal = brokeAPI(m);
    const container = document.querySelector(".area");
    console.log("!!!");
    const soalJadi = createNewSoal(dataSoal, currentQuestionIndex);
    container.innerHTML = soalJadi;

    document.addEventListener("click", async function (e) {
      //Pilihan Ganda diklik

      if (e.target.classList.contains("btn-primary")) {
        if (isProcessing) {
          return;
        }
        isProcessing = true;
        try {
          const spanText = e.target.querySelector("span")?.textContent.trim();
          const jawabanSoal = spanText;
          //Memuat Soal Pertama

          if (currentQuestionIndex == 0) {
            console.log("INi di if currentQuestionIndex == 0");
            console.log(dataSoal[currentQuestionIndex].jawaban);
            console.log("jawabanSoal = " + jawabanSoal);

            await koreksi(
              jawabanSoal,
              dataSoal[currentQuestionIndex].jawaban,
              soalSalah
            );
            currentQuestionIndex += 1;
            console.log("nilai cQI = " + currentQuestionIndex);
            setTimeout(() => {
              console.log("ini setTimeOut");
              container.innerHTML = createNewSoal(
                dataSoal,
                currentQuestionIndex
              );
              isProcessing = false;
            }, 5000);
          }
          //Memuat Soal Kedua dan seterusnya...
          else if (currentQuestionIndex < dataSoal.length) {
            await koreksi(jawabanSoal, dataSoal[currentQuestionIndex].jawaban);
            if (currentQuestionIndex + 1 >= dataSoal.length) {
              // Soal Selesai
              setTimeout(() => {
                console.log("Soal habis");
                const result = resultSoal(soalSalah, dataSoal);
                container.innerHTML = result;
              }, 3000);
              return;
            }
            console.log("nilai cQI = " + currentQuestionIndex);
            setTimeout(() => {
              console.log("ini setTimeOut" + currentQuestionIndex);
              container.innerHTML = createNewSoal(
                dataSoal,
                currentQuestionIndex
              );
              isProcessing = false;
            }, 5000);

            console.log(
              "currentQuestionIndex sudah ditambahkan! = " +
                currentQuestionIndex
            );
            currentQuestionIndex += 1;
          }
        } catch (errors) {
          console.log(errors);
        }
      } else {
        isProcessing = false;
      }
    });
  } catch (err) {
    console.error(err);
  }
});
