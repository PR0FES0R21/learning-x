      $(document).ready(function () {
        set_temp()
        show_comment();
      });
      function set_temp() {
        setInterval(function() {
          $.ajax({
            type: "GET",
            url: "http://spartacodingclub.shop/sparta_api/weather/seoul",
            data: {},
            success: function(response) {
              $("#temp").text(response["temp"]);
              console.clear()
            },
          });
        }, 1000);
      }

      function show_comment() {
        $.ajax({
          type: "GET",
          url: "/homework",
          data: {},
          success: function (response) {
            let datas = response.message;
            datas.forEach((data) => {
              let temp_html = `
              <div class="card">
                <div class="card-body">
                  <blockquote class="blockquote mb-0">
                    <p>${data.comment}</p>
                    <footer class="blockquote-footer">${data.name}</footer>
                  </blockquote>
                </div>
              </div>`;
              $("#comment-list").append(temp_html);
            }); //end loop
          }, //end success
        }); //end ajax
      }

      const saveComment = () => {
        function encodeHTML(str) {
          return str.replace(/[&<>"']/g, function (match) {
            return {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            }[match];
          });
        }

        function stripHTMLTags(str) {
          return str.replace(/(<([^>]+)>)/gi, "");
        }

        let name = $("#name").val();
        let comment = $("#comment").val();

        if (name.toLowerCase() == "del" || comment.toLowerCase() == "del") {
          $.ajax({
            type: "GET",
            data: {},
            url: "/delete_all",
            success: (response) => {
              alert(response["msg"]);
              window.location.reload();
            },
          });
        } else if (name == "" || comment == "") {
          alert("silahkan masukan nama dan komentar!");
          return;
        } else {
          $.ajax({
            type: "POST",
            url: "/homework",
            data: { name_give: name, comment_give: comment },
            success: (response) => {
              alert(response["msg"]);
              // Clear the comment input fields
              $("#name").val("");
              $("#comment").val("");
              // Append the new comment to the comment list
              let temp_html = `
              <div class="card">
                <div class="card-body">
                  <blockquote class="blockquote mb-0">
                    <p>${encodeHTML(comment)}</p>
                    <footer class="blockquote-footer">${encodeHTML(name)}</footer>
                  </blockquote>
                </div>
              </div>`;
              $("#comment-list").append(temp_html);
            }, // end success
          }); // end ajax
        }
      };