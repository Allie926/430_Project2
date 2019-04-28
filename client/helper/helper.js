const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#moneyMessage").animate({width:'toggle'},1000);
}

const redirect = (response) => {
	$("#moneyMessage").animate({width:'hide'},1000);
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });        
}