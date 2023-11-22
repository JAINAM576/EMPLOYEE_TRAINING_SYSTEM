var i = 1;
var total = 0;
document.addEventListener("click", totalchange);
document.addEventListener("click", totalque);
function totalque() {
    $("#total_question").val(i - 1);
}
function totalchange() {
    total = 0;
    var j = 0;
    var easy = Number($("#easy_marks").val());
    var medium = Number($("#medium_marks").val());
    var hard = Number($("#hard_marks").val());

    for (j = 0; j != i + 1; j++) {
        box = "#toughness_" + j;
        val = $(box).val();
        if (val == "Easy") {
            total += easy;
        }
        else if (val == "Medium") {
            total += medium;
        }
        else if (val == "Hard") {
            total += hard;
        }
    }
    console.log((total))
    $("#total_marks").val(total);
}


$(document).ready(function () {
    $("#btn-addque").click(function () {
        $("#quiz_container").append(
            `<div class="container quiz_box row" id="quiz_box_` + i + `">
<span class="que-no ">`+ i + `</span>
<input type="text" class="form-control mt-5" id="quiz_question" placeholder="Quiz Question"
    name="quiz_question_`+ i + `">

<div class="mb-3 col-6 mt-4">
    <input type="text" class="form-control" id="option_`+ i + `_1" placeholder="Option-1"
        name="option_`+ i + `_1">
</div>
<div class="mb-3 col-6 mt-4">
    <input type="text" class="form-control" id="option_`+ i + `_2" placeholder="Option-2"
        name="option_`+ i + `_2">
</div>
<div class="mb-3 col-6 ">
    <input type="text" class="form-control" id="option_`+ i + `_3" placeholder="Option-3"
        name="option_`+ i + `_3">
</div>
<div class="mb-3 col-6">
    <input type="text" class="form-control" id="option_`+ i + `_4" placeholder="Option-4"
        name="option_`+ i + `_4">
</div>
<div class="mb-3 mt-4 col-6">
    <label for="toughness_`+ i + `" class="form-label" style="margin-bottom: 0 !important;">Toughness :</label>
    <select class="form-select form-control" id="toughness_`+ i + `" name="toughness_` + i + `">
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
    </select>
</div>
<div class="mb-3 mt-4 col-6">
    <label for="correct_`+ i + `" class="form-label" style="margin-bottom: 0 !important;">Correct :</label>
    <select class="form-select form-control" id="correct_`+ i + `" name="correct_` + i + `">
      <option>Option-1</option>
      <option>Option-2</option>
      <option>Option-3</option>
      <option>Option-4</option>
    </select>
</div>
</div>`
        );
        i++;
    });
});

$(document).ready(function () {
    $("#btn-removeque").click(function () {
        box = "#quiz_box_" + (i - 1);
        $(box).remove();
        if (i != 1) {
            i--;
        }
    });
});