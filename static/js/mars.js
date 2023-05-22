$(document).ready(function () {
    show_order();
  });

  function show_order() {
    $.ajax({
      type: "GET",
      url: "/getmars",
      data: {},
      success: (response) => {
        let orders = response["orders"];
        orders.forEach((order) => {
          let name = order["name"];
          let address = order["address"];
          let size = order["size"];

          let temp_html = `
            <tr>  
              <td>${name}</td> 
              <td>${address}</td> 
              <td>${size}</td>
            </tr>`;

          $("#orders_box").append(temp_html);
        });
      },
    });
  }

  function save_order() {
    let name = $("#name").val();
    let address = $("#address").val();
    let size = $("#size").val();
    
    if (!name || !address || !size) {
        alert("Data yang Anda masukkan tidak lengkap!");
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/postmars",
        data: {
        name_give: name,
        address_give: address,
        size_give: size,
        },
        success: function (response) {
        alert(response["msg"]);
        window.location.reload();
        },
    });
  }
      