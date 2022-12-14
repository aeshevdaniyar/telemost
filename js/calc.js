function tarifCalc(
  el,
  startPrice,
  technicalSupport,
  perMembersPrice,
  counterStart = 3,
  counterPerMembers = 1,
  counterMax,
  subscription = false,
  perPrice = []
) {
  const price = `${el} .dostup-border-price2 .tarif-price`;
  let subValue = 0;
  let value = startPrice;
  let count = 0;
  let isTechnicalSupport = false;
  let membersCount = counterStart;
  $(price).text(numberWithSpaces(startPrice));

  if (technicalSupport) {
    $(`${el} .dostup-border-tgl input`).on("change", function (e) {
      if ($(`${el} .dostup-border-tgl input`).is(":checked")) {
        $(`${el} .dostup-border-price-absolute`).show(100);
        calc(price, 50000, value);
        isTechnicalSupport = true;
      } else {
        $(`${el} .dostup-border-price-absolute`).hide(100);
        calc(price, -50000, value);
        isTechnicalSupport = false;
      }
    });
  }
  if (subscription) {
    const checkboxes = document.querySelectorAll(`${el} .checkbox-main input`);
    $(checkboxes[0]).prop("checked", true);

    subValue = numberWithSpaces(parseInt($(checkboxes[0]).val()));
    value = parseInt($(checkboxes[0]).val());

    perMembersPrice = perPrice[0];

    $(price).text(subValue);

    $(`${el} .checkbox-main input`).on("change", function (e) {
      value = parseInt(e.target.value);
      $(price).text(numberWithSpaces(value));
      perMembersPrice = perPrice[$(e.target).data("id")];
      value = value + perMembersPrice * count;
      $(price).text(numberWithSpaces(value));
    });
  }

  function onClick(type) {
    if (type == "minus") {
      calc(price, -perMembersPrice);
      membersCount = membersCount - counterPerMembers;
      count--;
    } else {
      calc(price, perMembersPrice);
      membersCount = membersCount + counterPerMembers;
      count++;
    }
  }
  function calc(el, num1) {
    value += num1;

    $(el).text(numberWithSpaces(value));
  }
  counter(
    `${el} .dostup-border-inner-wrap`,
    counterPerMembers,
    onClick,
    counterStart,
    counterMax
  );

  $(`${el} .dostup-border-button3 button`).click(function () {
    $(`.modal.js-modal[data-modal="${$(this).data("modal")}"]`).addClass(
      "is-open"
    );

    $(
      `.modal.js-modal[data-modal="${$(this).data(
        "modal"
      )}"] .modap-price-suptitle`
    ).text(`${numberWithSpaces(value)} ₽`);
    $(".modal-inner2-title2.members").text(membersCount);
    $(".modal-inner2-border.support .modal-inner2-title2").text(
      isTechnicalSupport ? "Включена" : "Отключена"
    );
    $(".modal-inner2-border.support .modal-inner2-suptitle").text(
      isTechnicalSupport
        ? "Расширенная поддержка"
        : "Базовая техническая поддержка"
    );
  });
}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function deleteSpaces(str) {
  return str.replace(/\s/g, "");
}
function counter(el, perMembers, onClick, start, max) {
  let value = start;
  const content = `${el} .dostup-border-number2`;
  const minus = `${el} .dostup-border-border.minus`;
  const plus = `${el} .dostup-border-border.plus`;

  $(content).text(start);

  if (value <= start) {
    $(minus).css({ display: "none" });
  } else {
    $(minus).css({ display: "block" });
  }

  $(minus).click(function () {
    value -= perMembers;
    if (value < max) {
      $(plus).css({ display: "block" });
    }
    if (value <= start) {
      $(content).text(start);
      $(minus).css({ display: "none" });
      onClick("minus");
    } else {
      $(content).text(value);
      $(minus).css({ display: "block" });

      onClick("minus");
    }
  });

  $(plus).click(function () {
    value += perMembers;
    $(minus).css({ display: "block" });
    if (value >= max) {
      onClick("plus");
      $(content).text(max);
      $(plus).css({ display: "none" });
    } else {
      $(content).text(value);
      $(plus).css({ display: "block" });

      onClick("plus");
    }
  });
}