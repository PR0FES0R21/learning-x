$(document).ready(function () {
  listing();
});

function listing() {
  $.ajax({
    type: "GET",
    url: "/movie",
    data: {},
    success: function (response) {
      let rows = response["movies"];
      for (let i = 0; i < rows.length; i++) {
        let image = rows[i]["image"];
        let title = rows[i]["title"];
        let description = rows[i]["description"];
        let star = rows[i]["star"];
        let comment = rows[i]["comment"];

        let star_image = "⭐".repeat(star);

        let temp_html = `
        <div class="col">
            <div class="card h-100">
                <img src="${image}"
                    class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <p>${star_image}</p>
                    <p class="mycomment">${comment}</p>
                </div>
            </div>
        </div>
                    `;
        $("#cards-box").append(temp_html);
      }
    },
  });
}

function posting() {
  let url = $("#url").val();
  let star = $("#star").val();
  let comment = $("#comment").val();

  if (url.toLowerCase() == "del" || comment.toLowerCase() == "del" || star.toLowerCase() == "del") {
      $.ajax({
        type: "POST",
        data: {
          'table': 'movies'
        },
        url: "/delete_all",
        success: (response) => {
          window.location.reload();
        }
      }) 
  } else if (!url || !star || !comment) {
        showMessage("#warning");
    } else {
    // Mengubah tombol menjadi spinner dan tidak dapat diklik
    updateButtonState(true);

    $.ajax({
      type: "POST",
      url: "/movie",
      data: {
        url_give: url,
        star_give: star,
        comment_give: comment,
      },
      success: function (response) {
        // Mengembalikan tombol ke tampilan semula setelah request selesai
        updateButtonState(false);

        if (response['msg'] == 1) {
          showMessage("#info");
        } else if (response['msg'] == 2) {
          showMessage("#success");
        } else if (response['msg'] == 0) {
          showMessage("#error");
        }
        
        $("#url").val('');
        $("#star").val('');
        $("#comment").val('');
        listing();
      }
    });
  }
}

function showMessage(elementId) {
  $(elementId).removeClass("d-none");
  setTimeout(function() {
    $(elementId).addClass("d-none");
  }, 1500);
}

function updateButtonState(isLoading) {
  const button = $('#Save');
  if (isLoading) {
    button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...');
    button.prop('disabled', true);
    button.css({
      'pointer-events': 'none',
      'opacity': '0.5'
    });
  } else {
    button.html('Save');
    button.prop('disabled', false);
    button.css({
      'pointer-events': 'auto',
      'opacity': '1'
    });
  }
}



function open_box() {
  $("#post-box").show();
}
function close_box() {
  $("#post-box").hide();
}
