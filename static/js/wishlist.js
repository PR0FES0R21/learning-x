$(document).ready(function () {
    show_bucket();
  });

  function show_bucket() {
    $("#bucket-list").empty();
    $.ajax({
      type: "GET",
      url: "/bucket",
      data: {},
      success: function (response) {
        let rows = response["buckets"];
        for (let i = 0; i < rows.length; i++) {
          let bucket = rows[i]["bucket"];
          let num = rows[i]["num"];
          let done = rows[i]["done"];

          let temp_html = "";
          if (done === 0) {
            temp_html = `<li>
                            <h2>✅ ${bucket}</h2>
                            <button onclick="done_bucket(${num})" type="button" class="btn btn-outline-primary">Done!</button>
                            <button onclick="if (confirm('Are you sure you want to delete this bucket?')) { del_bucket(${num}) }" type="button" class="btn btn-danger">Delete</button>
                         </li>
          `;
          } else {
            temp_html = `<li>
                            <h2 class="done">✅ ${bucket}</h2>
                            <button onclick="if (confirm('Are you sure you want to delete this bucket?')) { del_bucket(${num}) }" type="button" class="btn btn-danger">Delete</button>
                         </li>`;
          }
          $("#bucket-list").append(temp_html);
        }
      },
    });
  }

  function save_bucket() {
    let bucket = $("#bucket").val();
    $.ajax({
      type: "POST",
      url: "/bucket",
      data: { bucket_give: bucket },
      success: function (response) {
        alert(response["msg"]);
        window.location.reload();
      },
    });
  }

  function done_bucket(num) {
    $.ajax({
      type: "POST",
      url: "/bucket/done",
      data: { num_give: num },
      success: function (response) {
        alert(response["msg"]);
        window.location.reload();
      },
    });
  }

  function del_bucket(num) {
    $.ajax({
      type: "POST",
      url: "/bucket/del",
      data: { num_give: num },
      success: function (response) {
        alert(response["msg"]);
        window.location.reload();
      },
    });
  }
